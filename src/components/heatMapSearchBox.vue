<template>
  <div id="heat_map_search_box_container">
    <!--   check事件回调值是更新后Boolean-->
    <el-checkbox v-model="checked" @change="sendHeatMapCheck($event)"
      >显示小区热力图</el-checkbox
    >
  </div>
</template>

<script>
import bus from "@/bus/bus";
export default {
  name: "heatMapSearchBox",
  data() {
    return {
      //选项栏控制
      checked: false,
    };
  },
  methods: {
    sendHeatMapCheck(event) {
      bus.$emit("shareHeatMapCheck", event);
      // console.log('调用1次')
    },
  },
};
</script>

<style lang="less" scoped>
#heat_map_search_box_container {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
