const fs = require("fs");
const { formatDate, formatDateTime } = require('./index')

const log = {
  saveLog(reason, name = '') {
    if (typeof reason === 'object') {
      reason = JSON.stringify(reason, null, 2)
    }
    reason += '\n'
    fs.appendFile('logs/' + name + formatDate() + ".txt", '\n' + formatDateTime(new Date()) + '\n' + reason, function (err) {
      if(err){
        return console.log(err)
      }
      console.log('log saved')
    })
  //   fs.exists('logs/', (exists) => {
  //     if (exists) {
  //       fs.appendFile('logs/' + name + formatDate() + ".txt", '\n' + formatDateTime(new Date()) + '\n' + reason, function (err) {
  //         if(err){
  //           return console.log(err)
  //         }
  //         console.log('log saved')
  //       })
  //     }
  //   });
  }
}

module.exports = log