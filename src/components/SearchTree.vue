<template>
  <div>
    <p>
      <van-field
        v-model="key"
        @input="changeKey"
        placeholder="请输入搜索车牌号或点部"
      />
    </p>
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
import Tree from './Tree.vue'
import { getTree, getNodeList } from '../utils/utils'

export default {
  name: 'App',
  components: {
    Tree,
  },
  props: {
    list: {
      type: Array,
    },
    checkedList: {
      type: Array,
    },
  },
  data() {
    return {
      showList: [],
      checkedNodeList: [],
      partCheckedNodeList: [], // 部分选中
      key: '',
    }
  },
  methods: {
    select(result, item) {
      const { list } = this
      this.$emit('update:checkedList', result)
      this.$nextTick(() => {
        this.updateNode(item)
      })
    },
    changeKey(v) {
      console.log(v)
    },
    updateNode(item) {
      const {
        list,
        checkedList,
        checkedNodeList: originCheckedNodeList,
        partCheckedNodeList: originPartCheckedNodeList,
      } = this
      const { parentIds } = item
      const {
        partCheckedNodeList,
        checkedNodeList,
        noCheckedNodeList,
      } = getNodeList(
        parentIds.length === 0 ? item : list.find((l) => l.id === parentIds[0]),
        checkedList
      )
      const changeNode = [
        ...partCheckedNodeList,
        ...checkedNodeList,
        ...noCheckedNodeList,
      ]

      this.partCheckedNodeList = [
        ...originPartCheckedNodeList.filter((p) => !changeNode.includes(p)),
        ...partCheckedNodeList,
      ]
      this.checkedNodeList = [
        ...originCheckedNodeList.filter((p) => !changeNode.includes(p)),
        ...checkedNodeList,
      ]
    },
  },
}
</script>

<style>
</style>
