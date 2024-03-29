module.exports = {
  title: 'Oreo Cloud',
  // 获取令牌时，请求头信息(Basic Base64.encode(client_id:client_secret))
  authorizationValue: 'Basic b3JlbzoxMjM0NTY=',
  // 社交登录后台地址(第三方登录)
  socialLoginUrl: 'http://localhost:8301/auth/social/login',
  // 请替换为您的实际地址
  pages: {
    // OREO-Admin 控制台地址
    springBootAdminUrl: 'http://localhost:8201/login',
    // kibana 控制台地址
    kibanaUrl: 'http://localhost:5601',
    // nacos 控制台地址
    nacosUrl: 'http://118.178.89.11:8001/nacos',
    // skywalking地址
    skywalkingUrl: 'http://localhost:8080/',
    // 文档中心
    docUrl: 'http://localhost:8301/doc.html',
    // Granfana控制台
    grafanaUrl: 'http://localhost:8404/',
    // tx-manager控制台
    txUrl: 'http://localhost:8501/admin/index.html#/login'
  }
}
