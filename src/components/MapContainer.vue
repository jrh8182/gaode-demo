<template>
  <div id="container"></div>
</template>


<script>
import bus from '@/bus/bus'
import AMapLoader from '@amap/amap-jsapi-loader';
//引入安全密钥
window._AMapSecurityConfig = {
  securityJsCode:'46457925a2b8a797f04c1a4defcf4bea',
}
export default {
  name: "MapContainer",
  created(){
    bus.$on('shareUserInput',val => {
      this.autoOptions.input = val.inputId
    })
  },
  data(){
    return{
      map:null,
      //搜索建议控件相关
      autoOptions: {
        input: ''
      },
      auto: null,
    }
  },

  methods:{
    //地图初始化函数 initMap
    initMap(){
      AMapLoader.load({
        key:"36a4e83d27c8a5b4564f23bd388033cb",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins:['AMap.ToolBar', 'AMap.Scale', 'AMap.MapType','AMap.PlaceSearch','AMap.AutoComplete'],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap)=>{
        this.map = new AMap.Map("container",{  //设置地图容器id
          viewMode:"3D",    //是否为3D地图模式
          zoom:10,           //初始化地图级别
          center:[121.473667, 31.230525], //初始化地图中心点位置
        });
        this.map.addControl(new AMap.Scale())
        this.map.addControl(new AMap.ToolBar())
        this.map.addControl(new AMap.MapType())
        this.auto = new AMap.AutoComplete(this.autoOptions)
      }).catch(e=>{
        console.log(e);
      })
    },
  },
  mounted(){
    //DOM初始化完成进行地图初始化
    this.initMap();
  },

}
</script>

<style lang="less" scoped>
  #container{
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
  }
</style>