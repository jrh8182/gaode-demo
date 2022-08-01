<template>
  <div id="index_container">
    <div id="search_wrap">
      <search></search>
    </div>
    <div id="map_wrap">
        <map-container></map-container>
    </div>
  </div>
</template>

<script>
import MapContainer from "@/components/MapContainer";
import Search from "@/components/search";
export default {
  name: "index",
  components: {Search, MapContainer}
}
</script>

<style lang="less" scoped>
  #index_container{
    height: 100%;
    width: 100%;
    position: relative;
    #map_wrap{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      height: 60%;
      width: 60%;
    }
  }

   #search_wrap{
    position: absolute;
    top:10%;
    left:50%;
    transform: translate(-50%,-50%);
    height: 60px;
    width: 400px;
  }
</style>