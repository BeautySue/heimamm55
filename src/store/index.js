/*
1：安装  cnpm i vuex
2:导入   import Vuex from 'vuex'
3:注册  import Vue from 'vue'   Vue.use(Vuex)
4:实例化
    const store=new Vuex.Store({
        //共享数据
        state:{

        }
    })
5:注入到new Vue({store})   (export default store    import store from "./store")
*/

import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
const store = new Vuex.Store({
  // ...
  state: {
    userInfo: '', //用户信息
    roleObj: {
      1: '超级管理员',
      2: '管理员',
      3: '老师',
      4: '学生'
    },
    role: '超级管理员'
  }
})
export default store
