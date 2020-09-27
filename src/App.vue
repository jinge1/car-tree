<template>
  <div id="app">
    {{showList}}
    <Tree :list="list" :showList.sync="showList" />
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
      list: madeTree(),
      showList: []
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
