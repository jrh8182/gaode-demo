<template>
  <div id="index_container">
    <div id="search_wrap">
      <search></search>
    </div>
    <div id="map_wrap">
        <map-container></map-container>
    </div>
    <div id="heatmap_box_wrap">
       <heat-map-search-box></heat-map-search-box>
    </div>
    <div id="shadow_wrap">
    </div>
  </div>
</template>

<script>
import MapContainer from "@/components/MapContainer";
import Search from "@/components/search";
import HeatMapSearchBox from "@/components/heatMapSearchBox";
export default {
  name: "index",
  components: {HeatMapSearchBox, Search, MapContainer}
}
</script>

<style lang="less" scoped>
  #index_container{

    background-color: #e6edf3;
    height: 100%;
    width: 100%;
    position: relative;
    #map_wrap{
      z-index:10 ;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      height: 60%;
      width: 60%;
    }
    #heatmap_box_wrap{
      z-index: 10;
      //transform: translate(-50%,-50%);
      top: 15%;
      left: 40%;
      position: absolute;
    }
  }
    #shadow_wrap{
      position: absolute;
      background-color: #d2d9dc;
      height: 80%;
      //transform: translate(-50%,-50%);
      width: 80%;
      //top:40%;
      left: 10%;
    }
   #search_wrap{
     z-index: 10; //优先级
    position: absolute;
    top:10%;
    left:50%;
    transform: translate(-50%,-50%);
    height: 60px;
    width: 400px;
  }

</style>