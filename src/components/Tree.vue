<template>
  <ul class="tree">
    <li v-for="item in list" :key="item.id">
      <h2>
        <van-icon
          :name="showList.includes(item.id) ? 'back-top' : 'down'"
          @click="changeShowList(item)"
          v-if="Array.isArray(item.children)"
        />
        <van-icon
          v-if="Array.isArray(item.children)"
          @click="changeCheckedList(item)"
          :name="
            item.children.filter((f) => checkedList.includes(f.id)) ===
            item.children.length
              ? 'passed'
              : item.children.some((s) => !checkedList.includes(s.id))
              ? 'stop-circle-o'
              : 'circle'
          "
        />
        <van-icon
          v-if="!Array.isArray(item.children)"
          @click="changeCheckedList(item)"
          :name="checkedList.includes(item.id) ? 'passed' : 'circle'"
        />
        <span>{{ item.title }}</span>
      </h2>

      <Tree
        v-if="Array.isArray(item.children) && showList.includes(item.id)"
        :list="item.children"
        :showList="showList"
        :checkedList="checkedList"
        v-on="$listeners"
      ></Tree>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'Tree',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    showList: {
      type: Array,
      default: () => [],
    },
    checkedList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    // getIconName(item) {
    //   const { showList, checkedList } = this
    //   const { children, id } = item
    //   if (!Array.isArray(children)) {
    //     return ''
    //   }
    //   return ''
    // },
    changeShowList(item) {
      const { showList } = this
      this.$emit(
        'update:showList',
        showList.includes(item.id)
          ? [...item.parentIds]
          : [...item.parentIds, item.id]
      )
    },
    changeCheckedList(item) {
      const { checkedList } = this
      const { id } = item
      const childIds = this.getChildIds(item)
      let result = checkedList.includes(item.id)
        ? checkedList.filter((c) => childIds.includes(c))
        : [...new Set([...checkedList, ...childIds])]
      // this.$emit('update:checkedList', this.getCheckedList(result, item))
      this.$emit('refresh', result, item)
    },
    // getCheckedList(result, item) {
    //   // const {list} = this
    //   this.$emit('refresh', result, item)
    //   // console.log(item, list)
    //   // const top = parentIds
    // },
    // 获取某个节点下的所有子节点列表
    getChildIds(item) {
      const { children, id } = item
      let result = []
      result.push(id)
      if (Array.isArray(children)) {
        children.forEach((child) => {
          result = result.concat(this.getChildIds(child))
        })
      }
      return result
    },
  },
}
</script>
<style scoped lang="less">
.tree {
  text-align: left;
  & > li {
    margin-left: 18px;
  }
}
</style>