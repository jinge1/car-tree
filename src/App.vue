<template>
  <div id="app">
    <Tree
      :list="list"
      :showList.sync="showList"
      :checkedList="checkedList"
      :partCheckedList="partCheckedList"
      @select="select"
    />
    {{ partCheckedList }}
  </div>
</template>

<script>
import Tree from './components/Tree.vue'
import { getTree, getChildIds, getSelectTree } from './utils/utils'
import treeData from './mock/tree'
import carsData from './mock/cars'

// console.timeEnd('tree')

// console.log(getTree(treeData.data, carsData.data))

const list = Object.freeze(getTree(treeData.data, carsData.data))

console.log(list)

export default {
  name: 'App',
  components: {
    Tree,
  },
  data() {
    return {
      list,
      showList: [],
      checkedList: [],
      partCheckedList: [], // 部分选中
    }
  },
  methods: {
    select(result, item) {
      const { list, partCheckedList } = this
      const { parentIds } = item
      const [res, part] = getSelectTree(
        list,
        result,
        parentIds,
        partCheckedList
      )
      this.checkedList = res
      this.partCheckedList = part
    },
  },
  computed: {
    checkedNode() {
      const { list, checkedList } = this
      return []
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
