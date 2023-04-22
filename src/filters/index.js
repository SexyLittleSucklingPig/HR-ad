import dayjs from 'dayjs'

// 格式化时间
export const dateformat = function (time) {
  return dayjs(time).format('YYYY-MM-DD')
}
