import _fetch from '@/utils/request.js'
// 获取列表数据
export function getQuestionList (params) {
  return _fetch({
    url: '/question/list',
    method: 'get',
    params
  })
}
// 设置状态
export function setQuestionStatus (data) {
  return _fetch({
    url: '/question/status',
    method: 'post',
    data
  })
}
// 删除
export function delQuestion (data) {
  return _fetch({
    url: '/question/remove',
    method: 'post',
    data
  })
}
//添加题目
export function addQuestion (data) {
  return _fetch({
    url: '/question/add',
    method: 'post',
    data
  })
}
//编辑题目
export function editQuestion (data) {
  return _fetch({
    url: '/question/edit',
    method: 'post',
    data
  })
}
