import { Request, RequestHandler } from 'express';
import multer, { diskStorage } from 'multer';
import data from '../../enum';

interface Services {
    createUploadInstance: (
        fieldName: string,
        maxFilesSizeInMb: number,
        multipleFiles?: boolean,
    ) => RequestHandler;
}

const services: Services = {
    createUploadInstance: (
        fieldName,
        maxFilesSizeInMb,
        multipleFiles = false,
    ) => {
        const storageDisk = diskStorage({
            destination: (_req, _file, callback) => {
                callback(null, process.cwd() + '/uploads');
            },
            filename: (_req, file, callback) => {
                callback(
                    null,
                    new Date().getTime() +
                        '-' +
                        encodeURIComponent(file.originalname),
                );
            },
        });

        const fileFilterDisk = function (
            _req: Request,
            file: Express.Multer.File,
            cb: multer.FileFilterCallback,
        ) {
            let allowedMimes: string[] = [];
            let errMsg =
                'Invalid file type. Only __REPLACE_MSG__ files are allowed';

            if (file.fieldname === 'image') {
                allowedMimes = data.supportedUploadType;
                errMsg = errMsg.replace('__Replace_MSG__', 'JPG, JPEG, PNG');
            } else if (file.fieldname === 'pdf') {
                allowedMimes = data.supportedUploadType;
                errMsg = errMsg.replace('__Replace_MSG__', 'PDF');
            } else if (file.fieldname === 'csv') {
                allowedMimes = data.supportedUploadType;
                errMsg = errMsg.replace('__Replace_MSG__', 'CSV');
            } else {
                allowedMimes = data.supportedUploadType;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                errMsg = errMsg.replace('__Replace_MSG__', 'WORD');
            }

            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        };

        const oMulterObject: multer.Options = {
            storage: storageDisk,
            fileFilter: fileFilterDisk,
            limits: {
                fileSize: maxFilesSizeInMb * 1024 * 1024,
            },
        };

        if (multipleFiles) {
            return multer(oMulterObject).any();
        } else {
            return multer(oMulterObject).single(fieldName);
        }
    },
};

export default services;
