<template>
  <div class="question">
    <el-card>
      <el-form :model="form" ref="form" label-width="80px">
        <el-row>
          <el-col :span="5">
            <el-form-item prop="subject" label="学科">
              <el-select v-model="form.subject">
                <el-option
                  v-for="(item, index) in subjectList"
                  :key="index"
                  :value="item.id"
                  :label="item.short_name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
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
          </el-col>
          <el-col :span="5">
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
          </el-col>
          <el-col :span="5">
            <el-form-item prop="type" label="题型">
              <el-select v-model="form.type">
                <el-option
                  v-for="(value, key, index) in typeObj"
                  :key="index"
                  :value="+key"
                  :label="value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item prop="difficulty" label="难度">
              <el-select v-model="form.difficulty">
                <el-option
                  v-for="(value, key, index) in diffObj"
                  :key="index"
                  :value="+key"
                  :label="value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="username" label="作者">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="status" label="状态">
              <el-select v-model="form.status">
                <el-option :value="1" label="启用"></el-option>
                <el-option :value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="create_date" label="日期">
              <el-date-picker
                v-model="form.create_date"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="title" label="标题">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="10px">
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">清除</el-button>
              <el-button type="primary" @click="add">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="content-area">
      <!--
        el-table
           data:数据绑定
           el-table-column 
               label:标题
               prop绑定相应项数据字段
           自定义列
               1：加一个template标签  
               2：在template标签内加一个v-slot="scope"
                  scope使用范围在template标签内
                  scope.$index====序号
                  scope.row=====当前 行数据        
       -->
      <el-table :data="list" border>
        <el-table-column label="序号">
          <template v-slot="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="题目">
          <template v-slot="scope">
            <div v-html="scope.row.title"></div>
          </template>
        </el-table-column>
        <el-table-column label="学科.阶段">
          <template v-slot="scope">
            {{ scope.row.subject_name }}.{{ stepObj[scope.row.step] }}
          </template>
        </el-table-column>
        <el-table-column label="题型">
          <template v-slot="scope">
            {{ typeObj[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column label="企业" prop="enterprise_name"> </el-table-column>
        <el-table-column label="创建者" prop="username"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            {{ scope.row.status === 0 ? '禁用' : '启用' }}
          </template>
        </el-table-column>
        <el-table-column label="访问量" prop="reads"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button @click="edit(scope.row)">编辑</el-button>
            <el-button @click="setStatus(scope.row.id)">{{
              scope.row.status == 1 ? '禁用' : '启用'
            }}</el-button>
            <el-button @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器
      el-pagination
        @size-change="页容量改变"
        @current-change="页码改变"
        :current-page="当前页码"
        :page-size="当前页容量"
        page-sizes="数组一定要包含当前页容量"
        layout="total,sizes,prev,pager,next,jumper"
        ：total="总数"
       -->
      <div class="pagination">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="pagination.currnetPage"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 30, 40, 50]"
          layout="total,sizes,prev,pager,next,jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- props与emit
    父子传值
       父传子属性
        传：在子组件标签上定义一个属性  属性名=值
        收：在子组件内来一个props:["属性名"]
       子触发父方法
        传：在子组件标签上定义一个方法  @子组件方法名="父组件方法名"
        子组件触发：this.$emit("子组件方法名"，参数)  
     -->
    <questionAdd
      ref="questionAdd"
      :subjectList="subjectList"
      :stepObj="stepObj"
      :businessList="businessList"
      :typeObj="typeObj"
      :diffObj="diffObj"
      @search="search"
      @getData="getData"
    ></questionAdd>
  </div>
</template>

<script>
import { getSubjectList } from '@/api/subject.js'
import { getBusinessList } from '@/api/business.js'
import {
  getQuestionList,
  setQuestionStatus,
  delQuestion
} from '@/api/question.js'
import questionAdd from './questionAdd'
export default {
  components: {
    questionAdd
  },
  data () {
    return {
      pagination: {
        currnetPage: 1,
        pageSize: 10,
        total: 10
      },
      stepObj: {
        1: '初级',
        2: '中级',
        3: '高级'
      },
      diffObj: {
        1: '简单',
        2: '一般',
        3: '困难'
      },
      typeObj: {
        1: '单选',
        2: '多选',
        3: '简答'
      },
      form: {
        subject: '', //	int	学科id
        step: '', //	int	题目阶段:1(初级),2(中级),3(高级)
        enterprise: '', //	int	企业id
        type: '', //	int	题目类型:1(单选),2(多选),3(简答)
        difficulty: '', //	int	题目难度: 1(简单),2(一般),3(困难)
        username: '', //	string	作者
        status: '', //	int	状态:0(禁用),1(启用)
        create_date: '', //	string	创建日期
        title: '' //	string	标题名称
      },
      subjectList: [],
      businessList: [],
      list: [] //题库列表数据
    }
  },
  created () {
    // 获取学科列表
    getSubjectList({ limit: 100 }).then(res => {
      this.subjectList = res.data.items
    })
    // 获取企业列表
    getBusinessList({ limit: 100 }).then(res => {
      this.businessList = res.data.items
    })
    this.getData()
  },
  methods: {
    getData () {
      let _params = {
        ...this.form,
        page: this.pagination.currnetPage,
        limit: this.pagination.pageSize
      }
      getQuestionList(_params).then(res => {
        window.console.log('题库列表：', res)
        res.data.items.forEach(item => {
          item.city = item.city.split(',')
          item.multiple_select_answer = item.multiple_select_answer.split(',')
        })
        this.list = res.data.items
        this.pagination.total = res.data.pagination.total
      })
    },
    //页容量改变
    sizeChange (size) {
      this.pagination.pageSize = size
      this.search()
      window.console.log(size)
    },
    //页码改变
    currentChange (page) {
      this.pagination.currnetPage = page
      this.getData()
      window.console.log(page)
    },
    //搜索
    search () {
      this.pagination.currnetPage = 1
      this.getData()
    },
    //清除
    reset () {
      /*
      1:el-form上绑定一个model
      2:在el-form上定义一个ref ref =值
      3：在el-form-item每一项上定义一个prop
      4:this.$refs.值.resetFileds()     
      
      */
      this.$refs.form.resetFields()
      this.search()
    },
    //状态设置
    setStatus (id) {
      setQuestionStatus({ id }).then(() => {
        // 提示设置成功
        this.$message.success('修改状态成功')
        this.getData()
      })
    },
    //删除
    del (id) {
      this.$confirm('您确定删除此项', '友情提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消删除',
        type: 'warning'
      }).then(() => {
        delQuestion({ id }).then(() => {
          // 提示设置成功
          this.$message.success('删除成功')
          this.search()
        })
      })
    },
    //新增
    add () {
      this.$refs.questionAdd.isShow = true
      this.$refs.questionAdd.mode = 'add'
    },
    //编辑
    edit (row) {
      this.$refs.questionAdd.form = JSON.parse(JSON.stringify(row))
      this.$refs.questionAdd.mode = 'edit'
      this.$refs.questionAdd.isShow = true
    }
  }
}
</script>

<style lang="less">
.question {
  .content-area {
    margin-top: 30px;
  }
  .pagination {
    text-align: center;
    padding: 15px 0 5px;
  }
}
</style>
