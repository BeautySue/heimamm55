import _fetch from '@/utils/request.js'
// 获取数据
export function getChartList () {
  return _fetch({
    url: '/data/title',
    method: 'post'
  })
}
// 图表获取数据
export function getChartStatistics () {
  return _fetch({
    url: '/data/statistics',
    method: 'post'
  })
}
