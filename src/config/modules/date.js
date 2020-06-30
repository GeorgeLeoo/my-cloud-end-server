const { isLeapYear } = require('../../utils')

module.exports = {
  month: [31, isLeapYear(), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
}
