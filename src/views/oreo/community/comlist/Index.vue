<template>
  <div class="app-container">
    <div class="filter-container">
      <!--查询输入框-->
      <el-input v-model="queryParams.name" :placeholder="$t('table.community.name')" class="filter-item search-item" />
      <!--搜索按钮-->
      <el-button class="filter-item" type="primary" @click="search">
        {{ $t('table.search') }}
      </el-button>
      <!--重置按钮-->
      <el-button class="filter-item" type="success" @click="reset">
        {{ $t('table.reset') }}
      </el-button>
      <!--汉堡按钮-->
      <el-dropdown v-has-any-permission="['community:add','community:delete','community:reset','community:export']" trigger="click" class="filter-item">
        <el-button>
          {{ $t('table.more') }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-has-permission="['community:add']" @click.native="add">{{ $t('table.add') }}</el-dropdown-item>
          <el-dropdown-item v-has-permission="['community:delete']" @click.native="batchDelete">{{ $t('table.delete') }}</el-dropdown-item>
          <el-dropdown-item v-has-permission="['community:export']" @click.native="exportExcel">{{ $t('table.export') }}</el-dropdown-item>
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
      <el-table-column :label="$t('table.community.name')" prop="name" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.community.spacetotalnumber')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.spaceTotalNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.community.spaceavaliablenumber')" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.spaceAvailableNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.community.cooperationtime')" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.cooperationTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.community.cooperationdeadline')" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cooperationDeadline }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.community.addtime')" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <i v-hasPermission="['community:view']" class="el-icon-view table-operation" style="color: #87d068;" @click="view(row)" />
          <i v-hasPermission="['community:update']" class="el-icon-setting table-operation" style="color: #2db7f5;" @click="edit(row)" />
          <i v-hasPermission="['community:delete']" class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
          <el-link v-has-no-permission="['community:view','community:update','community:delete']" class="no-perm">
            {{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />
    <community-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
    <community-view
      ref="view"
      :dialog-visible="CommunityViewVisible"
      @close="viewClose"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import CommunityEdit from './Edit'
import CommunityView from './View'
export default {
  name: 'CommunityManage',
  components: { Pagination, CommunityEdit, CommunityView },
  data() {
    return {
      dialog: {
        isVisible: false,
        title: ''
      },
      CommunityViewVisible: false,
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      selection: [],
      pagination: {
        size: 10,
        num: 1
      }
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    // 关闭详情页
    viewClose() {
      this.CommunityViewVisible = false
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
    // 导出的方法
    exportExcel() {
      this.$download('system/user/excel', {
        pageSize: this.pagination.size,
        pageNum: this.pagination.num,
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
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
    view(row) {
      this.$refs.view.setCommunity(row)
      this.CommunityViewVisible = true
    },
    edit(row) {
      console.log(row)
      this.$refs.edit.setCommunity(row)
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
        const userIds = []
        this.selection.forEach((u) => {
          userIds.push(u.id)
        })
        console.log('userIds:' + userIds[0])
        console.log('userIds:' + userIds)
        this.delete(userIds)
      }).catch(() => {
        this.clearSelections()
      })
    },
    delete(userIds) {
      this.loading = true
      console.log('userIds:' + userIds[0])
      this.$delete(`admin/community/${userIds}`).then(() => {
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
      this.$get('admin/community', {
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
