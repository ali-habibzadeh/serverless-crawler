import Catch from "catch-decorator";

// tslint:disable-next-line: variable-name
export const CatchAll = Catch(Error, (err, ctx) => {
  console.log("APPLICATION_ERROR", err.message, ctx);
  throw new Error(err.message);
});
