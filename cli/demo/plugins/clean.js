// 支持用户自定义的clean命令

module.exports = (options) => (api) => {
  // 输出传入的参数
  console.log(options);
  api.registerCommands("clean", (...args) => {
    // clean命令的逻辑
    console.log("执行clean命令成功");
  });
};
