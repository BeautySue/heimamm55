<template>
  <!-- el-dialog
     visible控制是否显示 sync让它自带的关闭也能使用
     width
     slot="title/footer"重写某一部分
     fullscreen:是否全屏对话框
     show-close
 -->
  <el-dialog
    class="questionAdd"
    :visible="isShow"
    fullscreen
    :show-close="false"
  >
    <div slot="title" class="title">新增题库测试</div>
    <div class="add-main">
      <el-form :model="form" label-width="80px" :rules="rules" ref="form">
        <el-form-item label="学科" prop="subject">
          <el-select v-model="form.subject">
            <el-option
              v-for="(item, index) in subjectList"
              :key="index"
              :value="item.id"
              :label="item.short_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="step" label="阶段">
          <el-select v-model="form.step">
            <el-option
              v-for="(value, key, index) in stepObj"
              :key="index"
              :value="+key"
              :label="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="enterprise" label="企业">
          <el-select v-model="form.enterprise">
            <el-option
              v-for="(item, index) in businessList"
              :key="index"
              :value="item.id"
              :label="item.short_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 城市选择 -->
        <el-form-item label="城市" prop="city">
          <!-- {{ form.city }} -->
          <!-- <br /> -->
          <!-- {{ regionData }} -->
          <el-cascader
            v-model="form.city"
            :options="regionData"
            :props="{ value: 'label' }"
          ></el-cascader>
        </el-form-item>
        <!-- 题型 -->
        <el-form-item label="题型" prop="type">
          <!-- el-checkbox的值是用什么表示 label他radio一样  -->
          <el-radio-group v-model="form.type">
            <el-radio
              v-for="(value, key, index) in typeObj"
              :key="index"
              :label="+key"
              >{{ value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <!-- 难度 -->
        <el-form-item label="难度" prop="difficulty">
          <!-- el-checkbox的值是用什么表示 label他radio一样  -->
          <el-radio-group v-model="form.difficulty">
            <el-radio
              v-for="(value, key, index) in diffObj"
              :key="index"
              :label="+key"
              >{{ value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <hr />
        <el-form-item label="试题标题" class="add-title" prop="title">
          <!-- change事件 -->
          <quillEditor
            v-model="form.title"
            :options="{ placeholder: '请在这里输入' }"
            @change="validateItem('title')"
          ></quillEditor>
        </el-form-item>
        <!-- 单选多选简答 -->
        <el-form-item :label="typeObj[form.type]" :prop="typeAns[form.type]">
          <!-- 把单选多选简答抽离出来 -->
          <!-- props引用值时，它只要不修改它的引用，里面的值都是可以随便修改的,而且与父组件的值是二边联动 -->
          <selectItem :form="form" @validateItem="validateItem"></selectItem>
        </el-form-item>
        <el-form-item label="解析视频" prop="video">
          <hmupload v-model="form.video" type="video"></hmupload>
        </el-form-item>
        <el-form-item label="答案解析" class="add-title" prop="answer_analyze">
          <quillEditor
            v-model="form.answer_analyze"
            @change="validateItem('answer_analyze')"
            :options="{ placeholder: '请在这里输入' }"
          ></quillEditor>
        </el-form-item>
        <el-form-item label="试题备注" prop="remark">
          <el-input type="textarea" rows="3" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="footer">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 公有组件传值优先考虑prop
import { regionData } from 'element-china-area-data'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import selectItem from './selectItem'
import hmupload from '@/components/hmupload'
import { addQuestion, editQuestion } from '@/api/question.js'
export default {
  props: ['subjectList', 'stepObj', 'businessList', 'typeObj', 'diffObj'],
  components: {
    quillEditor,
    selectItem,
    hmupload
  },
  watch: {
    isShow (newVal) {
      if (!newVal) {
        //清空数据，清空错误验证
        this.form = JSON.parse(JSON.stringify(this.initForm))
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      }
    }
  },
  data () {
    return {
      mode: 'add',
      typeAns: {
        1: 'single_select_answer',
        2: 'multiple_select_answer',
        3: 'short_answer'
      },
      isShow: false,
      regionData: regionData,
      rules: {
        subject: [{ required: true, message: '必填', trigger: 'change' }], //	int	学科id标识
        step: [{ required: true, message: '必填', trigger: 'change' }], //	int	阶段1、初级 2、中级 3、高级
        enterprise: [{ required: true, message: '必填', trigger: 'change' }], //	int	企业id标识
        city: [{ required: true, message: '必填', trigger: 'change' }], //	array	[省、市、区县]
        type: [{ required: true, message: '必填', trigger: 'change' }], //	int	题型 1单选 、2多选 、3简答
        difficulty: [{ required: true, message: '必填', trigger: 'change' }], //	int	题目难度 1简单 、2一般 、3困难
        title: [{ required: true, message: '必填', trigger: 'change' }], //	string	标题
        single_select_answer: [
          { required: true, message: '必填', trigger: 'change' }
        ], //	string	单选题答案
        multiple_select_answer: [
          { required: true, message: '必填', trigger: 'change' }
        ], //	array	多选题答案
        short_answer: [{ required: true, message: '必填', trigger: 'change' }], //	string	简答题答案
        answer_analyze: [
          { required: true, message: '必填', trigger: 'change' }
        ], //	string	答案解析
        remark: [{ required: true, message: '必填', trigger: 'change' }] //	string	答案备注
      },
      initForm: '',
      form: {
        subject: '', //	int	学科id标识
        step: '', //	int	阶段1、初级 2、中级 3、高级
        enterprise: '', //	int	企业id标识
        city: [], //	array	[省、市、区县]
        type: 1, //	int	题型 1单选 、2多选 、3简答
        difficulty: '', //	int	题目难度 1简单 、2一般 、3困难
        title: '', //	string	标题
        video: '', //	string	解析视频地址
        single_select_answer: '', //	string	单选题答案
        multiple_select_answer: [], //	array	多选题答案
        short_answer: '', //	string	简答题答案
        answer_analyze: '', //	string	答案解析
        remark: '', //	string	答案备注
        select_options: [
          {
            label: 'A',
            text: '',
            image: ''
          },
          {
            label: 'B',
            text: '',
            image: ''
          },
          {
            label: 'C',
            text: '',
            image: ''
          },
          {
            label: 'D',
            text: '',
            image: ''
          }
        ] //	array	选项，介绍，图片介绍}
      }
    }
  },
  created () {
    this.initForm = JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    submit () {
      this.$refs.form.validate(result => {
        if (!result) {
          this.$message.warning('请完整填写内容')
        } else {
          if (this.mode == 'add') {
            addQuestion(this.form).then(() => {
              this.$message.success('添加成功')
              this.isShow = false
              this.$emit('search')
            })
          } else {
            editQuestion(this.form).then(() => {
              this.$message.success('编辑成功')
              this.isShow = false
              this.$emit('getData')
            })
          }
        }
      })
    },
    // 对某一项进行验证
    validateItem (str) {
      this.$refs.form.validateField(str)
    }
  }
  // 表单验证流程
  /*
  1：el-form来一个model绑定  
  2：在el-form绑定 rules   ref=值
  3:在需要验证的每一项来一个prop对应需要验证的值的key(el-form-item)
  4:写rules规则
  5:this.$refs.值.validate(result=>{true验证通过，false验证不通过})  
  
  */
}
</script>

<style lang="less">
.questionAdd {
  .title {
    height: 54px;
    line-height: 54px;
    color: #fff;
    font-weight: 500;
    padding-left: 20px;
    background: linear-gradient(to right, #01c5fa, #1199fa);
  }
  .el-dialog__header {
    padding: 0;
  }
  .footer {
    text-align: center;
  }
  .add-main {
    width: 832px;
    margin: 0 auto;
  }
  .add-title {
    .el-form-item__content {
      margin-left: 0 !important;
      margin-top: 50px;
    }
  }
}
</style>
