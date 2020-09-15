<template>
  <div class="subject">
    <el-card>
      <el-form :model="form" inline ref="form">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="form.rid" class="w100"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="form.name" class="w100"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="form.username" class="w100"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" class="w100">
            <el-option :value="0" label="禁用"></el-option>
            <el-option :value="1" label="启用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">清除</el-button>
          <!-- 判断当前角色是否包含管理员 -->
          <el-button
            type="primary"
            @click="add"
            v-if="$store.state.role.includes('管理员')"
            >+新增学科</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <!-- table
      el-table  data数据绑定 
          el-table-column  每一列
              label:每一列的标题 prop="绑定该列数据所对应字段名"  width:宽度
          自定义列使用
              1：加一个template标签 v-slot="变量（局部变量，只能在template标签内使用）"
              2：  v-slot="scope" 
                    scope.$index=====当前项的序号
                    scope.row========当前行的所有数据 
      -->
      <el-table :data="list">
        <el-table-column label="序号" width="50">
          <template v-slot="scope">
            {{
              pagination.pageSize * (pagination.currentPage - 1) +
                scope.$index +
                1
            }}
          </template>
        </el-table-column>
        <el-table-column label="学科编号" prop="rid"></el-table-column>
        <el-table-column label="学科名称" prop="name"></el-table-column>
        <el-table-column label="简称" prop="short_name"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="创建日期" prop="create_time"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            {{ scope.row.status == 0 ? '禁用' : '启用' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
          v-if="$store.state.role.includes('管理员')"
        >
          <template v-slot="scope">
            <el-button @click="edit(scope.row)">编辑</el-button>
            <el-button @click="setStatus(scope.row.id)">{{
              scope.row.status == 1 ? '禁用' : '启用'
            }}</el-button>
            <el-button @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <!--el-pagination分页器
      size-change方法  ="页容量改变"   该方法有一个参数size(当前页容量)
      current-change方法="页码改变"  该方法有一个参数page(当前页码)
      current-page:当前页默认页码（当前页所对应字段）
      page-sizes：后面是页容量数组 它内面一定要包含page-size的值
      page-size：当前页默认页容量
      layout="total, sizes, prev, pager, next, jumper"
      total:总数
      -->
        <el-pagination
          @size-change="changeSize"
          @current-change="changeCurrent"
          :current-page="pagination.currentPage"
          :page-sizes="[1, 10, 20, 30, 40, 50]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-card>
    <subjectAdd ref="subjectAdd"></subjectAdd>
  </div>
</template>
<script>
import { getSubjectList, setSubjectStatus, delSubject } from '@/api/subject.js'
import subjectAdd from './subjectAdd'
export default {
  name: 'Subject',
  components: {
    subjectAdd
  },
  data () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 1,
        total: 100
      },
      form: {
        rid: '', //	学科编号
        name: '', //	学科名称
        username: '', //	创建者用户名
        status: '', //	状态 0(禁用) 1(启用)
        page: '', //	页码 默认为1
        limit: '' //	页尺寸 默认为10
      },
      list: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取学科列表
    getData () {
      let _query = {
        ...this.form,
        page: this.pagination.currentPage,
        limit: this.pagination.pageSize
      }
      getSubjectList(_query).then(res => {
        this.list = res.data.items
        this.pagination.total = res.data.pagination.total
        window.console.log('学科列表：', res)
      })
    },
    // 页容量改变
    changeSize (size) {
      this.pagination.pageSize = size
      // 容错处理，当改变页容量时，如果pageSize不处于第一页，有可能该页根本没数据，所以最简单做法，调用接口前，将currentPage=1
      this.pagination.currentPage = 1
      this.getData()
    },
    // 页码改变
    changeCurrent (page) {
      this.pagination.currentPage = page
      this.getData()
    },
    // 搜索
    search () {
      //获取学科列表
      this.pagination.currentPage = 1
      this.getData()
    },
    //清除
    reset () {
      // 还原表单的值
      // 使用表单方法，需要每一项的数据都进行了绑定（prop="对应的key”）
      this.$refs.form.resetFields()
      this.search()
    },
    //新增
    add () {
      //父组件修改子组件的值  1：在子组件身上定义一个ref  ref="值"2：this.$refs.值.属性名=修改的值
      this.$refs.subjectAdd.mode = 'add'
      this.$refs.subjectAdd.isShow = true
    },
    //状态设置
    setStatus (id) {
      setSubjectStatus({ id }).then(() => {
        this.$message.success('状态设置成功！')
        this.getData()
      })
    },
    //删除
    del (id) {
      delSubject({ id }).then(() => {
        this.$message.success('删除成功！')
        this.search()
      })
    },
    //编辑
    edit (row) {
      //点击编辑修改subjectAdd的form
      this.$refs.subjectAdd.form = JSON.parse(JSON.stringify(row))
      this.$refs.subjectAdd.mode = 'edit'
      this.$refs.subjectAdd.isShow = true
    }
  }
}
</script>
<style lang="less">
.subject {
  .w100 {
    width: 100px;
  }
  .pagination {
    text-align: center;
    padding-top: 30px;
    padding-bottom: 15px;
  }
}
</style>
