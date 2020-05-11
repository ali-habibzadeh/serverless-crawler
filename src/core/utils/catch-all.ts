import Catch from "catch-decorator";

// tslint:disable-next-line: variable-name
export const CatchAll = Catch(Error, (err) => console.log("APPLICATION_ERROR", err.message));
