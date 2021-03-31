<template>
  <div class="app-container">
    <div class="filter-container">
      <!--查询输入框-->
      <el-input v-model="queryParams.parkingSn" :placeholder="$t('车牌号')" class="filter-item search-item" />
      <!--搜索按钮-->
      <el-button class="filter-item" type="primary" @click="search">
        {{ $t('table.search') }}
      </el-button>
      <!--重置按钮-->
      <el-button class="filter-item" type="success" @click="reset">
        {{ $t('table.reset') }}
      </el-button>
      <!--小区切换 -->
      <el-cascader
        v-model="selectedRegion"
        v-hasPermission="['community:change']"
        class="date-range-item filter-item"
        placeholder="选择地域"
        :options="options"
        @change="regionChange"
      />
      <el-select v-model="value" v-hasPermission="['community:change']" placeholder="切换小区" clearable class="date-range-item filter-item" @change="tgCommunity(value)" @clear="reset">
        <el-option
          v-for="item in communitys"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <!--表格-->
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      style="width: 100%;"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column :label="$t('小区名称')" prop="name" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.communityName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('车牌号')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.parkingSn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('产权人名字')" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.ownerName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('申请审核时间')" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('处理审核时间')" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.verifyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('审核状态')"
        :filters="[{ text: $t('审核中'), value: '1' }, { text: $t('审核通过'), value: '2' }, { text: $t('审核不通过'), value: '3' }]"
        :filter-method="filterStatus"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.verifyStatus | statusFilter">
            {{ row.verifyStatus === '1' ? $t('审核中') : row.verifyStatus === '2' ? $t('审核通过'):$t('审核不通过') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-show="row.verifyStatus==='1'|row.verifyStatus==='3'" v-hasPermission="['verify:pass']" type="success" plain @click="isPass(row,true)">通过</el-button>
          <el-button v-show="row.verifyStatus==='1'|row.verifyStatus==='2'" v-hasPermission="['verify:pass']" type="danger" plain @click="isPass(row,false)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { regionData, CodeToText } from 'element-china-area-data'

export default {
  name: 'VerifyManage',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const map = {
        2: 'success',
        3: 'danger'
      }
      return map[status]
    }
  },
  data() {
    return {
      verifyFlag: true,
      options: regionData,
      selectedRegion: [],
      region: {},
      dialog: {
        isVisible: false,
        title: ''
      },
      communityId: {
        communityId: 0
      },
      VerifyViewVisible: false,
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      selection: [],
      pagination: {
        size: 10,
        num: 1
      },
      communitys: [],
      verify: {},
      value: ''
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.account.user
    }
  },
  mounted() {
    this.initCommunitys()
    this.fetch()
  },
  methods: {
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
    isPass(row, bol) {
      this.verify.isPass = bol
      this.verify.userVerifyId = row.id
      console.log(row)
      console.log(this.verify)
      this.$post('/admin/user/verify', { ...this.verify }).then(() => {
        this.$message({
          message: this.$t('审核完成'),
          type: 'success'
        })
        this.search()
      })
    },
    filterStatus(value, row) {
      return row.verifyStatus === value
    },
    onSelectChange(selection) {
      this.selection = selection
    },
    // 搜索框
    search() {
      this.fetch({
        ...this.queryParams
      })
    },
    // 重置查询的输入
    reset() {
      this.queryParams = {}
      this.search()
    },
    // 切换小区
    tgCommunity(value) {
      this.communityId.communityId = value
      this.fetch({
        ...this.communityId
      })
    },
    singleDelete(row) {
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    batchDelete() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t('tips.noDataSelected'),
          type: 'warning'
        })
        return
      }
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const userIds = []
        this.selection.forEach((u) => {
          userIds.push(u.id)
        })
        this.delete(userIds)
      }).catch(() => {
        this.clearSelections()
      })
    },
    delete(userIds) {
      this.loading = true
      this.$delete(`admin/Verify/${userIds}`).then(() => {
        this.$message({
          message: this.$t('tips.deleteSuccess'),
          type: 'success'
        })
        this.search()
      })
    },
    // 查询小区信息
    fetch(params = {}) {
      // 获取分页信息
      params.pageSize = this.pagination.size
      params.pageNum = this.pagination.num
      // 获取时间信息
      if (this.queryParams.timeRange) {
        params.createTimeFrom = this.queryParams.timeRange[0]
        params.createTimeTo = this.queryParams.timeRange[1]
      }
      // 应该是加载动画
      this.loading = true
      // 查询用的都是$get，对应后端的 @GetMapping 注解
      // this.$get在src/utils/request.js
      // system是微服务的前缀，在gateway网关模块路由配置中，例子如下
      // - id: oreo-server-system
      //   uri: lb://oreo-server-system
      //   predicates:
      //     - Path=/system/**
      this.$get('/admin/user/verify', {
        ...params
      }).then((r) => {
        const data = r.data.data
        this.total = parseInt(data.total)
        this.list = data.rows
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
