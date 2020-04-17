import { LambdaHandlerFactory } from "./lambda-handler.factory";

const context = {
  callbackWaitsForEmptyEventLoop: false,
  getRemainingTimeInMillis: () => 2,
  functionName: "handler1",
  functionVersion: "0.1",
  invokedFunctionArn: "some-arn",
  memoryLimitInMB: "10",
  awsRequestId: "some-id",
  logGroupName: "group",
  logStreamName: "stream",
  done: () => 3,
  fail: () => 3,
  succeed: (obj: any): void => {
    delete obj.prop;
  },
};

interface ITestContext {
  body: jest.Mock;
  lambda: AWSLambda.Handler<any, any>;
  callback: jest.Mock;
}

let testcontext!: ITestContext;

beforeEach(() => {
  const successfulBody = async (event: any) => event * 2;
  const testHandlers = { handler1: successfulBody };
  const lambdaFactory = new LambdaHandlerFactory(testHandlers);
  const lambda = Object.values(lambdaFactory.getHandlers())[0];
  testcontext = {
    lambda,
    body: jest.fn(successfulBody),
    callback: jest.fn(),
  };
});

test("When lambda executed with 2 correctly doubles value and returns", async () => {
  const actual = await testcontext.lambda(2, context, testcontext.callback);
  expect(actual).toBe(4);
});

test("When lambda executed with 4 correctly doubles value and returns", async () => {
  const actual = await testcontext.lambda(4, context, testcontext.callback);
  expect(actual).toBe(8);
});

test("When lambda executed, the callback is not run", async () => {
  await testcontext.lambda(2, context, testcontext.callback);
  expect(testcontext.callback.mock.calls.length).toBe(0);
});

test("When lambda failed, callback also recieved the error as argument", async () => {
  const failingBody = async (event: any) => {
    throw new Error(`Handler failed with ${event}`);
  };
  const testHandlers = { handler1: failingBody };
  const lambdaFactory = new LambdaHandlerFactory(testHandlers);
  const lamda = Object.values(lambdaFactory.getHandlers())[0];
  await expect(lamda(2, context, testcontext.callback)).rejects.toThrowError("Handler failed with 2");
});
