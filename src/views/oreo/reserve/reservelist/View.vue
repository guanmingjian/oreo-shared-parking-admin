<template>
  <el-dialog
    :title="$t('common.view')"
    :width="width"
    :visible.sync="isVisible"
    :append-to-body="true"
    class="reserve-view"
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
          <i class="el-icon-user" /> <span>{{ $t('小区名称') +'：' }}</span> {{ reserve.communityName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-time" /> <span>{{ $t('详细地址') +'：' }}</span> {{ reserve.communityAddress }}
          <!--          | parseTime('{y}-{m}-{d} {h}:{i}:{s}')-->
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-suitcase" /> <span>{{ $t('入场时间') +'：' }}</span> {{ reserve.enterTime | timeFilter }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-trophy" /> <span>{{ $t('离场时间') +'：' }}</span> {{ reserve.leaveTime | timeFilter }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-phone-outline" /> <span>{{ $t('担保金价格') +'：' }}</span> {{ reserve.earnestPrice }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-star-off" /> <span>{{ $t('支付状态') +'：' }}</span>
          {{ reserve.payStatus === '1' ? $t('未支付') : reserve.payStatus === '2' ? $t('已支付') : $t('已退款') }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-date" /> <span>{{ $t('支付人') +'：' }}</span>{{ reserve.payName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-document" /> <span>{{ $t('预约时间') +'：' }}</span> {{ reserve.reserveTime }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-brush" /> <span>{{ $t('预约状态') +'：' }}</span>
          {{ reserve.reserveStatus === '1' ? $t('预约成功') : reserve.reserveStatus === '2' ? $t('预约过期'):reserve.reserveStatus === '3' ? $t('已取消'):reserve.reserveStatus === '4' ? $t('下单成功'): $t('预约完成') }}
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'ReserveView',
  filters: {
    timeFilter(time) {
      const times = [
        '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
        '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
      ]
      return times[time - 1]
    }
  },
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
      reserve: {}
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
      if (this.reserve.avatar) {
        return require(`@/assets/avatar/${this.reserve.avatar}`)
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
    setReserve(val) {
      this.reserve = { ...val }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  .reserve-view {
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
