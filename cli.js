#!/usr/bin/env node

import fs from "fs";
import * as raid5 from "./raid5.js";

const ACTION = {
  STRIPE: "stripe",
  REBUILD: "rebuild",
};

let data, action, args;
try {
  data = fs.readFileSync(process.stdin.fd, "utf-8").trim();
  action = process.argv[2];

  switch (action) {
    case ACTION.STRIPE:
      args = [parseInt(process.argv[3])];
      break;

    case ACTION.REBUILD:
      break;

    default:
      throw new Error("invalid action");
  }
} catch {
  console.error("Usage: ./cli.js [stripe|rebuild] [arguments] < [dataFile]");
  process.exit(1);
}

switch (action) {
  case ACTION.STRIPE:
    console.log(
      raid5
        .stripeWithDistributedParity(data.split(" "), ...args)
        .map((block) => block.join(" "))
        .join("\n")
    );
    break;

  case ACTION.REBUILD:
    console.log(
      raid5
        .rebuildWithDistributedParity(data.split("\n").map((x) => x.split(" ")))
        .join(" ")
    );
    break;
}
