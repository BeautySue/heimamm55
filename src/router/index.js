/*路由基本使用
1：安装  vue-router
2:导入  import VueRouter from 'vue-router'
3:注册  Vue.use(VueRouter)
4:实例化  const router=new VueRouter({routes:[]})
5:注入到new Vue({router})
6:路由出口  router-view
*/

// 2:导入
import VueRouter from 'vue-router'
// 3:注册
import Vue from 'vue'
Vue.use(VueRouter)
// 4:实例化
import login from '@/views/login/login.vue'
import layout from '@/views/layout/layout.vue'
import chart from '@/views/layout/chart/chart.vue'
import userList from '@/views/layout/userList/userList.vue'
import question from '@/views/layout/question/question.vue'
import business from '@/views/layout/business/business.vue'
import subject from '@/views/layout/subject/subject.vue'
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: login,
      meta: {
        title: '登陆',
        roleArr: ['超级管理员', '管理员', '老师', '学生']
      }
    },
    {
      path: '/login',
      component: login,
      meta: {
        title: '登陆',
        roleArr: ['超级管理员', '管理员', '老师', '学生']
      }
    },
    {
      path: '/layout',
      component: layout,
      redirect: '/layout/chart',
      children: [
        {
          path: 'chart', //写/号是完整 path,不写它是相对于自己父级的地址(父级path+"/"+"自己地址")
          component: chart,
          // 路由元信息
          meta: {
            title: '数据概览',
            icon: 'el-icon-pie-chart',
            roleArr: ['超级管理员', '管理员', '老师']
          }
        },
        {
          path: 'userList', //写/号是完整 path,不写它是相对于自己父级的地址(父级path+"/"+"自己地址")
          component: userList,
          meta: {
            title: '用户列表',
            icon: 'el-icon-user',
            roleArr: ['超级管理员', '管理员']
          }
        },
        {
          path: 'question', //写/号是完整 path,不写它是相对于自己父级的地址(父级path+"/"+"自己地址")
          component: question,
          meta: {
            title: '题库列表',
            icon: 'el-icon-edit-outline',
            roleArr: ['超级管理员', '管理员', '老师']
          }
        },
        {
          path: 'business', //写/号是完整 path,不写它是相对于自己父级的地址(父级path+"/"+"自己地址")
          component: business,
          meta: {
            title: '企业列表',
            icon: 'el-icon-office-building',
            roleArr: ['超级管理员', '管理员', '老师']
          }
        },
        {
          path: 'subject', //写/号是完整 path,不写它是相对于自己父级的地址(父级path+"/"+"自己地址")
          component: subject,
          meta: {
            title: '学科列表',
            icon: 'el-icon-notebook-2',
            roleArr: ['超级管理员', '管理员', '老师', '学生']
          }
        }
      ]
    }
  ]
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 进入前
import store from '@/store/index.js'
import { localRemove } from '@/utils/local.js'
import { Message } from 'element-ui'
router.beforeEach((to, from, next) => {
  nprogress.start()
  // if(当前路由==用户列表 && （角色 ==管理员 || 角色 ==超级管理员))
  //if（需要进入的路由元里的数组包含当前角色 ）{允许 通过}else{跳转到登陆页}
  if (to.meta.roleArr.includes(store.state.role)) {
    next()
  } else {
    // 提示用户
    Message.warning('您无权访问该页面')
    // 删除token,
    localRemove()
    //跳转至登陆页
    next('/')
  }
})
// 进入后
router.afterEach((to, from) => {
  document.title = to.meta.title
  nprogress.done()

  window.console.log(from)
})

export default router
// 5:注入到new Vue({router})
// 6:路由出口  router-view     123
