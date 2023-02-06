function strip(data, blockCount) {}

function stripWithDistributedParity(data, blockCount) {
  if (blockCount < 3) {
    throw new Error("not enough blocks to strip with distributed parity");
  }

  const blocks = Array(blockCount)
    .fill(null)
    .map(() => []);

  const dataCount = blockCount - 1;
  const blockLength = Math.ceil(data.length / dataCount);

  let parityIndex = 0;
  for (let i = 0; i < blockLength; i++) {
    const row = data.slice(i * dataCount, (i + 1) * dataCount);
    while (row.length < dataCount) {
      row.push(row[row.length - 1]);
    }

    const parity = "0x" + bin2hex(xor(row.map(str2bin)));
    row.splice(parityIndex++ % blockCount, 0, parity);

    for (let j = 0; j < blockCount; j++) {
      blocks[j].push(row[j]);
    }
  }

  return blocks;
}

function stripWithDualDistributedParity(data, blockCount) {}

function rebuild(blocks) {}

function rebuildWithDistributedParity(blocks) {
  const data = [];
  for (let i = 0; i < blocks[0].length; i++) {
    const row = blocks.map((x) => x[i]);
    const x2bin = (x) => (x.startsWith("0x") ? hex2bin : str2bin)(x);
    const parity = xor(row.map(x2bin));
    console.log(parity);
    console.log(str2bin("otorionralingologija"));
    console.log(bin2str(parity));
  }
  console.log(blocks);
  return data;
}

function rebuildWithDualDistributedParity(blocks) {}

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

function hex2bin(hex) {
  return hex
    .replace("0x", "")
    .match(/.{1,2}/g)
    .map((x) => parseInt(x, 16).toString(2).padStart(8, "0"))
    .join(" ");
}

function xor(strArr) {
  const maxLength = Math.max(...strArr.map((x) => x.split(" ").length));
  const zeroPad = (length) => "00000000 ".repeat(maxLength - length);
  const zeroPadded = strArr.map((x) => zeroPad(x.split(" ").length) + x);
  console.log(zeroPadded);

  let parity = "";
  for (let i = 0; i < zeroPadded[0].length; i++) {
    if (zeroPadded[0][i] === " ") {
      parity += " ";
      continue;
    }
    parity += zeroPadded.reduce((a, str) => a ^ str[i], 0);
  }
  return parity;
}

console.table(
  rebuildWithDistributedParity(
    stripWithDistributedParity(
      "otorionralingologija test1 test2 test3 test4 test5 test6 test7 test8 test9".split(
        " "
      ),
      4
    ).slice(1)
  )
);
