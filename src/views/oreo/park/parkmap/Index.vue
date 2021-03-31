<template>
  <div id="content">
    <div id="map-container" />
  </div>
</template>

<script>
export default {
  mounted() {
    var esmapID = '10005'
    var container = document.getElementById('map-container')
    // console.log(window.esmap)
    var map = new window.esmap.ESMap({
      container: container, // 渲染dom
      mapDataSrc: './esmap', // 地图数据位置
      mapThemeSrc: './esmap/theme', // 主题数据位置
      // visibleFloors: 'all', // 更多初始化参数配置请参考https://www.esmap.cn/escopemap/content/cn/develope/map-config.html
      focusAlphaMode: true, // 对不可见图层启用透明设置 默认为true
      focusAnimateMode: true, // 开启聚焦层切换的动画显示
      focusAlpha: 0.4, // 对不聚焦图层启用透明设置，当focusAlphaMode = true时有效
      focusFloor: 1,
      token: 'escope'
    })
    // 打开地图数据
    map.openMapById(esmapID)
    map.showCompass = true // 显示指南针

    window.map = map
  }
}

</script>

<style>
  #content{
    display: flex;
    justify-content: center;
  }
  #map-container{
    height:800px;
    width:80%;
  }
</style>
