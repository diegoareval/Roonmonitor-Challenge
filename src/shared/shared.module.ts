import { Global, Module } from '@nestjs/common';
import { AwsS3Service } from './services/aws-s3.service';

@Global()
@Module({
  providers: [AwsS3Service],
})
export class SharedModule {}
