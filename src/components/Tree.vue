<template>
  <ul class="tree">
    <li v-for="item in list" :key="item.id">
      <h2>
        <van-icon
          :name="showList.includes(item.id) ? 'back-top' : 'down'"
          @click="changeShowList(item)"
          v-if="item.nodeType === 'node'"
        />

        <van-icon
          v-if="item.nodeType === 'end'"
          :name="checkedList.includes(item.id) ? 'passed' : 'circle'"
          @click="
            changeCheckedList(item, checkedList.includes(item.id) ? 2 : 1)
          "
        />

        <van-icon
          v-if="
            item.nodeType === 'node' &&
            isShowIcon(item) &&
            partCheckedNodeList.includes(item.id)
          "
          name="stop-circle-o"
          @click="changeCheckedList(item, 3)"
        />
        <van-icon
          v-if="
            item.nodeType === 'node' &&
            isShowIcon(item) &&
            checkedNodeList.includes(item.id)
          "
          name="passed"
          @click="changeCheckedList(item, 2)"
        />
        <van-icon
          v-if="
            item.nodeType === 'node' &&
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
import { getChildIds, getEndIds, unique } from '../utils/utils'
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
      default: 6,
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
     * type 1 选择，2 取消选择，3 部分选择
     */
    changeCheckedList(item, type = 1) {
      const { checkedList, limit } = this
      const { id, parentId, nodeType, children } = item
      // 本次影响到的叶子结点id集合
      const changeIds = getEndIds(item)
      const changeLen = changeIds.length
      // 是否已经选满
      const isFull = limit === checkedList.length

      // 从上次已选择的节点中排除本次影响的节点
      const computedChecked = checkedList.filter((c) => !changeIds.includes(c))

      // 本次改变元素中，最多可选择个数
      const surplus = limit - computedChecked.length

      // 达到上限时提示操作
      const tip = () => console.log(`已选择上限${limit}，无法在选择了！`)

      let result = [...checkedList]

      // 选择处理
      if (type === 1) {
        if (isFull) {
          tip()
          return false
        }
        // 本次添加超出最大范围，只添加部分
        if (changeLen > surplus) {
          tip()
        }
        result = [...checkedList, ...changeIds.slice(0, surplus)]
      }

      // 取消选择处理
      if (type === 2) {
        result = checkedList.filter((c) => !changeIds.includes(c))
      }

      // 部分选择处理
      if (type === 3) {
        // 已达上限，则提示后，取消选择
        if (isFull) {
          tip()
          result = checkedList.filter((c) => !changeIds.includes(c))
        }

        if (limit > checkedList.length) {
          // 选择超过限
          if (changeLen > surplus) {
            tip()
          }
          result = [...computedChecked, ...changeIds.slice(0, surplus)]
        }
      }
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