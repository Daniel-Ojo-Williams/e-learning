import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from 'src/config/validateEnv';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { FileUpload } from 'src/lessons/types';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class UploadFile {
  constructor(private readonly env: ConfigService<EnvVariables, true>) {}

  async handleUpload(
    file: Promise<FileUpload>,
    key: string,
  ): Promise<{ mediaUrl: string; duration?: number }> {
    return this.cloudinaryUpload(file, key);
  }

  async s3Upload(file: Promise<FileUpload>, key: string) {
    const { createReadStream } = await file;
    const s3 = new S3Client({
      region: this.env.get('S3_REGION'),
      credentials: {
        accessKeyId: this.env.get('S3_ACCESSKEYID'),
        secretAccessKey: this.env.get('S3_ACCESSKEYSECRET'),
      },
    });

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: 'd-e-learning',
        Key: key,
        Body: createReadStream(),
      },
    });

    const { Location } = await upload.done();

    return { mediaUrl: Location };
  }

  async cloudinaryUpload(file: Promise<FileUpload>, key: string) {
    const { createReadStream } = await file;
    console.dir(createReadStream, { depth: null });
    cloudinary.config({
      api_key: this.env.get('API_KEY'),
      cloud_name: this.env.get('CLOUD_NAME'),
      api_secret: this.env.get('API_SECRET'),
    });

    try {
      const uploadResult = await new Promise<UploadApiResponse>((res, rej) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: key, resource_type: 'auto' },
          (error, result) => {
            if (error) rej(error);
            res(result);
          },
        );

        createReadStream().pipe(uploadStream);
      });

      const {
        secure_url,
        duration,
      }: { secure_url: string; duration?: number } = uploadResult;

      return { mediaUrl: secure_url, duration };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
