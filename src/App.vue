<template>
  <div id="app">
    <Tree
      :list="list"
      :showList.sync="showList"
      :checkedList.sync="checkedList"
      @refresh="refresh"
    />
    {{ checkedList }}
  </div>
</template>

<script>
import Tree from './components/Tree.vue'
import { madeTree } from './utils/utils'
console.log(madeTree())

export default {
  name: 'App',
  components: {
    Tree,
  },
  data() {
    return {
      list: Object.freeze(madeTree()),
      showList: [],
      checkedList: [],
    }
  },
  methods: {
    refresh(result, item, index = 0) {
      const { list } = this
      const { parentIds, id } = item
      const top =
        Array.isArray(parentIds) && parentIds.length > 0
          ? list.find((l) => l.id === parentIds[0])
          : item
      // console.log(top)
      const { id: topId, children: topChildren } = top
      if (Array.isArray(topChildren) && topChildren.length > 0) {
        console.log('0')
      } else {
        // this.checkedList = result
      }
      this.checkedList = result
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
