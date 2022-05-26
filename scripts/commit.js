// Invoked on the commit-msg git hook by yorkie.

const chalk = require('chalk');
const msgPath = process.env.HUSKY_GIT_PARAMS;
console.log(msgPath);
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim();

const commitRE =
  /^Merge.+|(revert: )?(feat(@v\d+\.\d+(\.\d+)?)?|fix|docs|refactor|test|chore)(\(.+\))?: .{1,200}/;

if (!commitRE.test(msg)) {
  // console.log(); // 这个好像是为了加个空行，从vue官方那里抄过来的
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`提交格式不规范`)}\n\n` +
      chalk.red(`  务必按照规范填写提交信息，规范示例:\n\n`) +
      `    ${chalk.green(`fix: 修复任务管理模块的xxxx 问题`)}\n` +
      `    ${chalk.green(`feat@v5.5(taskModule): 新增策略管理模块`)}\n` +
      `    ${chalk.green(`fix(taskModule): 修复任务管理xxx的bug`)}`,
  );
  process.exit(1);
}
