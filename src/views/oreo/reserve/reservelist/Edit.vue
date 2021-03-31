<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="reserve" label-position="right" label-width="130px">
      <el-form-item :label="$t('小区名称')" prop="communityName">
        <el-input v-model="reserve.communityName" />
      </el-form-item>
      <el-form-item :label="$t('车牌号')" prop="carNumber">
        <el-input v-model="reserve.carNumber" />
      </el-form-item>
      <el-form-item :label="$t('入场时间')" prop="enterTime">
        <el-time-select
          v-model="reserve.enterTime"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
          }"
          placeholder="请选择入场时间"
        />
      </el-form-item>
      <el-form-item :label="$t('出场时间')" prop="leaveTime">
        <el-time-select
          v-model="reserve.leaveTime"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
          }"
          placeholder="请选择出场时间"
        />
      </el-form-item>
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
  name: 'ReserveEdit',
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
      reserve: this.initReserve(),
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
    timeToi(time) {
      // eslint-disable-next-line eqeqeq
      if (parseInt(time.substring(3)) == 0) {
        return parseInt(time.substring(0, 2)) * 2 + 1
      } else {
        return parseInt(time.substring(0, 2)) * 2 + 2
      }
    },
    itoTime(time) {
      const times = [
        '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
        '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
      ]
      return times[time - 1]
    },
    initReserve() {
      return {
        communityName: '',
        carNumber: '',
        enterTime: '',
        leaveTime: ''
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
    setReserve(val) {
      this.reserve = { ...val }
      this.reserve.enterTime = this.itoTime(this.reserve.enterTime)
      this.reserve.leaveTime = this.itoTime(this.reserve.leaveTime)
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        this.reserve.enterTime = this.timeToi(this.reserve.enterTime)
        this.reserve.leaveTime = this.timeToi(this.reserve.leaveTime)
        // 表单验证
        if (valid) {
          this.buttonLoading = true
          // 判断是否存在用户id，存在是修改，不存在是新增
          if (!this.reserve.id) {
            // create
            // 新增用this.$post，对应后端的@PostMapping注解
            // this.$post在src/utils/request.js
            this.$post('admin/reserve', { ...this.reserve }).then(() => {
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
            this.$put('admin/reserve', { ...this.reserve }).then(() => {
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
      this.reserve = this.initReserve()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
