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
  <el-dialog :visible.sync="isShow" width="600px" class="subjectAdd">
    <div slot="title" class="title">
      {{ mode == 'add' ? '新增' : '编辑' }}学科
    </div>
    <el-form :model="form" label-width="80px" :rules="rules" ref="form">
      <el-form-item prop="rid" label="学科编号">
        <el-input v-model="form.rid"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="学科名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="short_name" label="学科简称">
        <el-input v-model="form.short_name"></el-input>
      </el-form-item>
      <el-form-item prop="intro" label="学科简介">
        <el-input v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item prop="remark" label="学科备注">
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
import { addSubject, editSubject } from '@/api/subject.js'
export default {
  watch: {
    // 关闭弹窗时清空数据
    isShow (newVal) {
      if (newVal === false) {
        //清空
        this.$refs.form.resetFields()
        this.form = {
          rid: '', //学科编号
          name: '', //学科名称
          short_name: '', //学科简称
          intro: '', //学科简介
          remark: '' //备注
        }
      }
    }
  },
  data () {
    return {
      mode: 'add',
      isShow: false,
      form: {
        rid: '', //学科编号
        name: '', //学科名称
        short_name: '', //学科简称
        intro: '', //学科简介
        remark: '' //备注
      },
      rules: {
        rid: [{ required: true, message: '请输入学科编号', trigger: 'change' }], //学科编号
        name: [{ required: true, message: '请输入学科名称', trigger: 'change' }]
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
            addSubject(this.form).then(() => {
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
            editSubject(this.form).then(() => {
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
.subjectAdd {
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
