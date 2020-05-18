import Catch from "catch-decorator";
import { inspect } from "util";

// tslint:disable-next-line: variable-name
export const CatchAll = Catch(Error, (err, ctx) => {
  const context = inspect(ctx);
  console.log("APP_ERROR", err.message, JSON.stringify(context));
  throw new Error(err.message);
});
