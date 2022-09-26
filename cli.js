#!/usr/bin/env node
//package.json 中添加 bin 需要以上代码，来自：node shebang

//注意 package.json 的 bin 和 main
//命令行程序的入口用 cli.js，他人可引用命令行: node cli
//他人可引用我们的逻辑，入口在 index.js

//引入控制 node 命令的库：commander
const  program  = require('commander');
const api=require('./index')
const pkg=require('./package.json')

program
  .version(pkg.version)
  .option('-d, --debug', 'output extra debugging')

program
  .command('add taskName')
  .description('add a task')
  .action((...args) => {
    const words=args.slice(0,-1).join(' ')
    api.add(words).then(()=>{console.log('添加成功')},()=>{console.log('添加失败')})
  });
program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear().then(()=>{console.log('清除成功')},()=>{console.log('清除失败')})
  });

program.parse(process.argv);

if (process.argv.length===2){
  //说明输入的命令是: node cli
  void api.showAll()
}
