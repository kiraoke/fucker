export const MEGABYTE_IN_64_KB = 200; // 15 megabytes = 200 x 64 kilobytes

interface Command {
  add: "add";
  get: "get";
}

export const command: Command = {
  add: "add",
  get: "get",
};

export const rootPath= `./fucker`
