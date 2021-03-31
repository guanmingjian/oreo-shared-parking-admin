export default {
  route: {
    dashboard: '系统主页',
    profile: '个人中心'
  },
  navbar: {
    setting: '系统设置',
    logOut: '退出登录',
    profile: '个人中心',
    theme: '换肤',
    size: '布局大小',
    deleteCache: '清除缓存'
  },
  login: {
    title: '欢迎登陆',
    logIn: '立即登录',
    username: '账号',
    password: '密码',
    code: '验证码',
    ortherLoginType: '其他登录方式',
    chooseToSignIn: '选择以下账号登录：',
    type: {
      up: '账号密码登录',
      social: '第三方账号登录'
    }
  },
  documentation: {
    documentation: '项目文档',
    github: '项目地址'
  },
  table: {
    order: {
      orderSn: '订单流水号',
      name: '订单名称',
      carNumber: '车牌号',
      enterTime: '入场时间',
      leaveTime: '离场时间',
      actualPrice: '实付价格',
      orderStatus: '订单状态',
      parkingSn: '车位号',
      payStatus: '支付状态',
      payName: '支付人',
      completeTime: '完成时间'
    },
    community: {
      name: '小区名称',
      spacetotalnumber: '停车位总数量',
      spaceavaliablenumber: '停车位可用数量',
      addtime: '添加时间',
      updatetime: '修改时间',
      cooperationtime: '合作时间',
      cooperationdeadline: '合作截止时间',
      status: '可用状态',
      city: '城市',
      province: '省份',
      area: '区域',
      address: '详细地址',
      longitude: '经度',
      latitude: '纬度'
    },
    user: {
      username: '用户名',
      realName: '真实名字',
      password: '密码',
      sex: '性别',
      email: '邮箱',
      dept: '部门',
      community: '小区',
      role: '角色',
      mobile: '电话',
      status: '状态',
      type: '类型',
      createTime: '创建时间',
      modifyTime: '修改时间',
      lastLoginTime: '最后登录时间',
      desc: '个人描述',
      oldPassword: '旧密码',
      newPassword: '新密码',
      confirmPassword: '再次确认',
      social: '第三方账号',
      dataPermission: '数据权限',
      address: '地址',
      nation: '民族',
      idCard: '身份证号码',
      creditScore: '信用分',
      begin: '签发日期',
      accountAmount: '账户金额',
      age: '年龄',
      end: '失效日期',
      department: '签发机关',
      born: '出生日期',
      beginDate: '注册时间'
    },
    role: {
      roleName: '角色名称',
      remark: '角色描述',
      createTime: '创建时间',
      perms: '角色权限'
    },
    menu: {
      parentId: '上级菜单',
      menuName: '名称',
      type: '类型',
      icon: '图标',
      component: '组件',
      path: 'URL',
      orderNum: '排序',
      perms: '权限'
    },
    dept: {
      deptName: '部门名称',
      parentId: '上级部门',
      orderNum: '排序'
    },
    client: {
      clientId: '客户端ID',
      clientSecret: '客户端秘钥',
      scope: '范围',
      authorizedGrantTypes: '认证模式',
      accessTokenValidity: '访问令牌有效期（秒）',
      refreshTokenValidity: '刷新令牌有效期（秒）',
      webServerRedirectUri: '重定向地址',
      autoapprove: '自动授权'
    },
    systemLog: {
      username: '操作人',
      operation: '操作描述',
      createTime: '操作时间',
      time: '耗时',
      method: '操作方法',
      params: '方法参数',
      ip: 'IP',
      location: '操作地点'
    },
    loginLog: {
      username: '用户名',
      loginTime: '登录时间',
      ip: 'IP',
      location: '登录地点',
      system: '登录系统',
      browser: '浏览器'
    },
    gen: {
      config: {
        author: '作者名称',
        basePackage: '基础包名',
        entityPackage: 'entity包名',
        mapperPackage: 'mapper包名',
        mapperXmlPackage: 'mapperXml包名',
        servicePackage: 'service包名',
        serviceImplPackage: 'serviceImpl包名',
        controllerPackage: 'controller包名',
        isTrim: '是否去除表前缀',
        trimValue: '表前缀'
      },
      generate: {
        tableName: '表名',
        remark: '备注',
        dataRows: '数据量（行）',
        createTime: '创建时间',
        updateTime: '更新时间',
        datasource: '数据库'
      }
    },
    job: {
      beanName: 'Bean名称',
      methodName: '方法名称',
      params: '方法参数',
      cronExpression: 'Cron表达式',
      status: '状态',
      createTime: '创建时间',
      executeTime: '执行时间',
      error: '错误信息',
      time: '耗时',
      remark: '备注',
      add: '新增',
      delete: '删除',
      resume: '恢复',
      pause: '暂停',
      run: '运行一次',
      fail: '失败',
      success: '成功',
      normal: '正常'
    },
    eximport: {
      field1: '字段1',
      field2: '字段2',
      field3: '字段3',
      createTime: '导入时间'
    },
    datapermissionTest: {
      field1: '字段1',
      field2: '字段2',
      field3: '字段3',
      field4: '字段4',
      createTime: '创建时间',
      tips: '数据权限测试，不同用户看到的数据不一样'
    },
    routeUser: {
      tips: '网关管理用户账号列表，权限分为普通用户（user）和管理用户（admin）',
      username: '用户名',
      perm: '权限',
      createTime: '创建时间',
      password: '密码'
    },
    routeLog: {
      tips: '网关转发请求日志，这些为未被限流或黑名单规则拦截的请求',
      ip: '请求IP',
      targetServer: '目标服务',
      requestMethod: '请求方法',
      requestTime: '请求时间',
      requestUri: '请求URI',
      targetUri: '目标URI',
      location: '请求地址'
    },
    rateLimitRule: {
      tips: '定义网关限流规则，不符合规则的请求将被拦截，拦截记录可以通过限流日志查看',
      requestUri: '请求URI',
      requestMethod: '请求方法',
      limitFrom: '限制时间起',
      allTheTime: '所有时间',
      limitTo: '限制时间止',
      count: '请求次数',
      period: '时间周期（秒）',
      createTime: '创建时间',
      nst: '不支持通配符',
      status: '规则状态',
      timeLimit: '时间限制',
      timeRange: '时间范围'
    },
    rateLimitLog: {
      tips: '展示被限流规则拦截的请求日志',
      requestUri: '请求URI',
      requestMethod: '请求方法',
      createTime: '请求时间',
      ip: '请求IP',
      location: '请求地址'
    },
    blackList: {
      tips: '定义网关请求黑名单',
      requestUri: '请求URI',
      requestMethod: '请求方法',
      createTime: '创建时间',
      ip: '请求IP',
      location: '请求地址',
      allIp: '所有IP',
      limitFrom: '限制时间起',
      allTheTime: '所有时间',
      limitTo: '限制时间止',
      status: '规则状态',
      st: '支持通配符',
      timeLimit: '时间限制',
      timeRange: '时间范围'
    },
    blockLog: {
      tips: '展示被限流规则拦截的请求日志',
      requestUri: '请求URI',
      requestMethod: '请求方法',
      createTime: '请求时间',
      ip: '请求IP',
      location: '请求地址'
    },
    routeLogin: {
      needLogin: '网关管理模块操作需要认证，',
      toLogin: '点击认证',
      tips: '该模块功能需要预先开启网关增强，开启方法请参考文档：',
      title: 'Oreo 网关管理认证',
      login: '认证'
    },
    refresh: '刷新',
    operation: '操作',
    search: '搜索',
    reset: '重置',
    more: '更多操作',
    add: '添加',
    export: '导出',
    import: '导入',
    templateDownload: '模板下载',
    delete: '删除',
    resetPassword: '密码重置',
    openInNewPage: '新页面打开'
  },
  tagsView: {
    refresh: '刷新当前',
    close: '关闭当前',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  },
  system: {
    title: '智慧小区共享停车位'
  },
  tips: {
    usernameShouldNotBeEmpty: '用户名不能为空',
    passwordShouldNotBeEmpty: '密码不能为空',
    switchLanguageSuccess: '切换语言成功',
    loginSuccess: '登录成功',
    loginFail: '登录失败',
    defaultPassword: '用户的默认密码为123456',
    getDataFail: '获取数据失败',
    createSuccess: '新增成功',
    updateSuccess: '修改成功',
    deleteSuccess: '删除成功',
    noDataSelected: '请先选择需要操作的数据',
    confirmDelete: '选中数据将被永久删除, 是否继续？',
    confirmDeleteCache: '是否立即清除用户权限缓存？',
    containCurrentUser: '包含当前登录用户，操作已取消',
    neverLogin: '从未登录过系统',
    nothing: '这家伙很懒，什么都没留下',
    topId: '值为0时表示顶级节点',
    choose: '已选择：',
    chooseNothing: '尚未选择任何图标',
    onlyChooseOne: '只能选择一个节点作为父节点',
    noNodeSelected: '请先选择节点',
    confirmDeleteNode: '选中节点及其子结点将被永久删除, 是否继续？',
    iframeGrant: '用户名：FEBS 密码：123456',
    notEqual: '两次输入不一致',
    oldPasswordIncorrect: '原密码不正确',
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    onlySupportXlsx: '只支持Xlsx类型文件',
    updating: '修改中',
    updateFailed: '修改失败',
    noPermission: '无权限',
    confirmRestPassword: '确定重置所选用户密码？',
    resetPasswordSuccess: '所选用户密码重置已被重置为1234qwer',
    getCodeImageFailed: '获取图形验证码失败',
    tooManyRequest: '获取验证码过于频繁，请稍后再试',
    clientOriginSecret: '该客户端秘钥值：',
    sameRule: '已存在相同的规则',
    createTips: '请在表单中填写相关信息',
    cronInvalid: 'Cron表达式不合法',
    executeSuccess: '成功',
    executeFail: '失败'
  },
  rules: {
    require: '不能为空',
    range2to10: '长度在 2 到 10 个字符',
    range3to10: '长度在 3 到 10 个字符',
    range3to20: '长度在 3 到 20 个字符',
    range4to10: '长度在 4 到 10 个字符',
    range6to20: '长度在 6 到 20 个字符',
    email: '请输入正确的邮箱地址',
    mobile: '请输入合法的手机号',
    usernameExist: '该用户名已存在',
    clientIdExist: '该Client ID已存在',
    roleNameExist: '该角色名称已存在',
    noMoreThan10: '长度不能超过10个字符',
    noMoreThan11: '长度不能超过11个字符',
    noMoreThan20: '长度不能超过20个字符',
    noMoreThan50: '长度不能超过50个字符',
    noMoreThan100: '长度不能超过100个字符',
    invalidInteger: '请输入大于零的整数',
    invalidURL: '不是有效的URL'
  },
  common: {
    system: '智慧小区共享停车位',
    desc: {
      a: 'Oreo奥利奥团队',
      b: '欢迎使用'
    },
    view: '查看',
    tips: '提示',
    clear: '清除',
    confirm: '确定',
    cancel: '取消',
    add: '新增',
    edit: '修改',
    yes: '是',
    no: '否',
    open: '开启',
    close: '关闭',
    sex: {
      male: '男性',
      female: '女性',
      secret: '保密'
    },
    status: {
      valid: '有效',
      invalid: '禁用'
    },
    menu: {
      menu: '菜单',
      button: '按钮'
    },
    tab: {
      common: '通用类',
      directivity: '指向性',
      solid: '填充类',
      food: '食品类'
    },
    aboutMe: '关于我',
    changeAvatar: '更换头像',
    lastLoginTime: '上次登录时间',
    goodMorning: '早上好',
    goodAfternoon: '下午好',
    goodEvening: '晚上好',
    randomMessage: {

    },
    allProject: '所有项目',
    noDept: '暂无部门',
    noRole: '暂无角色',
    firstLogin: '第一次登录系统',
    todayIp: '今日IP',
    todayVisit: '今日访问',
    TotalVisit: '总访问量',
    you: '您',
    total: '总数',
    visitTitle: '近十天系统访问记录',
    timeline: '登录时间',
    account: '账号信息',
    password: '个人密码',
    importResult: '导入结果',
    hthz: '后田花子',
    al: '阿里系',
    lm: '脸萌',
    ctc: '点击选择',
    pleaseInputUrl: '请输入URL',
    bind: '绑定',
    unbind: '解绑',
    confirmUnbind: '确定解绑该第三方账号？',
    unbindSuccess: '解绑成功',
    bindSuccess: '绑定成功',
    bindLogin: '绑定并登录',
    signLogin: '注册并登录',
    current: '当前',
    socialAccount: '账号',
    socialTips: '尚未绑定任何系统账户，您可以绑定系统账户或者注册一个新的账户并绑定。'
  }
}
