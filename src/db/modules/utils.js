module.exports = {
  getCount: function (DB, condition) {
    return new Promise(resolve => {
      DB.countDocuments(condition, function (err, count) {
        if (err) {
          resolve(0)
        } else {
          resolve(count)
        }
      })
    })
  }
}
