const fs = require("fs");
const path = require("path");

const pathToLib = path.join(__dirname, "lib");
const files = fs.readdirSync(pathToLib).filter((file) => file.endsWith(".js"));

for (const file of files) {
  const { name } = path.parse(file);
  exports[name] = require(`./lib/${file}`);
}