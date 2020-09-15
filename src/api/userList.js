import _fetch from '@/utils/request.js'
// 获取学科列表数据
export function getUserList (params) {
  return _fetch({
    url: '/user/list',
    method: 'get',
    params
  })
}
// 新增学科
export function addUser (data) {
  return _fetch({
    url: '/user/add',
    method: 'post',
    data
  })
}
//状态设置
export function setUserStatus (data) {
  return _fetch({
    url: '/user/status',
    method: 'post',
    data
  })
}
//删除
export function delUser (data) {
  return _fetch({
    url: '/user/remove',
    method: 'post',
    data
  })
}
//编辑
export function editUser (data) {
  return _fetch({
    url: '/user/edit',
    method: 'post',
    data
  })
}
