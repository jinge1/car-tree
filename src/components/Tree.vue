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
          @click="changeCheckedList(item, checkedList.includes(item.id))"
        />

        <van-icon
          v-if="
            item.nodeType === 'tree' &&
            isShowIcon(item) &&
            partCheckedNodeList.includes(item.id)
          "
          name="stop-circle-o"
          @click="changeCheckedList(item)"
        />
        <van-icon
          v-if="
            item.nodeType === 'tree' &&
            isShowIcon(item) &&
            checkedNodeList.includes(item.id)
          "
          name="passed"
          @click="changeCheckedList(item, true)"
        />
        <van-icon
          v-if="
            item.nodeType === 'tree' &&
            isShowIcon(item) &&
            ![...checkedNodeList, ...partCheckedNodeList].includes(item.id)
          "
          name="circle"
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
        :checkedNodeList="checkedNodeList"
        :partCheckedNodeList="partCheckedNodeList"
        :isShowMore="isShowMore"
        :limit="limit"
        v-on="$listeners"
      ></Tree>
    </li>
  </ul>
</template>
<script>
import { getChildIds, getCarIds, unique } from '../utils/utils'
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
    // 是否支持同时展开多个
    isShowMore: {
      type: Boolean,
      default: true,
    },
    // 最多支持选中个数
    limit: {
      type: Number,
      default: 0,
    },
    checkedNodeList: {
      type: Array,
      default: () => [],
    },
    partCheckedNodeList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    /**
     * 选择与取消选择结点(不包括父节点全选非全选的逻辑)
     */
    changeCheckedList(item, isCancel = false) {
      const { checkedList } = this
      const { id, parentId, nodeType, children } = item
      const childIds = isCancel ? getCarIds(item) : getCarIds(item, 5)
      // const childIds = getCarIds(item)
      const result = isCancel
        ? checkedList.filter((c) => !childIds.includes(c))
        : unique([...checkedList, ...childIds])
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
    isShowIcon(item) {
      return (
        item.parentIds.length > 1 ||
        item.children.every((child) => !Array.isArray(child.children))
      )
    },
  },
}
</script>
<style scoped lang="less">
.tree {
  text-align: left;
  user-select: none;
  & > li {
    margin-left: 18px;
  }
}
</style>