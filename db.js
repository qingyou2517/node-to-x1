// 获取本机home目录: 存任务
const homedir = process.env.HOME || require('os').homedir()

const path = require('path')
const dbPath = path.join(homedir, '.todo')
const fs = require('fs')

const db = {
  read(path = dbPath) {
    //fs.readFile是异步函数,返回值可以用Promise封装
    return new Promise((resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (error, data) => {
        if (error) return reject(error)
        let list
        try {
          list = JSON.parse(data.toString())

        } catch (error2) {
          list = []
        }
        resolve(list)
      })
    })
  },
  write(list,path=dbPath) {
    return new Promise((resolve,reject)=>{
      const string=JSON.stringify(list)
      fs.writeFile(path,string+'\n',(error)=>{
        if (error) return reject(error)
        resolve()
      })
    })
  }
}

module.exports = db