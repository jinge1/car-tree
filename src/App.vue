<template>
  <div id="app">
    <!-- <SearchTree :list="list" :checkedList.sync="checkedList" /> -->
    <Chart></Chart>
  </div>
</template>

<script>
import SearchTree from './components/SearchTree'
import Chart from './components/chart'
// import { getTree } from './utils/utils'
// import treeData from './mock/tree'
// import carsData from './mock/cars'
// console.time(1)
// const list = Object.freeze(getTree(treeData.data, carsData.data))
// console.timeEnd(1)
export default {
  name: 'App',
  components: {
    // SearchTree,
    Chart,
  },
  data() {
    return {
      // list,
      checkedList: [],
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
