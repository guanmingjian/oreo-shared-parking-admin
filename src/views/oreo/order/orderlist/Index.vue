<template>
  <div class="app-container">
    <div class="filter-container">
      <!--查询输入框-->
      <el-input v-model="queryParams.name" :placeholder="$t('table.order.name')" class="filter-item search-item" />
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
      <el-select
        v-model="value"
        v-hasPermission="['community:change']"
        placeholder="切换小区"
        clearable
        class="date-range-item filter-item"
        @change="tgCommunity(value)"
        @clear="reset"
      >
        <el-option
          v-for="item in communitys"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <!--汉堡按钮-->
      <el-dropdown v-has-any-permission="['order:delete','order:delete']" trigger="click" class="filter-item">
        <el-button>
          {{ $t('table.more') }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-has-permission="['order:delete']" @click.native="batchDelete">{{ $t('table.delete') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
      <el-table-column :label="$t('table.order.name')" prop="name" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.communityName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.order.orderSn')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.orderSn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.order.parkingSn')" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.parkingSn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.order.carNumber')" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.carNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.order.enterTime')" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enterTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.order.leaveTime')" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leaveTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.order.actualPrice')" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.actualPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('订单状态')"
        :filters="[{ text: $t('进行中'), value: '1' }, { text: $t('已完成'), value: '2' }, { text: $t('已取消'), value: '3' }]"
        :filter-method="filterStatus"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.orderStatus | statusFilter">
            {{ row.orderStatus === '1' ? $t('进行中') : row.orderStatus === '2' ? $t('已完成'):$t('已取消') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <i v-hasPermission="['order:view']" class="el-icon-view table-operation" style="color: #87d068;" @click="view(row)" />
          <i v-hasPermission="['order:update']" class="el-icon-setting table-operation" style="color: #2db7f5;" @click="edit(row)" />
          <i v-hasPermission="['order:delete']" class="el-icon-document-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />
    <order-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
    <order-view
      ref="view"
      :dialog-visible="OrderViewVisible"
      @close="viewClose"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import OrderEdit from './Edit'
import OrderView from './View'
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  name: 'OrderManage',
  components: { Pagination, OrderEdit, OrderView },
  filters: {
    statusFilter(status) {
      const map = {
        1: 'danger',
        2: 'success',
        3: 'danger'
      }
      return map[status]
    },
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
  data() {
    return {
      value: '',
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
      OrderViewVisible: false,
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
      orderId: {
        orderId: 0
      }

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
        console.log('communitys:' + this.communitys)
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: this.$t('tips.getDataFail'),
          type: 'error'
        })
      })
    },
    filterStatus(value, row) {
      return row.orderStatus === value
    },
    // 关闭详情页
    viewClose() {
      this.OrderViewVisible = false
    },
    // 编辑框关闭
    editClose() {
      this.dialog.isVisible = false
    },
    // 编辑成功
    editSuccess() {
      this.search()
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
    view(row) {
      this.$refs.view.setOrder(row)
      this.OrderViewVisible = true
    },
    edit(row) {
      console.log('hello')
      console.log(row)
      this.$refs.edit.setOrder(row)
      this.dialog.title = this.$t('common.edit')
      this.dialog.isVisible = true
    },
    batchDelete() {
      this.$confirm(this.$t('选择的数据将被取消，是否继续'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.delete(this.selection[0].id)
      }).catch(() => {
        this.clearSelections()
      })
    },
    delete(id) {
      this.loading = true
      this.orderId.orderId = id
      this.$post('admin/order/cancel', { ...this.orderId }).then(() => {
        this.$message({
          message: this.$t('取消成功'),
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
      this.$get('/admin/order', {
        ...params
      }).then((r) => {
        const data = r.data.data
        // 等价于后端的OreoResponse().data(dataTable)
        console.log(r.data)
        // 等价于后端的OreoResponse().data(dataTable).rows
        console.log(r.data.data)
        // 获取数据赋值到全局变量
        // 到这里返回数据之后，前端就好好看他是如何解析这个data，然后渲染出数据来的
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
