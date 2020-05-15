import Catch from "catch-decorator";

// tslint:disable-next-line: variable-name
export const CatchAll = Catch(Error, (err, ctx) => {
  console.log("c", err.message, JSON.stringify(ctx));
  throw new Error(err.message);
});
