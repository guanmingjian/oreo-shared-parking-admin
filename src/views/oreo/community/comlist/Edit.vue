<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="community" :rules="rules" label-position="right" label-width="130px">
      <el-form-item :label="$t('table.community.name')" prop="name">
        <el-input v-model="community.name" />
      </el-form-item>
      <el-form-item :label="$t('table.community.spacetotalnumber')" prop="spaceTotalNumber">
        <el-input v-model="community.spaceTotalNumber" />
      </el-form-item>
      <el-form-item :label="$t('table.community.spaceavaliablenumber')" prop="spaceAvailableNumber">
        <el-input v-model="community.spaceAvailableNumber" />
      </el-form-item>
      <el-form-item :label="$t('table.community.cooperationtime')" prop="cooperationTime">
        <el-date-picker
          v-model="community.cooperationTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择合作日期"
        />
      </el-form-item>
      <el-form-item :label="$t('table.community.cooperationdeadline')" prop="cooperationDeadline">
        <el-date-picker
          v-model="community.cooperationDeadline"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择合作截止日期"
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
  name: 'CommunityEdit',
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
      community: this.initCommunity(),
      buttonLoading: false,
      screenWidth: 0,
      width: this.initWidth(),
      // 输入校验规则
      rules: {
        name: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 4, max: 10, message: this.$t('rules.range4to10'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (!this.community.id) {
              this.$get(`admin/community/check/${value}`).then((r) => {
                if (!r.data) {
                  callback(this.$t('用户名已存在'))
                } else {
                  callback()
                }
              })
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        cooperationTime:
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        cooperationDeadline:
          { required: true, message: this.$t('rules.require'), trigger: 'blur' }
      }
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
    initCommunity() {
      return {
        name: '',
        spaceTotalNumber: '',
        spaceAvailableNumber: '',
        cooperationTime: '',
        cooperationDeadline: ''
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
    setCommunity(val) {
      this.community = { ...val }
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
          if (!this.community.id) {
            // create
            // 新增用this.$post，对应后端的@PostMapping注解
            // this.$post在src/utils/request.js
            this.$postJson('admin/community', { ...this.community }).then(() => {
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
            this.$put('admin/community', { ...this.community }).then(() => {
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
      this.community = this.initCommunity()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
