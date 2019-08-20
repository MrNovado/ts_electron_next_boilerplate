const fs = require("fs");
const path = require("path");
const packageJSON = require("./package.json");

const devPackageJSON = JSON.stringify(
  {
    // overrides
    private: true,
    main: "application/index.js",

    // inherited
    name: packageJSON.name,
    productName: packageJSON.productName,
    description: packageJSON.description,
    author: packageJSON.author || "author",
    copyright: packageJSON.copyright || "copyR",
    version: packageJSON.version,
    devDependencies: packageJSON.devDependencies,
    dependencies: packageJSON.dependencies,
  },
  null,
  2
);

const copyTo = path.join(__dirname, "compiled", "package.json");

fs.writeFileSync(copyTo, devPackageJSON, {
  encoding: "utf8",
});
