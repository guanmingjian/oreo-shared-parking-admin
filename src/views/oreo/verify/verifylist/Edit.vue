<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="Verify" label-position="right" label-width="130px">
      <el-form-item :label="$t('table.verify.parkingSn')" prop="verifyStatus">
        <el-input v-model="Verify.parkingSn" />
      </el-form-item>
      <el-form-item :label="$t('table.verify.verifyStatus')" prop="verifyStatus">
        <el-input v-model="Verify.verifyStatus" />
      </el-form-item>
      <el-form-item :label="$t('table.verify.actualPrice')" prop="actualPrice">
        <el-input v-model="Verify.actualPrice" />
      </el-form-item>
      <el-form-item :label="$t('table.verify.completeTime')" prop="name">
        <el-input v-model="Verify.completeTime" />
      </el-form-item>
      <!--      <el-form-item :label="$t('table.verify.completeTime')" prop="completeTime">-->
      <!--        <el-date-picker-->
      <!--          v-model="Verify.completeTime"-->
      <!--          type="datetime"-->
      <!--          placeholder="选择日期时间">-->
      <!--        </el-date-picker>-->
      <!--      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'VerifyEdit',
  // eslint-disable-next-line vue/no-unused-components
  components: { Treeselect },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      initFlag: false,
      Verify: this.initVerify(),
      buttonLoading: false,
      screenWidth: 0,
      width: this.initWidth()
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
        this.reset()
      }
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initVerify() {
      return {
        parkingSn: '',
        verifyStatus: '',
        actualPrice: '',
        completeTime: ''
      }
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '45%'
      } else {
        return '800px'
      }
    },
    setVerify(val) {
      this.Verify = { ...val }
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        // 表单验证
        if (valid) {
          this.buttonLoading = true
          // 判断是否存在用户id，存在是修改，不存在是新增
          if (!this.Verify.id) {
            // create
            // 新增用this.$post，对应后端的@PostMapping注解
            // this.$post在src/utils/request.js
            this.$post('admin/Verify', { ...this.Verify }).then(() => {
              this.buttonLoading = false
              // 这里应该是关闭窗口了吧
              // 我发现关闭之后，没办法自动刷新页面更新数据，前端修复一下，应该是重新渲染就好了
              // 看到删除过后调的是this.search()函数，这里跨vue了，不知道行不行，你们弄吧
              this.isVisible = false
              // 返回创建成功的提示信息
              this.$message({
                message: this.$t('tips.createSuccess'),
                type: 'success'
              })
              this.$emit('success')
            })
          } else {
            // 和新增原理一样，这里不作多解释，但是注意的是 修改用的是 @PutMapping 和 $put
            // update
            this.$put('admin/verify', { ...this.Verify }).then(() => {
              this.buttonLoading = false
              this.isVisible = false
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.$emit('success')
            })
          }
        } else {
          return false
        }
      })
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.Verify = this.initVerify()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
