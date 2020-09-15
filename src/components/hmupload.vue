<template>
  <el-upload
    class="avatar-uploader"
    :action="baseUrl + '/question/upload'"
    name="file"
    :before-upload="beforeUpload"
    :on-success="onSuccess"
    :show-file-list="false"
  >
    <div v-if="type == 'video'">
      <video
        v-if="value"
        :src="baseUrl + '/' + value"
        class="avatar"
        controls
      ></video>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </div>
    <div v-else>
      <img v-if="value" :src="baseUrl + '/' + value" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </div>
  </el-upload>
</template>

<script>
export default {
  props: ['value', 'type'],
  data () {
    return {
      baseUrl: process.env.VUE_APP_URL,
      imageUrl: ''
    }
  },
  methods: {
    //   上传前
    beforeUpload (file) {
      // 如果type=='video这里应该是视频判断 else才是后面的判断
      if (this.type == 'video') {
        //视频类型与大小判断
        const isVideo = file.type === 'video/mp4'
        const isLt8M = file.size / 1024 / 1024 < 8
        if (!isVideo) {
          this.$message.error('上传视频只能是MP4!')
        }
        if (!isLt8M) {
          this.$message.error('上传视频最大8M!')
        }
        return isVideo && isLt8M
      } else {
        // return boolean值   true  通过上传   false 中止上传
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传只能是 JPG,PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      }
    },
    // 上传成功后
    onSuccess (res) {
      this.$emit('input', res.data.url)
      window.console.log(res.data.url)
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
