const { Transform } = require("node:stream");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream");

class Decrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 1) {
        chunk[i] = chunk[i] - 1;
      }
    }

    this.push(chunk);
    callback();
  }
}

(async () => {
  const readFile = await fs.open("write.txt", "r");
  const writeFile = await fs.open("decrypted.txt", "w");
  const readStream = readFile.createReadStream();
  const writeStream = writeFile.createWriteStream();

  const decrypt = new Decrypt();
  // readStream.pipe(encrypt).pipe(writeStream);
  pipeline(readStream, decrypt, writeStream, (err) => {
    console.log(err);
  });
})();
