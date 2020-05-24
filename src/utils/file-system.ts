import { promisify } from "util";
import { writeFile, mkdir, exists } from "fs";

export const write = promisify(writeFile);
export const makeDir = promisify(mkdir);
export const has = promisify(exists);
