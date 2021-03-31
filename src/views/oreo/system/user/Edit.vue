<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="user" :rules="rules" label-position="right" label-width="100px">
      <el-form-item :label="$t('table.user.username')" prop="username">
        <el-input v-model="user.username" :readonly="user.userId === '' ? false : 'readonly'" />
      </el-form-item>
      <el-form-item v-show="user.userId === ''" :label="$t('table.user.password')" prop="password">
        <el-tooltip class="item" effect="dark" :content="$t('tips.defaultPassword')" placement="top-start">
          <el-input value="123456" type="password" readonly />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('table.user.email')" prop="email">
        <el-input v-model="user.email" />
      </el-form-item>
      <el-form-item :label="$t('table.user.mobile')" prop="mobile">
        <el-input v-model="user.mobile" />
      </el-form-item>
      <el-form-item :label="$t('table.user.role')" prop="roleId">
        <el-select v-model="user.roleId" multiple value="" placeholder="" style="width:100%" @change="roleChange">
          <el-option
            v-for="item in roles"
            :key="item.roleId"
            :label="item.roleName"
            :value="String(item.roleId)"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isRole" :label="$t('table.user.community')" prop="communityId">
        <el-select v-model="user.communityId" value="" placeholder="" style="width:100%">
          <el-option
            v-for="item in communitys"
            :key="item.id"
            :label="item.name"
            :value="String(item.id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.user.sex')" prop="sex">
        <el-select v-model="user.sex" value="" placeholder="" style="width:100%">
          <el-option value="0" :label="$t('common.sex.male') " />
          <el-option value="1" :label="$t('common.sex.female') " />
          <el-option value="2" :label="$t('common.sex.secret') " />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.user.status')" prop="status">
        <el-radio-group v-model="user.status">
          <el-radio label="1">{{ $t('common.status.valid') }}</el-radio>
          <el-radio label="0">{{ $t('common.status.invalid') }}</el-radio>
        </el-radio-group>
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
import { validMobile } from '@/utils/my-validate'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'UserEdit',
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
      isRole: false,
      user: this.initUser(),
      buttonLoading: false,
      screenWidth: 0,
      width: this.initWidth(),
      roles: [],
      communitys: [],
      rules: {
        username: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 4, max: 10, message: this.$t('rules.range4to10'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (!this.user.userId) {
              this.$get(`system/user/check/${value}`).then((r) => {
                console.log(r.data)
                if (!r.data) {
                  callback(this.$t('rules.usernameExist'))
                } else {
                  callback()
                }
              })
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        email: { type: 'email', message: this.$t('rules.email'), trigger: 'blur' },
        mobile: { validator: (rule, value, callback) => {
          if (value !== '' && !validMobile(value)) {
            callback(this.$t('rules.mobile'))
          } else {
            callback()
          }
        }, trigger: 'blur' },
        roleId: { required: true, message: this.$t('rules.require'), trigger: 'change' },
        communityId: { required: true, message: this.$t('communitys.require'), trigger: 'blur' },
        sex: { required: true, message: this.$t('rules.require'), trigger: 'change' },
        status: { required: true, message: this.$t('rules.require'), trigger: 'blur' }
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
    this.initRoles()
    this.initCommunitys()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initUser() {
      return {
        userId: '',
        username: '',
        password: '123456',
        email: '',
        mobile: '',
        sex: '',
        status: '1',
        deptId: null,
        roleId: [],
        communityId: []
      }
    },
    roleChange(selectValue) {
      // eslint-disable-next-line eqeqeq
      if (selectValue[0] == 10) {
        this.isRole = true
        console.log(this.isRole)
        // eslint-disable-next-line eqeqeq
      } else if (selectValue[1] == 10) {
        this.isRole = true
        console.log(this.isRole)
        // eslint-disable-next-line eqeqeq
      } else if (selectValue[2] == 10) {
        this.isRole = true
        console.log(this.isRole)
      } else {
        this.isRole = false
        console.log(this.isRole)
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
    initRoles() {
      this.$get('system/role/options').then((r) => {
        this.roles = r.data.data
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: this.$t('tips.getDataFail'),
          type: 'error'
        })
      })
    },
    initCommunitys() {
      this.$get('admin/community/options').then((r) => {
        this.communitys = r.data.data
        this.communitys2 = r.data
        console.log('communitys:' + this.communitys)
        console.log('communitys:' + this.communitys2)
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: this.$t('tips.getDataFail'),
          type: 'error'
        })
      })
    },
    setUser(val) {
      this.user = { ...val }
    },
    close() {
      this.$emit('close')
    },
    // 点击提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        // 表单验证
        if (valid) {
          this.buttonLoading = true
          // 都是一些格式处理吧，前端好好琢磨
          this.user.roleId = this.user.roleId.join(',')
          // 判断是否存在用户id，存在是修改，不存在是新增
          if (!this.user.userId) {
            // create
            // 新增用this.$post，对应后端的@PostMapping注解
            // this.$post在src/utils/request.js
            // 把很多属性都放在了user下，比如user.xxxx
            this.$post('system/user', { ...this.user }).then(() => {
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
            this.user.createTime = this.user.modifyTime = this.user.lastLoginTime = null
            this.$put('system/user', { ...this.user }).then(() => {
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
      this.user = this.initUser()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
