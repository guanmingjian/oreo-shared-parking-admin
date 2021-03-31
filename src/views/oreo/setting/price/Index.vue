<template>
  <div class="role">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="8">
        <div class="app-container">
          <div class="filter-container">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span><b>包时套餐</b></span>
              </div>
              <div v-for="item in list" :key="item.id" class="text item">
                <div>套餐费用：￥{{ item.timeFee }}</div>
                <el-divider />
                <div>时长：{{ (item.time)/2 }}小时</div>
                <el-divider />
                <div>超时价格：￥{{ item.extraUnitFee }}   /30分钟</div>
                <el-divider />
                <div>担保金价格：￥{{ item.earnestPrice }}</div>
                <el-divider />
                <div>套餐描述：{{ item.timeDescription }}</div>
                <el-divider />
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span><b>计时套餐</b></span>
              </div>
              <div v-for="item in list" :key="item.id" class="text item">
                <div>价格：￥{{ item.unitFee }}   /30分钟</div>
                <el-divider />
                <div>担保金价格：￥{{ item.earnestPrice }}</div>
                <el-divider />
                <div>套餐描述：{{ item.unitDescription }}</div>
                <el-divider />
              </div>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span><b>{{ this.$t('修改包时套餐') }}</b></span>
          </div>
          <div>
            <el-form ref="form" :model="Price2" label-position="right" label-width="100px">
              <el-form-item :label="$t('套餐费用')" prop="unitFee" />
              <el-input v-model="Price2.timeFee" placeholder="套餐的总价格" />
              <el-form-item :label="$t('套餐时长')" prop="time" />
              <el-input v-model="Price2.time" placeholder="套餐的总时长" />
              <el-form-item :label="$t('超时费用')" prop="extraUnitFee" />
              <el-input v-model="Price2.extraUnitFee" placeholder="x元/半小时" />
              <el-form-item :label="$t('套餐描述')" prop="timeDescription" />
              <el-input v-model="Price2.timeDescription" placeholder="套餐的说明" />
            </el-form>
          </div>
        </el-card>
        <el-card>
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" :loading="buttonLoading" plain @click="submit">{{ this.$t('common.edit') }}</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span><b>{{ this.$t('修改担保金') }}</b></span>
          </div>
          <div>
            <el-form ref="form" :model="Price2" label-position="right" label-width="100px">
              <el-form-item :label="$t('担保金价格')" />
              <el-input v-model="earnestPrice.earnestPrice" />
            </el-form>
          </div>
        </el-card>
        <el-card>
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" :loading="buttonLoading" plain @click="submitEarn">{{ this.$t('common.edit') }}</el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span><b>{{ this.$t('修改计时套餐') }}</b></span>
          </div>
          <div>
            <el-form ref="form" :model="Price1" label-position="right" label-width="100px">
              <el-form-item :label="$t('价格')" prop="unitFee" />
              <el-input v-model="Price1.unitFee" placeholder="x元/半小时" />
              <el-form-item :label="$t('套餐描述')" prop="unitDescription" />
              <el-input v-model="Price1.unitDescription" placeholder="套餐的说明" />
            </el-form>
          </div>
        </el-card>
        <el-card>
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" :loading="buttonLoading" plain @click="submitCount">{{ this.$t('common.edit') }}</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  name: 'PriceManage',
  data() {
    return {
      earnestPrice: {
        communityId: 1,
        earnestPrice: ''
      },
      Price1: {
        communityId: 1,
        unitDescription: '',
        unitFee: ''
      },
      Price2: {
        communityId: 1,
        timeDescription: '',
        time: '',
        extraUnitFee: '',
        timeFee: ''
      },
      tableKey: 0,
      loading: false,
      buttonLoading: false,
      list: null,
      selection: [],
      total: 0,
      permsTree: [],
      queryParams: {},
      sort: {},
      pagination: {
        size: 10,
        num: 1
      }
    }
  },
  computed: {
  },
  mounted() {
    this.fetch()
  },
  methods: {
    onSelectChange(selection) {
      this.selection = selection
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    submit() {
      this.$put('admin/timeFee', { ...this.Price2 }).then(() => {
        this.$message({
          message: this.$t('tips.updateSuccess'),
          type: 'success'
        })
        this.$emit('success')
        this.search()
      })
      this.$put('admin/earnestPrice', { ...this.earnestPrice }).then(() => {
        this.$message({
          message: this.$t('tips.updateSuccess'),
          type: 'success'
        })
        this.$emit('success')
        this.search()
      })
    },
    submitEarn() {
      this.$put('admin/earnestPrice', { ...this.earnestPrice }).then(() => {
        this.$message({
          message: this.$t('tips.updateSuccess'),
          type: 'success'
        })
        this.$emit('success')
        this.search()
      })
    },
    submitCount() {
      this.$put('/admin/unitFee', { ...this.Price1 }).then(() => {
        this.$message({
          message: this.$t('tips.updateSuccess'),
          type: 'success'
        })
        this.$emit('success')
        this.search()
      })
    },
    add() {
      this.resetForm()
      this.$message({
        message: this.$t('tips.createTips'),
        type: 'info'
      })
    },
    sortChange(val) {
      this.sort.field = val.prop
      this.sort.order = val.order
      this.search()
    },
    reset() {
      this.resetForm()
      this.queryParams = {}
      this.sort = {}
      this.$refs.table.clearSort()
      this.search()
    },
    resetForm() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
    },
    search() {
      this.resetForm()
      this.fetch({
        ...this.queryParams,
        ...this.sort
      })
    },
    fetch(params = {}) {
      this.loading = true
      params.pageSize = this.pagination.size
      params.pageNum = this.pagination.num
      params.communityId = 1
      this.$get('admin/query', { ...params }).then((r) => {
        const data = r.data.data
        this.list = data.rows
        console.log(this.list)
        this.total = data.total
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .role {
    margin: 10px;
    .app-container {
      margin: 0 0 10px 0 !important;
    }
  }
  .el-card.is-always-shadow {
    box-shadow: none;
  }
  .el-card {
    border-radius: 0;
    border: none;
    .el-card__header {
      padding: 10px 20px !important;
      border-bottom: 1px solid #f1f1f1 !important;
    }
  }
   .text {
     font-size: 14px;
   }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>

