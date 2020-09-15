<template>
  <div class="selectItem">
    <div v-if="form.type == 1">
      <div
        class="item"
        v-for="(item, index) in form.select_options"
        :key="index"
      >
        <el-radio
          v-model="form.single_select_answer"
          :label="item.label"
          @change="changeEvent('single_select_answer')"
          >{{ item.label }}</el-radio
        >
        <el-input class="noerror" v-model="item.text"></el-input>
        <!-- <hmupload :value="imageUrl" @input="inputEvent"></hmupload> -->
        <hmupload v-model="item.image"></hmupload>
      </div>
    </div>
    <div v-else-if="form.type == 2">
      <!-- 多选 -->
      <div
        class="item"
        v-for="(item, index) in form.select_options"
        :key="index"
      >
        <el-checkbox
          v-model="form.multiple_select_answer"
          @change="changeEvent('multiple_select_answer')"
          :label="item.label"
          >{{ item.label }}</el-checkbox
        >
        <el-input class="noerror" v-model="item.text"></el-input>
        <!-- <hmupload :value="imageUrl" @input="inputEvent"></hmupload> -->
        <hmupload v-model="item.image"></hmupload>
      </div>
    </div>
    <div v-else>
      <!-- 简答 -->
      <!-- el-input
      type="textarea"  
      rows="5"   初始高度占多选行      
       -->
      <el-input
        v-model="form.short_answer"
        @change="changeEvent('short_answer')"
        type="textarea"
        rows="5"
      ></el-input>
    </div>
  </div>
</template>

<script>
import hmupload from '@/components/hmupload'
export default {
  props: ['form'],
  components: {
    hmupload
  },
  data () {
    return {
      //   imageUrl: ''
    }
  },
  methods: {
    // inputEvent (msg) {
    //   this.imageUrl = msg
    // }
    changeEvent (str) {
      this.$emit('validateItem', str)
    }
  }
}
</script>

<style lang="less">
.selectItem {
  .item {
    display: flex;
    align-items: center;
  }
}
.is-error .noerror .el-input__inner {
  border-color: #dcdfe6 !important;
}
</style>
