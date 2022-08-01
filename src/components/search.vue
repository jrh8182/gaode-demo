<template>
  <div id="search_container">
    <input type="text" placeholder="请输入查找关键词" v-model="inputObject.userInput" :id="inputObject.inputId">
    <button id="searchBtn"  @click="send">搜索</button>
  </div>
</template>

<script>
import bus from '@/bus/bus'
export default {
  name: "search",
  data(){
    return{
      inputObject:{
        userInput: '',
        //通过id绑定auto的关系
        inputId:'searchInput'
      },
    }
  },
  methods:{
    send(){
      bus.$emit('shareUserInput',this.inputObject)
      console.log(this.inputObject)
    }
  },
  mounted() {
    //向Map 输入提示功能的input的DOM ID
    this.send()
  }
}
</script>

<style lang="less"  scoped>
  #search_container{
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    input{
      height: 30px;
      width: 300px;
    }
    #searchBtn{
      background-color: #bfa;
      height: 30px;
      width: 100px;
      border-radius: 5px;
    }
  }
</style>