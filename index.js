//命令行程序的入口用 cli.js，别人引用我们的命令行: node cli
//别人引用我们的逻辑，入口在 index.js
//注意 package.json 的 bin 和 main

//引入可以制作控制台列表的库：inquirer
const inquirer = require('inquirer')

const db = require('./db.js')

module.exports.add = async (taskName) => {
  // 读取之前的任务: 展示任务清单
  const list = await db.read()
  // 往里面添加一个任务
  list.push({title: taskName, done: false})
  // 往home文件存入这个任务
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

function markAsUnDown(list,index){
  list[index].done=false
  db.write(list)
}
function markAsDown(list,index){
  list[index].done=true
  db.write(list)
}
function remove(list,index){
  list.splice(index,1)
  db.write(list)
}
function updateTitle(list,index){
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "新任务名",
    default:list[index].title
  },).then((answers) => {
    list[index].title=answers.title
    db.write(list)
  });
}

function askForAction(list,index){
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: '请按选择操作(选择：↑ 或 ↓，确认：Enter)',
        choices:[
          {name:'退出',value:'quit'},
          {name:'已完成',value:'markAsDown'},
          {name:'未完成',value:'markAsUnDown'},
          {name:'改标题',value:'updateTitle'},
          {name:'删除',value:'remove'},
        ],
      },
    ]).then((answers2)=>{
    switch (answers2.action){
      case 'quit':
        break;
      case 'markAsDown':
        markAsDown(list,index)
        break;
      case 'markAsUnDown':
        markAsUnDown(list,index)
        break;
      case 'remove':
        remove(list,index)
        break;
      case 'updateTitle':
        updateTitle(list,index)
        break;
    }
  })
}

function askForCreateTask(list){
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "请输入任务标题",
  }).then((answers) => {
    list.push({title:answers.title,done:false})
    db.write(list)
  });
}

function printTasks(list){
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'index',
        message: '请按选择想操作的任务(选择：↑ 或 ↓，确认：Enter)',
        choices:[{name:'-退出',value:-1},
          ...list.map((task,index)=>{
            return{name:`${task.done?'[x]':'[_]'} ${index+1} - ${task.title}`,value:(index).toString()}}),
          {name:'+创建任务',value: '-2'}
        ],
      },
    ])
    .then((answers) => {
      // log 证明 answers.index就是 choices 里的 value,其中index取自name
      const index=parseInt(answers.index)
      if(index>=0){
        // 选中了一个任务
        // askForAction
        askForAction(list,index)
      }else if(index===-1){
        // 退出
      }else if(index===-2){
        // 创建一个任务
        // createTask
        askForCreateTask(list)
      }
    })
}

module.exports.showAll = async () => {
  //读取之前任务清单
  const list = await db.read()
  //打印之前任务清单
  //printTasks
  printTasks(list)
}