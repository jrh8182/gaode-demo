<template>
  <div id="search_container">
    <el-input  v-model="inputObject.userInput" :id="inputObject.search_id" placeholder="请输入查找关键词" type="text"></el-input>
    <!--    <input type="text"  v-model="inputObject.userInput" :id="inputObject.inputId">-->
<!--    <button id="searchBtn"  @click="send">搜索</button>-->
    <el-button  id="searchBtn" type="primary" @click="sendMsg" native-type="submit" size="medium" icon="el-icon-search"></el-button>
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
        search_id:'searchInput'
      },
    }
  },
  methods:{
    sendMsg(){
      bus.$emit('shareUserInput',this.inputObject.userInput)
      console.log('搜索了'+ this.inputObject.userInput)
    },
    //用于绑定输入框 输入联想
    sendId(){
      bus.$emit('shareInputId',this.inputObject.search_id)
      console.log(this.inputObject)
    }
  },
  mounted() {
    //向Map 输入提示功能的input的DOM ID
    this.sendId()
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
      //width: 90px;
    }
  }
</style>