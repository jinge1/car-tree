<template>
  <ul class="tree">
    <li v-for="item in list" :key="item.id">
      <h2>
        <van-icon
          :name="showList.includes(item.id) ? 'back-top' : 'down'"
          @click="changeShowList(item)"
          v-if="Array.isArray(item.children)"
        />
        <van-icon name="circle" />
        <!-- <van-icon name="stop-circle-o" />
        <van-icon name="passed" v-if="Array.isArray(item.children)" /> -->
        <span>{{ item.title }}</span>
      </h2>

      <Tree
        v-if="Array.isArray(item.children) && showList.includes(item.id)"
        :list="item.children"
        :showList="showList"
        :checkedList="checkedList"
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
    getIconName(item) {
      const { showList, checkedList } = this
      const { children, id } = item
      if (!Array.isArray(children)) {
        return ''
      }
      return ''
    },
    changeShowList(item) {
      const { showList } = this
      console.log(showList.includes(item.id))
      this.$emit(
        'update:showList',
        showList.includes(item.id)
          ? [...item.parentIds]
          : [...item.parentIds, item.id]
      )
      console.log(this.showList, '909090')
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