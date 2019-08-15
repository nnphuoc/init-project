'use strict';
import FS from 'fs';
import { fileUploadConfig } from '../config';
import Formidable from 'formidable';
import MimeType from 'mime-types';
import { UploadPhotos } from '../models';

export default class FileHelper {
    static async uploadFile(req, callback) {
        const { originFolder } = req.params;
        const now = new Date();
        now.setHours(now.getHours() + 7); // convert GMT +0 => GMT +7
        const folder = `${now.getMonth() +
            1}${now.getDate()}${now.getFullYear()}`;
        const count = await UploadPhotos.countDocuments({
            originFolder,
            folder
        });
        const subFolder = count + 1;
        const originFolderPath = `${__rootDir}/${
            fileUploadConfig.uploadFilePath
        }/${originFolder}`;
        if (!FS.existsSync(originFolderPath)) {
            FS.mkdirSync(originFolderPath);
        }
        const folderPath = `${originFolderPath}/${folder}`;
        if (!FS.existsSync(folderPath)) {
            FS.mkdirSync(folderPath);
        }
        const subFolderPath = `${folderPath}/${subFolder}`;
        if (!FS.existsSync(subFolderPath)) {
            FS.mkdirSync(subFolderPath);
        }
        const uploadDir = subFolderPath;
        const fileNames = [];
        const mimeRule = 'image.*';
        const form = new Formidable.IncomingForm();
        form.uploadDir = uploadDir;
        form.maxFileSize = 30 * 1024 * 1024;
        form.maxFields = 20;
        form.multiples = true;
        form.keepExtensions = true;

        form.parse(req, async (e, fields, files) => {
            if (e) {
                return callback(e);
            }
            try {
                if (files.img === undefined && files.file === undefined) {
                    return callback(new Error('NO_UPLOAD'));
                } else if (!Array.isArray(files.file)) {
                    files.file = [files.file];
                }
                const results = [];
                const uploadFiles = files.img || files.file;
                for (const file of uploadFiles) {
                    const fileName =
                        'upload_' + file.path.split('upload_').pop();
                    fileNames[fileNames.length] = fileName;
                    if (mimeRule) {
                        const uploadFileMime = FileHelper.getMime(
                            form.uploadDir + '/' + fileName
                        );
                        if (uploadFileMime && !uploadFileMime.match(mimeRule)) {
                            FileHelper.removeFile(fileName, form.uploadDir);
                            return callback(new Error('INVALID_FILE'));
                        }
                    }
                    const uploadInfo = {
                        fileName
                    };
                    results.push({
                        ...uploadInfo
                    });
                }
                const uploads = await UploadPhotos.create({
                    originFolder,
                    folder,
                    subFolder,
                    photos: results
                });
                return callback(null, uploads);
            } catch (e) {
                if (fileNames.length > 0) {
                    FileHelper.removeFile(fileNames, form.uploadDir);
                }
                return callback(e);
            }
        });
    }

    static removeFile(fileNames, path) {
        if (!Array.isArray(fileNames)) {
            fileNames = [fileNames];
        }
        for (const fileName of fileNames) {
            if (fileName && !fileName.startsWith('upload_')) {
                return true;
            }
            if (fileName) {
                const filePath = `${path}/${fileName}`;
                FS.access(filePath, FS.constants.F_OK, err => {
                    if (!err) {
                        FS.unlink(filePath, () => {});
                    }
                });
            }
        }
    }

    static getMime(filePath) {
        return MimeType.lookup(filePath);
    }
}
