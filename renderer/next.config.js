const path = require("path");

const isProd = process.env.NODE_ENV === "production";
const alpath = rel => path.join(__dirname, rel);

module.exports = {
  assetPrefix: isProd ? "." : "",
  publicRuntimeConfig: {
    staticFolder: isProd ? "./static" : "../static",
  },
  webpack: function(config, _options) {
    // note: have to keep in-sync with tsconfig.commons!
    config.resolve.alias["@const"] = alpath("../constants");
    config.resolve.alias["@redux"] = alpath("../redux_store");

    // ugly hack to force next' webpack to transpile outside modules
    config.module.rules
      .filter(rule => rule.test.toString().includes("tsx|ts"))
      .forEach(rule => {
        rule.include = rule.include.concat([
          path.join(__dirname, "../constants"),
          path.join(__dirname, "../redux_store"),
        ]);
      });

    config.resolve.alias["@component"] = alpath("components");
    config.resolve.alias["@feature"] = alpath("features");
    config.resolve.alias["@page"] = alpath("pages");
    return Object.assign(config, {
      target: "electron-renderer",
    });
  },
};
