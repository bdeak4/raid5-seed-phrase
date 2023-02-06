const stripWithDistributedParity = (data, blockCount, parityCount) => {
  if (parityCount > 0 && blockCount - parityCount < 2) {
    throw new Error("not enough blocks to strip with parity");
  }

  const blocks = Array(blockCount)
    .fill(null)
    .map(() => []);

  const dataCount = blockCount - parityCount;
  const blockLength = Math.ceil(data.length / dataCount);

  for (let i = 0; i < blockLength; i++) {
    const dataRow = data.slice(i * dataCount, (i + 1) * dataCount);
    while (dataRow.length < dataCount) {
      dataRow.push(dataRow[dataRow.length - 1]);
    }

    const dataRowBin = dataRow.map(convertBin);
    console.log(dataRow, [...dataRowBin, xor(dataRowBin)]);
  }

  // let splitIndex = 0;
  // for (i = 0; i < words.length; i++) {
  //   const split = splits[splitIndex++ % splitCount];
  //   split[i] = "null";
  // }

  // console.log(i % splitCount);
  // splits[i % splitCount] = "null";
  // i++;
  // i = (i + 1) % splitCount;

  // for (const word of words) {
  //   for (const split of splits) {
  //     split.push(word);
  //     console.log(word, split);
  //   }
  //   //   seedSplits[0].push(word);
  // }

  // console.table(blocks);
};

function convertBin(str) {
  return str
    .split("")
    .map((x) => x.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function convertStr(bin) {
  return bin
    .split(" ")
    .map((x) => String.fromCharCode(parseInt(x, 2)))
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

const _str = (bin) => {
  return bin.replace(/\s*[01]{8}\s*/g, (bin) =>
    String.fromCharCode(parseInt(bin, 2))
  );
};

stripWithDistributedParity(
  "testiranjee test1 test2 test3 test4 test5 test6 test7 test8 test9".split(
    " "
  ),
  4,
  1
);

console.log(
  convertStr(
    xor([
      "01110100 01100101 01110011 01110100 00110010",
      "01110100 01100101 01110011 01110100 01101001 01110010 01100001 01101110 01101010 01100101 01100110",
      "01110100 01100101 01110011 01110100 01101001 01110010 01100001 01101110 01101010 01100101 01100101",
    ])
  )
);
