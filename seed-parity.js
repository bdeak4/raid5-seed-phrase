function stripWithDistributedParity(data, blockCount, parityCount) {
  if (parityCount > 0 && blockCount - parityCount < 2) {
    throw new Error("not enough blocks to strip with parity");
  }

  const blocks = Array(blockCount)
    .fill(null)
    .map(() => []);

  const dataCount = blockCount - parityCount;
  const blockLength = Math.ceil(data.length / dataCount);

  let parityIndex = 0;
  for (let i = 0; i < blockLength; i++) {
    const row = data.slice(i * dataCount, (i + 1) * dataCount);
    while (row.length < dataCount) {
      row.push(row[row.length - 1]);
    }

    const parity = "0x" + bin2hex(xor(row.map(str2bin)));
    for (let j = 0; j < parityCount; j++) {
      row.splice(parityIndex++ % blockCount, 0, parity);
    }

    for (let j = 0; j < blockCount; j++) {
      blocks[j].push(row[j]);
    }
  }

  return blocks.map((block) => block.join(" "));
}

function str2bin(str) {
  return str
    .split("")
    .map((x) => x.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function bin2str(bin) {
  return bin
    .split(" ")
    .map((x) => String.fromCharCode(parseInt(x, 2)))
    .join("");
}

function bin2hex(bin) {
  return bin
    .split(" ")
    .map((x) => parseInt(x, 2).toString(16).toUpperCase())
    .join("");
}

function xor(strArr) {
  const maxLength = Math.max(...strArr.map((x) => x.length));
  const zeroPadded = strArr.map((x) => x.padStart(maxLength, "0"));

  let parity = "";
  for (let i = 0; i < maxLength; i++) {
    if (zeroPadded[0][i] === " ") {
      parity += " ";
      continue;
    }
    parity += zeroPadded.reduce((a, str) => a ^ str[i], 0);
  }
  return parity;
}

console.table(
  stripWithDistributedParity(
    "testiranjee test1 test2 test3 test4 test5 test6 test7 test8 test9".split(
      " "
    ),
    4,
    1
  ).map((x) => x.split(" "))
);
