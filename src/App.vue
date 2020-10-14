<template>
  <div id="app">
    <SearchTree :list="list" :checkedList.sync="checkedList" />
  </div>
</template>

<script>
import SearchTree from './components/SearchTree'
import { getTree } from './utils/utils'
import treeData from './mock/tree'
import carsData from './mock/cars'

export default {
  name: 'App',
  components: {
    SearchTree,
  },
  data() {
    return {
      list: Object.freeze(getTree(treeData.data, carsData.data)),
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
