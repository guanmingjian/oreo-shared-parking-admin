<template>
  <el-dialog
    :title="$t('common.view')"
    :width="width"
    :visible.sync="isVisible"
    class="user-view"
  >
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="img-wrapper">
          <img :src="avatar">
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-user" /> <span>{{ $t('table.user.username') +'：' }}</span> {{ user.userName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-user" /> <span>{{ $t('table.user.realName') +'：' }}</span> {{ user.realName }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-trophy" /> <span>{{ $t('table.user.type') +'：' }}</span> {{ user.accountAmount }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-phone-outline" /> <span>{{ $t('table.user.mobile') +'：' }}</span> {{ user.mobile }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-star-off" /> <span>{{ $t('table.user.sex') +'：' }}</span> {{ transSex(user.sex) }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-bangzhu" /> <span>{{ $t('table.user.status') +'：' }}</span> {{ user.userType === '0' ? $t('common.status.valid') : $t('common.status.invalid') }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-time" /> <span>{{ $t('table.user.createTime') +'：' }}</span> {{ user.registerTime }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-coin" /> <span>{{ $t('table.user.creditScore') +'：' }}</span> {{ user.creditScore }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-date" /> <span>{{ $t('table.user.lastLoginTime') +'：' }}</span>
          {{ user.lastLoginTime ? user.lastLoginTime: $t('tips.neverLogin') }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-date" /> <span>{{ $t('table.user.beginDate') +'：' }}</span> {{ user.beginDate }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-date" /> <span>{{ $t('table.user.born') +'：' }}</span> {{ user.born }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-bank-card" /> <span>{{ $t('table.user.idCard') +'：' }}</span> {{ user.idCard }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-add-location" /> <span>{{ $t('table.user.address') +'：' }}</span> {{ user.address }}
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'UserView',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      screenWidth: 0,
      width: this.initWidth(),
      user: {}
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
      }
    },
    avatar() {
      if (this.user.avatar) {
        return require(`@/assets/avatar/${this.user.avatar}`)
      } else {
        return require('@/assets/avatar/default.jpg')
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
    transSex(sex) {
      switch (sex) {
        case '0':
          return this.$t('common.sex.male')
        case '1':
          return this.$t('common.sex.female')
        default:
          return this.$t('common.sex.secret')
      }
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 550) {
        return '95%'
      } else if (this.screenWidth < 990) {
        return '580px'
      } else if (this.screenWidth < 1400) {
        return '600px'
      } else {
        return '650px'
      }
    },
    setUser(val) {
      this.user = { ...val }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-view {
    .img-wrapper {
      text-align: center;
      margin-top: -1.5rem;
      margin-bottom: 10px;
      img {
        width: 4rem;
        border-radius: 50%;
      }
    }
    .view-item {
      margin: 7px;
      i {
        font-size: .97rem;
      }
      span {
        margin-left: 5px;
      }
    }
  }
</style>
