import { SpeechHandler } from "./speech.handler";

const handler = new SpeechHandler({
  queryStringParameters: { message: "hello" },
});

describe("scope ", () => {
  it("works with async", async () => {
    const output = await handler.respond();
    const synthesisTask = output.SynthesisTask;
    expect(synthesisTask?.OutputFormat).toBe("mp3");
  });
});
