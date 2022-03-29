#!/usr/bin/env node

const webpack = require("webpack");
const minimist = require("minimist");
const buildInWebpackConfig = require("../webpack.config");
const path = require("path");
const args = minimist(process.argv.slice(2));

const __commands = {};

const fname = "dd.config.js";

const runWebpackBuild = () => {
  webpack(buildInWebpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      return console.log("build failed!");
    }
    console.log("build success!", args);
  });
};

// 封装api
// 这个是作为参数塞到自定义插件函数中的，通过这个api往外暴露能力

const api = {
  registerCommands(name, impl) {
    const command = __commands[name];
    if (!command) {
      __commands[name] = impl;
    }
  },
};

// 读取用户的配置文件dd.config.js
const readLocalOption = () =>
  new Promise((resolve) => {
    const config = require(path.join(process.cwd(), fname));
    const {
      plugins: { commands = [] },
    } = config;
    if (commands.length) {
      commands.forEach((command) => {
        command(api);
      });
    }
    resolve(__commands);
  });

readLocalOption().then((commands) => {
  const command = args._[0];
  if (commands[command]) {
    commands[command]();
  } else {
    runWebpackBuild();
  }
});
