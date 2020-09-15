<template>
  <!-- 
    el-dialog
        visible控制弹框是否显示
        width设置宽度
        div slot="title"
        div  slot="footer"
    el-form
        model数据绑定  rules  label-width
    el-form-item  label 标题   prop绑定相应的值
    表单验证
       1：在el-form加一个rules属性
       2：在每一项里来一个prop绑定
       3：写rules规则
       4：全局验证  
           1:在el-form上定义一个ref
           2:this.$refs.值.validate(result=>{//true:验证通过 ，false验证失败})

   -->
  <el-dialog :visible.sync="isShow" width="600px" class="userListAdd">
    <div slot="title" class="title">
      {{ mode == 'add' ? '新增' : '编辑' }}用户
    </div>
    <el-form :model="form" label-width="80px" :rules="rules" ref="form">
      <el-form-item prop="username" label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="电话">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item prop="role_id" label="角色">
        <el-select v-model="form.role_id">
          <el-option
            v-for="(value, key, index) in $store.state.roleObj"
            :key="index"
            :label="value"
            :value="+key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-select v-model="form.status">
          <el-option :value="0" label="禁用"></el-option>
          <el-option :value="1" label="启用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="remark" label="用户备注">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="footer">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUser, editUser } from '@/api/userList.js'
export default {
  watch: {
    // 关闭弹窗时清空数据
    isShow (newVal) {
      if (newVal === false) {
        //清空
        this.$refs.form.resetFields()
        this.form = {
          username: '', //
          email: '', //
          phone: '', //
          role_id: '', //
          status: '', //
          remark: '' //
        }
      }
    }
  },
  data () {
    return {
      mode: 'add',
      isShow: false,
      form: {
        username: '', //
        email: '', //
        phone: '', //
        role_id: '', //
        status: '', //
        remark: '' //
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ], //
        email: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let _reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
              if (_reg.test(value)) {
                callback()
              } else {
                callback('请正确输入邮箱')
              }
            }
          }
        ], //
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let _reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
              if (_reg.test(value)) {
                callback()
              } else {
                callback('请正确输入手机号')
              }
            }
          }
        ], //
        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate(result => {
        if (!result) {
          this.$message.warning('请完整输入相关信息')
        } else {
          if (this.mode == 'add') {
            addUser(this.form).then(() => {
              // 弹出的提示，关闭弹框
              this.$message.success('添加成功')
              this.isShow = false
              // 子组件调用父组件方法  this.$parent.方法名()
              //新增成功后调用父组件方法刷新数据
              window.console.log('parent', this.$parent)
              this.$parent.search()
            })
          } else if (this.mode == 'edit') {
            //调用编辑接口
            editUser(this.form).then(() => {
              this.$message.success('编辑成功')
              this.isShow = false
              this.$parent.getData()
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.userListAdd {
  .title {
    height: 53px;
    line-height: 53px;
    text-align: center;
    color: #fff;
    font-weight: 700;
    background: linear-gradient(to right, #01c4fa, #1395fa);
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .footer {
    text-align: center;
  }
}
</style>
