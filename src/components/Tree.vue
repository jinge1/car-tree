<template>
  <ul class="tree">
    <li v-for="item in list" :key="item.id">
      <h2>
        <van-icon
          :name="showList.includes(item.id) ? 'back-top' : 'down'"
          @click="changeShowList(item)"
          v-if="item.nodeType === 'tree'"
        />
        <van-icon
          v-if="item.nodeType === 'car'"
          :name="checkedList.includes(item.id) ? 'passed' : 'circle'"
          @click="changeCheckedList(item)"
        />
        <van-icon
          v-if="
            item.nodeType === 'tree' &&
            (item.parentIds.length > 1 ||
              item.children.every((child) => !Array.isArray(child.children))) &&
            partCheckedList.includes(item.id)
          "
          name="stop-circle-o"
          @click="changeCheckedList(item)"
        />
        <van-icon
          v-if="
            item.nodeType === 'tree' &&
            (item.parentIds.length > 1 ||
              item.children.every((child) => !Array.isArray(child.children))) &&
            !partCheckedList.includes(item.id)
          "
          :name="checkedList.includes(item.id) ? 'passed' : 'circle'"
          @click="changeCheckedList(item)"
        />

        <span>{{ item.title }}</span>
        <span v-if="Array.isArray(item.children)"
          >({{ item.d > 0 ? `${item.d}/` : ''
          }}{{ item.c > 0 ? item.c : '' }})</span
        >
      </h2>

      <Tree
        v-if="Array.isArray(item.children) && showList.includes(item.id)"
        :list="item.children"
        :showList="showList"
        :checkedList="checkedList"
        :partCheckedList="partCheckedList"
        :isShowMore="isShowMore"
        v-on="$listeners"
      ></Tree>
    </li>
  </ul>
</template>
<script>
import { getChildIds } from '../utils/utils'
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
    partCheckedList: {
      type: Array,
      default: () => [],
    },
    isShowMore: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
     * 选择与取消选择结点(不包括父节点全选非全选的逻辑)
     */
    changeCheckedList(item) {
      const { checkedList } = this
      const { id, parentId, nodeType, children } = item
      const childIds = getChildIds(item)
      let result = checkedList.includes(id)
        ? checkedList.filter((c) => !childIds.includes(c))
        : [...new Set([...checkedList, ...childIds])]
      this.$emit('select', result, item)
    },
    /**
     * 展开隐藏子集菜单
     */
    changeShowList(item) {
      const { showList, isShowMore } = this
      if (isShowMore) {
        this.$emit(
          'update:showList',
          showList.includes(item.id)
            ? [...showList.filter((s) => s !== item.id)]
            : [...showList, item.id]
        )
      } else {
        this.$emit(
          'update:showList',
          showList.includes(item.id)
            ? [...item.parentIds]
            : [...item.parentIds, item.id]
        )
      }
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