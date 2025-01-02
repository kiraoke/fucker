import chalk, { ChalkInstance } from "npm:chalk";

const success: ChalkInstance = chalk.hex("#8d7091").bold;
const error: ChalkInstance = chalk.hex("#cab774");
const msg: ChalkInstance = chalk.hex("#d7d7d5");

export { error, msg, success };
