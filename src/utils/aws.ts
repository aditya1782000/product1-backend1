import fs from 'fs';
import jimp from 'jimp';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3 = new S3({
    region: process.env.S3_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

interface FileObject {
    path: string;
    mimetype: string;
}

const uploadFileToS3 = async (
    ObjFile: FileObject,
    id: string,
    folderName: string,
    thumb: boolean = false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
    let fileBuffer = fs.readFileSync(ObjFile.path);

    if (thumb) {
        const jimpImage = await jimp.read(fileBuffer);
        fileBuffer = await jimpImage
            .scaleToFit(100, 100)
            .getBufferAsync(ObjFile.mimetype);
    }

    let filePath = `${folderName}/${id}`;

    if (process.env.S3_BUCKET_SUB_NAME != '') {
        filePath = `${process.env.S3_BUCKET_SUB_NAME}/${process.env.NODE_ENV}${filePath}`;
    }

    const params = {
        Body: fileBuffer,
        Bucket: process.env.S3_BUCKET_NAME,
        ContentType: ObjFile.mimetype,
        Key: filePath,
        cacheControl: 'no-store',
    };

    return new Upload({
        client: s3,
        params,
    }).done();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteFileFromS3 = (key: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        s3.deleteObject(params, function (err: unknown, _data: any) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const extractS3Key = (url: string) => {
    const regex = new RegExp(
        `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/(.*)`,
    );

    const match = url.match(regex);

    if (match && match[1]) {
        return match[1];
    }
    return null;
};

export { uploadFileToS3, deleteFileFromS3, extractS3Key };
