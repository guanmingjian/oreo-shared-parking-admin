<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.userName" :placeholder="$t('table.user.username')" class="filter-item search-item" />
      <el-button class="filter-item" type="primary" @click="search">
        {{ $t('table.search') }}
      </el-button>
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
          :value="String(item.id)"
        />
      </el-select>
      <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        :start-placeholder="$t('table.user.createTime')"
        value-format="yyyy-MM-dd"
        class="filter-item search-item date-range-item"
        type="daterange"
      />
      <el-dropdown v-has-any-permission="['user:add','user:delete','user:reset','user:export']" trigger="click" class="filter-item">
        <el-button>
          {{ $t('table.more') }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-has-permission="['user:delete']" @click.native="batchDelete">{{ $t('table.delete') }}</el-dropdown-item>
          <el-dropdown-item v-has-permission="['user:export']" @click.native="exportExcel">{{ $t('table.export') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      style="width: 100%;"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column :label="$t('table.user.username')" prop="username" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.user.sex')"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.gender | sexFilter">
            {{ transSex(row.gender) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.user.mobile')" :show-overflow-tooltip="true" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.user.createTime')" prop="createTime" align="center" min-width="180px" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.registerTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.user.accountAmount')" prop="accountAmount" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.accountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <i v-hasPermission="['user:view']" class="el-icon-view table-operation" style="color: #87d068;" @click="view(row)" />
          <i v-hasPermission="['user:delete']" class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
          <el-link v-has-no-permission="['user:view','user:update','user:delete']" class="no-perm">
            {{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />
    <user-view
      ref="view"
      :dialog-visible="userViewVisible"
      @close="viewClose"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import UserView from './View'
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  name: 'UserManage',
  components: { Pagination, UserView },
  filters: {
    sexFilter(status) {
      const map = {
        0: 'success',
        1: 'danger',
        2: 'info'
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
      userViewVisible: false,
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      sort: {},
      communityId: {
        communityId: 0
      },
      selection: [],
      pagination: {
        size: 10,
        num: 1
      },
      communitys: [],
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
    transSex(sex) {
      switch (sex) {
        case '男':
          return this.$t('common.sex.male')
        case '女':
          return this.$t('common.sex.female')
        default:
          return this.$t('common.sex.secret')
      }
    },
    viewClose() {
      this.userViewVisible = false
    },
    onSelectChange(selection) {
      this.selection = selection
    },
    search() {
      this.fetch({
        ...this.queryParams,
        ...this.sort
      })
    },
    reset() {
      this.queryParams = {}
      this.sort = {}
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    exportExcel() {
      this.$download('system/user/excel', {
        pageSize: this.pagination.size,
        pageNum: this.pagination.num,
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
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
    batchDelete() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t('tips.noDataSelected'),
          type: 'warning'
        })
        return
      }
      let contain = false
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const userIds = []
        this.selection.forEach((u) => {
          if (u.id === this.currentUser.userId) {
            contain = true
            return
          }
          userIds.push(u.id)
        })
        if (contain) {
          this.$message({
            message: this.$t('tips.containCurrentUser'),
            type: 'warning'
          })
          this.clearSelections()
        } else {
          this.delete(userIds)
        }
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    // 删除用户
    // system/user/${userIds} 这种属于restful风格的接口，在{}中传参数，特点就是简介了
    // 删除使用this.$delete，对应后端@DeleteMapping注解
    // userIds是一个或多个用户id的字符串，用，号隔开
    delete(userIds) {
      this.loading = true
      this.$delete(`admin/user/${userIds}`).then(() => {
        this.$message({
          message: this.$t('tips.deleteSuccess'),
          type: 'success'
        })
        this.search()
      })
    },
    view(row) {
      this.$refs.view.setUser(row)
      this.userViewVisible = true
    },
    // 查询用户信息
    fetch(params = {}) {
      // 获取分页信息
      params.pageSize = this.pagination.size
      params.pageNum = this.pagination.num
      // 获取时间信息
      // if (this.queryParams.timeRange) {
      //   params.createTimeFrom = this.queryParams.timeRange[0]
      //   params.createTimeTo = this.queryParams.timeRange[1]
      // }
      // 应该是加载动画
      this.loading = true
      // 查询用的都是$get，对应后端的 @GetMapping 注解
      // this.$get在src/utils/request.js
      // system是微服务的前缀，在gateway网关模块路由配置中，例子如下
      // - id: oreo-server-system
      //   uri: lb://oreo-server-system
      //   predicates:
      //     - Path=/system/**
      this.$get('admin/user', {
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
    },
    sortChange(val) {
      this.sort.field = val.prop
      this.sort.order = val.order
      this.search()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
