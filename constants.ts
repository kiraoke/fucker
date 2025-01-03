export const MEGABYTE_IN_64_KB = 400; // 25 megabytes = 400 x 64 kilobytes

interface Command {
  add: "add";
  get: "get";
}

export const command: Command = {
  add: "add",
  get: "get",
};

export const rootPath= `./fucker`
