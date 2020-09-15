import _fetch from '@/utils/request.js'
// 获取列表数据
export function getBusinessList (params) {
  return _fetch({
    url: '/enterprise/list',
    method: 'get',
    params
  })
}
// 新增学科
export function addBusiness (data) {
  return _fetch({
    url: '/enterprise/add',
    method: 'post',
    data
  })
}
//状态设置
export function setBusinessStatus (data) {
  return _fetch({
    url: '/enterprise/status',
    method: 'post',
    data
  })
}
//删除
export function delBusiness (data) {
  return _fetch({
    url: '/enterprise/remove',
    method: 'post',
    data
  })
}
//编辑
export function editBusiness (data) {
  return _fetch({
    url: '/enterprise/edit',
    method: 'post',
    data
  })
}
