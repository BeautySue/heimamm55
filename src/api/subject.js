import _fetch from '@/utils/request.js'
// 获取学科列表数据
export function getSubjectList (params) {
  return _fetch({
    url: '/subject/list',
    method: 'get',
    params
  })
}
// 新增学科
export function addSubject (data) {
  return _fetch({
    url: '/subject/add',
    method: 'post',
    data
  })
}
//状态设置
export function setSubjectStatus (data) {
  return _fetch({
    url: '/subject/status',
    method: 'post',
    data
  })
}
//删除
export function delSubject (data) {
  return _fetch({
    url: '/subject/remove',
    method: 'post',
    data
  })
}
//编辑
export function editSubject (data) {
  return _fetch({
    url: '/subject/edit',
    method: 'post',
    data
  })
}
