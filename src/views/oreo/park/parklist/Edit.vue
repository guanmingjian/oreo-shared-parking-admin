<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="park" :rules="rules" label-position="right" label-width="130px">
      <el-form-item :label="$t('车位编号')" prop="parkingSn">
        <el-input v-model="park.parkingSn" />
      </el-form-item>
      <el-form-item v-show="!isShow" :label="$t('选择小区')">
        <el-cascader
          v-model="selectedRegion"
          placeholder="请选择地域"
          size="large"
          :options="options"
          @change="regionChange"
        />
        <!--小区切换 -->
        <el-select v-model="community" value-key="id" placeholder="选择小区" clearable class="date-range-item filter-item" @clear="reset">
          <el-option
            v-for="item in communitys"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="!isShow" :label="$t('选择用户')">
        <!--用户切换 -->
        <el-select v-model="user" value-key="id" placeholder="选择用户" filterable class="date-range-item filter-item" @clear="reset">
          <el-option
            v-for="item in users"
            :key="item.id"
            :label="item.realName"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="isShow" :label="$t('车位状态')" prop="parkingStatus">
        <el-radio-group v-model="park.parkingStatus">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { regionData, CodeToText } from 'element-china-area-data'

export default {
  name: 'ParkEdit',
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
      isShow: false,
      options: regionData,
      selectedRegion: [],
      region: {},
      initFlag: false,
      park: this.initPark(),
      insertPark: {},
      buttonLoading: false,
      screenWidth: 0,
      width: this.initWidth(),
      communitys: [],
      community: {},
      users: [],
      user: {},
      userType: {
        userType: 2
      },
      rules: {
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
    this.initShow()
    this.initCommunitys()
    this.initUsers()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initShow() {
      this.isShow = false
    },
    regionChange() {
      this.region.province = CodeToText[this.selectedRegion[0]]
      this.region.city = CodeToText[this.selectedRegion[1]]
      this.region.area = CodeToText[this.selectedRegion[2]]
      this.$get('admin/community/options', { ...this.region }).then((r) => {
        this.communitys = r.data.data
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
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: this.$t('tips.getDataFail'),
          type: 'error'
        })
      })
    },
    initUsers() {
      this.$get('/admin/user', { ...this.userType }).then((r) => {
        this.users = r.data.data.rows
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: this.$t('tips.getDataFail'),
          type: 'error'
        })
      })
    },
    initPark() {
      return {
        parkingSn: '',
        communityId: 0,
        communityName: '',
        userId: 0,
        userName: '',
        parkingStatus: 1
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
    setPark(val) {
      this.park = { ...val }
      this.isShow = true
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
          if (!this.park.id) {
            this.insertPark.communityId = this.community.id
            this.insertPark.communityName = this.community.name
            this.insertPark.parkingSn = this.park.parkingSn
            this.insertPark.userId = this.user.id
            this.insertPark.userName = this.user.userName
            this.insertPark.parkingStatus = this.park.parkingStatus
            console.log(this.insertPark)
            this.$post('admin/parking', { ...this.insertPark }).then(() => {
              this.buttonLoading = false
              this.isVisible = false
              this.$message({
                message: this.$t('tips.createSuccess'),
                type: 'success'
              })
              this.$emit('success')
            })
          } else {
            // 和新增原理一样，这里不作多解释，但是注意的是 修改用的是 @PutMapping 和 $put
            // update
            this.insertPark.id = this.park.id
            this.insertPark.parkingSn = this.park.parkingSn
            this.insertPark.parkingStatus = this.park.parkingStatus
            this.$put('admin/parking', { ...this.insertPark }).then(() => {
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
      this.park = this.initPark()
      this.initShow()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
