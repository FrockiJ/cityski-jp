import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import axios from 'axios';
import { extname } from 'path';
import path from 'path';
import * as fs from 'fs/promises';
// import Multer from 'multer';

export class S3Service {
  bucketS3 = process.env.AWS_S3_BUCKET;

  async upload(
    file: Express.Multer.File,
    options?: {
      originalName?: boolean;
    },
  ): Promise<any>;

  async upload(
    filePath: string,
    options?: {
      originalName?: boolean;
    },
  ): Promise<any>;

  async upload(
    fileOrPath: Express.Multer.File | string,
    options?: {
      originalName?: boolean;
    },
  ): Promise<any> {
    let key: string;
    let buffer: Buffer;

    if (typeof fileOrPath === 'string') {
      // 如果是檔案路徑，從檔案中讀取內容
      key = options?.originalName
        ? String(path.basename(fileOrPath))
        : Date.now() + '_' + String(fileOrPath);

      buffer = await fs.readFile(fileOrPath);
    } else {
      // 如果是 Express.Express.Multer.File，使用提供的檔案內容
      const { originalname } = fileOrPath;
      key = options?.originalName
        ? String(originalname)
        : Date.now() + '_' + String(originalname);

      buffer = fileOrPath.buffer;
    }

    const contentType = this.getContentType(key);

    const command = new PutObjectCommand({
      Bucket: this.bucketS3,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    try {
      const response = await this.getS3Client().send(command);
      return { ...response, key };
    } catch (err) {
      console.error(err);
      throw err; // 可以選擇拋出錯誤或返回自訂錯誤訊息
    }
  }

  async uploadFromUrlToS3(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        decompress: false,
        responseType: 'arraybuffer',
      });
      const originalname = path.basename(url);
      const contentType = this.getContentType(originalname);
      // const key = Date.now() + '_' + String(originalname);
      // console.log(url);
      // console.log(response);
      // console.log(originalname);
      // Convert the response data to a Uint8Array
      // const arrayBuffer = new Uint8Array(response.data);
      // console.log(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: this.bucketS3,
        Key: originalname,
        Body: response.data,
        ContentType: contentType,
      });
      // console.log(command);
      const result = await this.getS3Client().send(command);
      console.log(result);
      return encodeURIComponent(originalname);
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  async get(key: string): Promise<any> {
    const bucketS3 = process.env.AWS_S3_BUCKET;
    const command = new GetObjectCommand({
      Bucket: bucketS3,
      Key: key,
    });
    try {
      const response = await this.getS3Client().send(command);
      console.log('s3 response', response);
      return { ...response };
    } catch (err) {
      console.log('s3 error');

      console.error(err);
    }
  }

  async check(key: string): Promise<boolean> {
    const bucketS3 = process.env.AWS_S3_BUCKET;
    const command = new HeadObjectCommand({
      Bucket: bucketS3,
      Key: key,
    });
    try {
      const isExists = await this.getS3Client().send(command);
      return isExists ? true : false;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }

  async delete(key: string): Promise<any> {
    console.log('delete', key);
    const bucketS3 = process.env.AWS_S3_BUCKET;
    const command = new DeleteObjectCommand({
      Bucket: bucketS3,
      Key: key,
    });
    try {
      const response = await this.getS3Client().send(command);
      console.log('s3 response', response);
      return { ...response };
    } catch (err) {
      console.log('s3 error');

      console.error(err);
    }
  }

  // Determine the MIME type of the file based on its extension
  getContentType(originalname: string): string {
    const extension = extname(originalname).toLocaleLowerCase();
    let contentType = '';
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.mp4':
        contentType = 'video/mp4';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      // Add cases for other file types as needed
      default:
        contentType = 'application/octet-stream';
    }
    return contentType;
  }

  getS3Client() {
    return new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
}
