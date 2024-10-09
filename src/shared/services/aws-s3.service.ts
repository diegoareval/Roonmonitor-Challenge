import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';

// S3 configuration
const S3_CONFIG: AWS.S3.Types.ClientConfiguration = {
  apiVersion: '2010-12-01',
  region: 'us-central-1',
};

@Injectable()
export class AwsS3Service {
  private readonly s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3(S3_CONFIG);
  }

  /**
   * Uploads an image file to an S3 bucket under the `images/` directory.
   * 
   * @param {Express.Multer.File} file - The image file to be uploaded.
   * @returns {Promise<string>} - The S3 key (path) of the uploaded file.
   */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return this.uploadFile(file, 'images/');
  }

  /**
   * Uploads a file to a specified directory in an S3 bucket.
   * 
   * @param {Express.Multer.File} file - The file object containing buffer data from Multer.
   * @param {string} prefix - The folder path where the file will be uploaded (e.g., `images/`).
   * @returns {Promise<string>} - The S3 key (path) of the uploaded file.
   */
  private async uploadFile(file: Express.Multer.File, prefix: string): Promise<string> {
    const originalFileName = file.originalname;  // Corrected file property for Multer
    const uniqueFileName = `${Date.now()}-${originalFileName}`;
    const key = `${prefix}${uniqueFileName}`;

    await this.s3.putObject({
      Bucket: process.env.BUCKET_NAME || 'sample',  // Use environment variable or default
      Body: file.buffer,
      ACL: 'public-read',  // File is publicly readable
      Key: key,  // Path in S3 bucket
    }).promise();

    return key;
  }
}
