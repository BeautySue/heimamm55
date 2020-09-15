<template>
  <!-- 整个路由权限处理
1：控制不能跳转至某路由（导航守卫）
2：控制菜单不显示没权限的菜单项（循环遍历处理路由配制，根据配制项做了一个v-if处理）
  addRouter(动态添加路由（根据用户信息接口返回的权限动态添加路由）)
3：每个页面内部按钮级别的控制（根据需求v-if）
权限  审批流程处理    
 -->
  <el-container class="layout">
    <el-header class="header">
      <div class="el-icon-s-fold icon" @click="bol = !bol"></div>
      <img class="logo" src="@/assets/img/layout_logo2.png" alt="" />
      <div class="title1">黑马面面</div>
      <div class="nouse"></div>
      <img
        v-if="$store.state.userInfo != ''"
        class="avatar"
        :src="baseUrl + '/' + $store.state.userInfo.avatar"
        alt=""
      />
      <div class="title2">{{ $store.state.userInfo.username }}，您好</div>
      <el-button type="primary" @click="exit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="auto" class="left">
        <!-- el-menu如果使用了router模式，
        那么点击它的子项，页面路由地址会变成index的值
        配制default-active为当前路由地址 this.$route.path
         -->
        <!-- 菜单权限处理
         1：在路由里面配制好相应菜单，
         2：通过循环遍历菜单来展示菜单，
         3：再根据路由元里配制的权限控制是否展示该菜单项
         
          -->
        <el-menu
          :default-active="$route.path"
          router
          class="el-menu-vertical-demo"
          :collapse="bol"
        >
          <template v-for="(item, index) in $router.options.routes[2].children">
            <!-- template点位符 -->
            <el-menu-item
              :index="'/layout/' + item.path"
              :key="index"
              v-if="item.meta.roleArr.includes($store.state.role)"
            >
              <i :class="item.meta.icon"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
          </template>

          <!-- <el-menu-item index="/layout/userList">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/business">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getUserInfo, logout } from '@/api/layout.js'
import { localRemove } from '@/utils/local.js'
export default {
  data () {
    return {
      userInfo: '',
      baseUrl: process.env.VUE_APP_URL,
      bol: false
    }
  },
  created () {
    window.console.log('router:', this.$router)
    // 调用用户信息接口
    // 1：在api中定义获取用户信息接口  2：首先导入该定义的方法  3：调用
    getUserInfo().then(res => {
      // this.userInfo = res.data
      this.$store.state.userInfo = res.data
      this.$store.state.role = this.$store.state.roleObj[res.data.role_id]
      //获取到角色后再判断 一次
      if (!this.$route.meta.roleArr.includes(this.$store.state.role)) {
        // 提示用户
        this.$message.warning('您无权访问该页面')
        // 删除token,
        localRemove()
        //跳转至登陆页
        this.$router.push('/')
        return
      }

      // 如果该帐号处于禁用状态，提示用户，然后丢到登陆
      if (res.data.status == 0) {
        this.$message.warning('该帐号已让禁用，请联系管理员')
        // 删除token
        localRemove()
        this.$router.push('/')
      }
      window.console.log('用户信息：', res)
    })
  },
  methods: {
    //   退出
    exit () {
      this.$confirm('您真的要退出该网站吗？', '友情提示', {
        confirmButtonText: '确定退出该网站',
        cancelButtonText: '我还是再逛逛',
        type: 'warning'
      }).then(() => {
        logout().then(() => {
          // 删除token
          localRemove()
          //跳转至登陆页
          this.$router.push('/')
        })
      })
    }
  }
}
</script>

<style lang="less">
.layout {
  height: 100%;
  .header {
    height: 60px;
    display: flex;
    align-items: center;
    .nouse {
      flex: 1;
    }
    .icon {
      font-size: 20px;
    }
    .logo {
      height: 28px;
      margin: 0 12px 0 22px;
    }
    .title1 {
      font-size: 22px;
      font-family: Microsoft YaHei Regular, Microsoft YaHei Regular-Regular;
      font-weight: bold;
    }
    .avatar {
      width: 43px;
      height: 43px;
    }
    .title2 {
      font-size: 14px;
      margin: 0 38px 0 9px;
    }
    // box-shadow: 0px 2px 5px 6px rgba(63, 63, 63, 0.35);
  }
  .left {
    // box-shadow: 0px 2px 5px 6px rgba(63, 63, 63, 0.35);
  }
  .main {
    background: #e8e9ec;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
</style>
