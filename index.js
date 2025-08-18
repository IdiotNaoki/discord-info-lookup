const fs = require("fs");
const path = require("path");

const pathToLib = path.join(__dirname, "lib");
const functionsObj = {};

const files = fs.readdirSync(pathToLib).filter(file => file.endsWith(".js"));

for (const file of files) {
  const name = path.basename(file, ".js");
  const func = require(path.join(pathToLib, file));
  functionsObj[name] = func;
}

module.exports = functionsObj;