<template>
  <div id="app">
    {{ partCheckedNodeList }}
    <Tree
      :list="list"
      :showList.sync="showList"
      :checkedList="checkedList"
      :checkedNodeList="checkedNodeList"
      :partCheckedNodeList="partCheckedNodeList"
      @select="select"
    />
  </div>
</template>

<script>
import Tree from './components/Tree.vue'
import { getTree, getNodeList } from './utils/utils'
import treeData from './mock/tree'
import carsData from './mock/cars'

export default {
  name: 'App',
  components: {
    Tree,
  },
  data() {
    return {
      list: Object.freeze(getTree(treeData.data, carsData.data)),
      showList: [],
      checkedList: [],
      checkedNodeList: [],
      partCheckedNodeList: [], // 部分选中
    }
  },
  methods: {
    select(result, item) {
      const { list } = this
      this.checkedList = result
      this.updateNode(item)
    },
    updateNode(item) {
      const { list, checkedList } = this
      const { parentIds } = item
      const { partCheckedNodeList, checkedNodeList } = getNodeList(
        parentIds.length === 0 ? item : list.find((l) => l.id === parentIds[0]),
        checkedList
      )
      this.partCheckedNodeList = partCheckedNodeList
      this.checkedNodeList = checkedNodeList
      console.log(checkedNodeList, 678)
    },
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
