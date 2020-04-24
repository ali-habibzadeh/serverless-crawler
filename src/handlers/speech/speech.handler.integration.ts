import { ConfigService } from "../../config/config.service";
import { S3Service } from "../../core/s3/s3.service";
import { SpeechHandler } from "./speech.handler";

jest.setTimeout(30000);

const handler = new SpeechHandler({
  queryStringParameters: { message: "hello" },
});

describe("scope ", () => {
  it("works with async", async () => {
    const output = await handler.respond();
    const synthesisTask = output.SynthesisTask;
    const s3 = S3Service.getInstance();
    const bucket = ConfigService.getInstance().environment.speechBucketName;
    const key = `${synthesisTask?.TaskId}.${synthesisTask?.OutputFormat}`;
    console.log(key);
    await s3.getObject({ Bucket: bucket, Key: key }).promise();
    expect(1).toBe(1);
  });
});
