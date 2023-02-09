const STRING_LEN = 20;
const PREFIX_LEN = 2;
const PAD_STRING = "raid.js__pad";
const BIN_PREFIX = "0b";
const HEX_PREFIX = "0x";

export function stripWithDistributedParity(data, blockCount) {
  if (blockCount < 3) {
    throw new Error("not enough blocks to strip with distributed parity");
  }

  const dataCount = blockCount - 1;
  const blockLength = Math.ceil(data.length / dataCount);

  const blocks = Array(blockCount)
    .fill(null)
    .map((_, i) => [`${i + 1}/${blockCount}`]);

  let parityIndex = 0;
  for (let i = 0; i < blockLength; i++) {
    const chunk = data.slice(i * dataCount, (i + 1) * dataCount);
    while (chunk.length < dataCount) {
      chunk.push(PAD_STRING);
    }

    const parity = bin2hex(xor(chunk.map(str2bin)));
    chunk.splice(parityIndex++ % blockCount, 0, parity);

    for (let j = 0; j < blockCount; j++) {
      blocks[j].push(chunk[j]);
    }
  }

  return blocks;
}

export function rebuildWithDistributedParity(blocks) {
  blocks.sort((a, b) => a[0].localeCompare(b[0]));

  let missingIndex = blocks.length;
  for (let i = 0; i < blocks.length; i++) {
    const index = parseInt(blocks[i][0].split("/")[0]) - 1;
    if (index !== i) {
      missingIndex = i;
      break;
    }
  }

  const data = [];
  for (let i = 1; i < blocks[0].length; i++) {
    const chunk = blocks.map((x) => x[i]);

    const parityIndex = chunk.findIndex((x) => x.startsWith("0x"));
    if (parityIndex !== -1) {
      const x2bin = (x) => (x.startsWith("0x") ? hex2bin : str2bin)(x);
      const rebuiltData = bin2str(xor(chunk.map(x2bin)));
      chunk.splice(missingIndex, 0, rebuiltData);
    }

    data.push(...chunk.filter((x) => !x.startsWith("0x") && x !== PAD_STRING));
  }
  return data;
}

function str2bin(str) {
  return encodeURIComponent(str)
    .padEnd(STRING_LEN)
    .split("")
    .reduce(
      (acc, char) => acc + char.charCodeAt(0).toString(2).padStart(8, "0"),
      BIN_PREFIX
    );
}

function bin2str(bin) {
  return decodeURIComponent(
    bin
      .replace(BIN_PREFIX, "")
      .match(/.{1,8}/g)
      .reduce((acc, char) => acc + String.fromCharCode(parseInt(char, 2)), "")
  ).trim();
}

function hex2bin(hex) {
  return hex
    .replace(HEX_PREFIX, "")
    .match(/.{1,2}/g)
    .reduce(
      (acc, char) => acc + parseInt(char, 16).toString(2).padStart(8, "0"),
      BIN_PREFIX
    );
}

function bin2hex(bin) {
  return bin
    .replace(BIN_PREFIX, "")
    .match(/.{1,8}/g)
    .reduce(
      (acc, char) => acc + parseInt(char, 2).toString(16).toUpperCase(),
      HEX_PREFIX
    );
}

function xor(binArr) {
  let parity = "";
  for (let i = PREFIX_LEN; i < binArr[0].length; i++) {
    parity += binArr.reduce((a, str) => a ^ str[i], "");
  }
  return BIN_PREFIX + parity;
}
