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
  data(){
    return{
      map:null,
      //搜索建议控件相关
      autoOptions: {
        input: ''
      },
      auto: null,
      placeSearch: null,
      //搜素关键词 自己输入的
      searchPlaceInput: '',
      //保持最新--同步显示 用来搜素热力图
      newSearchPlaceInput:'',
      //边界绘制
      district: null,
      //多边形
      polygons: [],
      //是否显示热力图--默认false
      heatMapCheck : false,
      heatmap: null,
      heatmapList:[],
    }
  },
  created(){
    bus.$on('shareInputId',val => {
      this.autoOptions.input = val
      //  val是bus传来的值
    }),
    bus.$on('shareUserInput',val=>{
      this.searchPlaceInput = val
    })
    bus.$on('shareHeatMapCheck',val=>{
      this.heatMapCheck = val
      // console.log(this.heatMapCheck)
    })
  },
  watch:{
    //点击按钮后的搜索
    searchPlaceInput(newVal){
      if(newVal!=null){
        //替换新值
        this.newSearchPlaceInput=newVal
        //搜索
        this.placeSearch.search(newVal)
        //绘制边界
        this.drawBounds(newVal)
        this.map.setZoom(15,true,1)  //是否立即过渡到目标位置   动画过度的时长控制
      //  清除热力图

      }
    },

    newSearchPlaceInput(newVal){
      if (this.heatmapList.length>0){
        for (let i = 0; i < this.heatmapList.length ; i++) {
          this.heatmapList[i].hide()
          // console.log(this.heatmapList.length)
        }
        this.heatmapList=[]//清空
      }
      if(this.heatMapCheck==true){
        this.showheatMap()
      }
    },

    heatMapCheck(newVal){
      //控制隐藏
      if (newVal){
        this.showheatMap()
      }else {
        for (let i = 0; i < this.heatmapList.length ; i++) {
          this.heatmapList[i].hide()
          // console.log(this.heatmapList.length)
        }
        this.heatmapList = []
      };

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
        //绑定搜索建议
        this.auto = new AMap.AutoComplete(this.autoOptions)
        //poi搜索处理逻辑
        this.placeSearch = new AMap.PlaceSearch({
          map: this.map
        }) //构造地点查询类
        //如果要实现输入栏和联想框选择的双向绑定可以使用choose事件回调
        this.auto.on('select', this.select) //auto绑定事件   使用auto.on的select进行侦听，发现有select事件调用select函数
        //通过select的关键字传递给search 以同步输入内容
      }).catch(e=>{
        console.log(e);
      })
    },
    //搜索poi---select 函数
    select(e){
      this.newSearchPlaceInput=e.poi.name //select的关键词与最新输入值同步，用来绘制热力图
      bus.$emit('selectInput',e.poi.name)
      this.placeSearch.setCity(e.poi.adcode) //搜索的城市的id
      this.placeSearch.search(e.poi.name)
      this.map.setCenter([e.poi.location.lng, e.poi.location.lat]) //查询点放置中心
      this.map.setZoom(15,true,1)  //是否立即过渡到目标位置   动画过度的时长控制
      this.drawBounds(e.poi.name)
    },
    //绘制市级边界
    drawBounds(keyWord){
      if(!this.district) { //若为空
        //实例化DistrictSearch，设置参数
        var opts = {
          subdistrict: 0, //获取边界不需要返回下级行政区
          extensions: 'all', //返回行政区边界坐标组等具体信息
          level: 'district' //查询行政级别为 市
        }
        //绑定控件并回调实例化
        this.map.plugin(['AMap.DistrictSearch'], () => {
          this.district = new AMap.DistrictSearch(opts)
        })
      }
        //行政区查询---查没查到都要清楚
        this.district.search(keyWord, (status, result) => {
          if (this.polygons != null) {
            this.map.remove(this.polygons) //清除上次结果
            this.polygons = []
          }
          // console.log(result)
          // JSON.stringify(result)!== '{}' or status!== 'no_data'
          //有查询结果提示绘制边界
          if(status!== 'no_data'){
            //反馈信息
            this.feedbackMsg('区域搜索成功,正在绘制边界....' ,'success')
            //遍历生成polygon
            var bounds = result.districtList[0].boundaries
            if (bounds) {
              for (var i = 0, l = bounds.length; i < l; i++) {
                //生成行政区划polygon
                var polygon = new AMap.Polygon({
                  strokeWeight: 1,
                  path: bounds[i],
                  fillOpacity: 0.4,
                  fillColor: '#80d8ff',
                  strokeColor: '#0091ea'
                })
                this.polygons.push(polygon)
              }
            }
            this.map.add(this.polygons)
            this.map.setFitView(this.polygons) //视口自适应
          }else {
            this.feedbackMsg('已查询到相关地点','success')
          }
        })
    },
    //反馈操作情况
    feedbackMsg(msg,type){
      this.$message({
        showClose:true,
        message:msg,
        type:type
      })
    },
    //加载 显示热力图
    showheatMap(val){
      // console.log(this.searchPlaceInput)
      const reg = /.+?(省|市|区)/g;
      const split =  this.newSearchPlaceInput.match(reg)
      // console.log(split)
      if (split==null){
        this.$notify({
          title: '寄了',
          message: '热力图获取失败，搜索热力图时所填关键字应为城/区(填写不规范会造成异常数据)',
          type: 'warning'
        })
        return
      }
      else if(split.length>1) {
        //通过监听 递归一次 选取到地址中的区/市/省 并将热力图的city设置为区->市->省，及数组最后一个
        this.newSearchPlaceInput=split[split.length-1]
        return; //修改后返回，监听器会再执行这个函数--其实这个变量设置的有点多余，但我懒得改了
        //虽然不能百分百排除,可以排除一部分
      }

      if(this.newSearchPlaceInput!==''){
        this.map.plugin(['AMap.PlaceSearch'], () => {
          //构造地点查询类
          var placeSearch = new AMap.PlaceSearch({
            pageSize: 50, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: this.newSearchPlaceInput, // 兴趣点城市
            citylimit: true //是否强制限制在设置的城市内搜索
            //map: this.map, // 展现结果的地图实例
            // panel: 'panel', // 结果列表将在此容器中进行展示。
            // autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
          })
          //关键字查询
          placeSearch.search('小区', (status, result) => {
            // console.log(result)
            this.getHotChartPos('小区', result)
          })
        })
        this.$notify({
          title: '成功',
          message: '热力图获取成果，但是由于电脑性能，我们仅加载部分数据',
          type: 'success'
        })
      }else {
        this.$notify({
          title: '寄了',
          message: '热力图获取失败，搜索热力图时所填关键字应为城/区(填写不规范会造成异常数据)',
          type: 'warning'
        })
      }


    },
    //对目标进行实际的搜索获取每一个需要的对象的坐标
    getHotChartPos(detail, result) {
      let lengthSize = result.poiList.pageSize
      const count = result.poiList.count
      // const lengthPage = count / lengthSize
      if (lengthSize > count) {
        lengthSize = count
      }
      for (var n = 0; n < 2; n++) {
        // this.map.plugin(['AMap.PlaceSearch'], () => {
        //构造地点查询类
        var realSearch = new AMap.PlaceSearch({
          pageSize: 50, // 单页显示结果条数
          pageIndex: n + 1, // 页码
          city: this.newSearchPlaceInput, // 兴趣点城市
          citylimit: true //是否强制限制在设置的城市内搜索
          // map: this.map, // 展现结果的地图实例
          // panel: 'panel', // 结果列表将在此容器中进行展示。
          // autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        })
        realSearch.search(detail, (status, result) => {
          // for (var j = 0; j < 50; j++) {
          // this.map.remove(this.map.getAllOverlays('marker'))
          //var centerPoint = [result.poiList.pois[j].location.lng, result.poiList.pois[j].location.lat]
          // console.log(result)
          //热力图
          this.showHatChart(result)
          // }
        })
      }
    },
    // 将需要的坐标加到热力图中让页面渲染
    // 其中的info是对热力图中的点进行处理，count是用于设置渲染强烈程度的
    showHatChart(result) {
      var info = []
      for (let i = 0; i < 50; i++) {
        info.push({
          lng: result.poiList.pois[i].location.lng,
          lat: result.poiList.pois[i].location.lat,
          count: 3 * 6.4 * Math.round(Math.random() * (10 - 2) + 2)
        })
      }
      this.map.plugin(['AMap.HeatMap'], () => {
        // console.log('nn')
        //初始化heatmap对象
        this.heatmap = new AMap.HeatMap(this.map, {
          radius: 56, //给定半径
          opacity: [0, 0.5]
          /*,
            gradient:{
                0.5: 'blue',
                0.65: 'rgb(117,211,248)',
                0.7: 'rgb(0, 255, 0)',
                0.9: '#ffea00',
                1.0: 'red'
            }
             */
        })
        //设置数据集
        this.heatmap.setDataSet({
          data: info,
          max: 100
        })
        this.heatmapList.push(this.heatmap)
        this.heatmap.show()
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