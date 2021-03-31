<template>
  <div class="app-container">
    <div class="filter-container">
      <!--查询输入框-->
      <el-input v-model="queryParams.parkingSn" :placeholder="$t('车位编号')" class="filter-item search-item" />
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
      <el-select v-model="value" v-hasPermission="['community:change']" placeholder="选择小区" clearable class="date-range-item filter-item" @change="tgCommunity(value)" @clear="reset">
        <el-option
          v-for="item in communitys"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <!--汉堡按钮-->
      <el-dropdown v-has-any-permission="['park:add','park:delete','park:reset','park:export']" trigger="click" class="filter-item">
        <el-button>
          {{ $t('table.more') }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-has-permission="['park:add']" @click.native="add">{{ $t('table.add') }}</el-dropdown-item>
          <el-dropdown-item v-has-permission="['park:delete']" @click.native="batchDelete">{{ $t('table.delete') }}</el-dropdown-item>
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
      <el-table-column :label="$t('车位编号')" prop="name" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.parkingSn }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('小区名称')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.communityName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('车位状态')"
        :filters="[{ text: $t('禁用'), value: '1' }, { text: $t('启用'), value: '0' }]"
        :filter-method="filterStatus"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.parkingStatus | statusFilter">
            {{ row.parkingStatus === '1' ? $t('禁用') : $t('启用') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('车位添加时间')" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('车位修改时间')" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <i v-hasPermission="['park:update']" class="el-icon-setting table-operation" style="color: #2db7f5;" @click="edit(row)" />
          <i v-hasPermission="['park:delete']" class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
          <el-link v-has-no-permission="['park:update','park:delete']" class="no-perm">
            {{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />
    <park-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import ParkEdit from './Edit'
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  name: 'ParkManage',
  components: { Pagination, ParkEdit },
  filters: {
    statusFilter(status) {
      const map = {
        1: 'danger',
        0: 'success'
      }
      return map[status]
    }
  },
  data() {
    return {
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
      ParkViewVisible: false,
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
      value: ''
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
      return row.parkingStatus === value
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
    add() {
      // 新增用户，这里应该是跳转到user文件夹下的Edit.vue了
      this.dialog.title = this.$t('common.add')
      // 应该是展开窗口的开关
      this.dialog.isVisible = true
    },
    singleDelete(row) {
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    edit(row) {
      console.log(row)
      this.$refs.edit.setPark(row)
      this.dialog.title = this.$t('common.edit')
      this.dialog.isVisible = true
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
        const parkingIds = []
        this.selection.forEach((u) => {
          parkingIds.push(u.id)
        })
        console.log('parkingIds:' + parkingIds[0])
        console.log('parkingIds:' + parkingIds)
        this.delete(parkingIds)
      }).catch(() => {
        this.clearSelections()
      })
    },
    delete(parkingIds) {
      this.loading = true
      console.log('userIds:' + parkingIds[0])
      this.$delete(`admin/parking/${parkingIds}`).then(() => {
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
      this.$get('admin/parking', {
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
