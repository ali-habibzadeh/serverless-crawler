import { S3 } from "aws-sdk";

export class S3Service {
  private static instance: S3;
  private static region = process.env.region;

  private constructor() {}

  public static getInstance(): S3 {
    if (!S3Service.instance) {
      S3Service.instance = new S3({ region: S3Service.region, logger: console });
    }
    return S3Service.instance;
  }
}
