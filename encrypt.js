const { Transform } = require("node:stream");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream");

class Encrypt extends Transform {
  constructor({ fileSize }) {
    super();

    this.fileSize = fileSize;
    this.bytesRead = 0;
  }

  _transform(chunk, encoding, callback) {
    const bytesReadUpdated = (this.bytesRead += chunk.length);
    const percentRead = (bytesReadUpdated / this.fileSize) * 100;
    if (percentRead.toFixed() <= 20) {
      console.log(`${percentRead.toFixed()}% of file read`);
    } else if (20 < percentRead.toFixed() >= 30) {
      console.log(`${20}% of file read`);
    }
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 255) {
        chunk[i] = chunk[i] + 1;
      }
    }

    this.push(chunk);
    callback();
  }
}

(async () => {
  const readFile = await fs.open("../test.txt", "r");
  const writeFile = await fs.open("write.txt", "w");
  const readStream = readFile.createReadStream();
  const writeStream = writeFile.createWriteStream();

  const encrypt = new Encrypt({ fileSize: (await readFile.stat()).size });
  // readStream.pipe(encrypt).pipe(writeStream);
  pipeline(readStream, encrypt, writeStream, (err) => {
    console.log(err);
  });
})();
