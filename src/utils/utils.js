// 组织树key转换映射表
const treeKeys = {
  title: 'n',
  id: 'i',
  parentId: 'p',
}

// 车辆信息key转换映射表
const carKeys = {
  title: 'p',
  id: 'i',
  parentId: 'r',
}

/**
 * 结点信息key转换
 * @param {object} item 当前结点信息
 * @param {object} keys 需转换的映射关系
 * @param {object} other 其他信息
 */
function changeNodeInfo(item, keys, other = {}) {
  return {
    ...item,
    ...other,
    ...Object.keys(keys).reduce((pre, curr) => {
      pre[curr] = item[keys[curr]]
      return pre
    }, {}),
  }
}

/**
 * 转换数组为组织树
 * @param {Array} tree 组织树源一维数组
 * @param {Array} cars 车辆信息列表
 * @param {string} parentId 父节点id
 * @param {Array} parentIds 父节点数组信息
 */
export function getTree(tree, cars = [], parentId = '-11', parentIds = []) {
  return tree
    .filter((t) => t.p === parentId)
    .map((t) => {
      // 节点信息转换
      const nodeInfo = changeNodeInfo(t, treeKeys, {
        parentIds,
        nodeType: 'node',
      })
      // 节点下车辆信息(节点下既可以有车辆，也可以有子节点)
      const nodeCars = cars
        .filter((c) => c.r === nodeInfo.id)
        .map((c) =>
          changeNodeInfo(c, carKeys, {
            parentIds: [...parentIds, nodeInfo.id],
            nodeType: 'end',
          })
        )
      // 节点孩子节点信息(节点下既可以有车辆，也可以有子节点)
      const children =
        t.d === null
          ? nodeCars
          : [
              ...getTree(
                tree.filter((f) => f.p !== parentId),
                cars.filter((c) => c.r !== nodeInfo.id),
                nodeInfo.id,
                [...parentIds, nodeInfo.id]
              ),
              ...nodeCars,
            ]

      return children.length > 0 ? { ...nodeInfo, children } : nodeInfo
    })
}

/**
 * 返回某个节点下所有叶子节点id数组
 * @param {object} item 节点信息
 */
export function getEndIds(item) {
  const { children, id, nodeType } = item
  const isLimit = typeof num === 'number'
  let result = nodeType === 'end' ? [id] : []
  if (Array.isArray(children)) {
    for (let child of children) {
      result = [...result, ...getEndIds(child)]
    }
  }
  return result
}

/**
 * 获取指定结点下，结点全选，部分选中状态列表
 * @param {object} node 改变项对应根结点
 * @param {Array} checkedList 已选择叶子结点列表
 */
export function getNodeList(node, checkedList) {
  // 部分选中列表
  let partCheckedNodeList = []
  // 全选列表
  let checkedNodeList = []
  // 未选中列表
  let noCheckedNodeList = []
  // 子节点队列
  let nodeQueue = getNodeQueue(node)
  while (nodeQueue.length > 0) {
    let checkedIds = [...checkedNodeList, ...checkedList]
    nodeQueue.shift().forEach((q) => {
      const { children } = q
      const len = children.length
      const checkedLen = children.filter((c) => checkedIds.includes(c.id))
        .length
      let isUse = false

      // 当前结点为全选
      if (checkedLen === len) {
        isUse = true
        checkedNodeList = unique([...checkedNodeList, q.id])
      }
      // 当前结点为部分选择
      if (
        children.some((s) => partCheckedNodeList.includes(s.id)) ||
        (checkedLen > 0 && checkedLen < len)
      ) {
        isUse = true
        partCheckedNodeList = unique([...partCheckedNodeList, q.id])
      }
      if (!isUse) {
        noCheckedNodeList = unique([...noCheckedNodeList, q.id])
      }
    })
  }
  return {
    partCheckedNodeList,
    checkedNodeList,
    noCheckedNodeList,
  }
}

/**
 * 数组去重
 * @param {Array} arr
 */
export function unique(arr = []) {
  return [...new Set(arr)]
}

/**
 * 获取某个节点下的所有节点队列，叶子节点在前
 * @param {object} node
 */
export function getNodeQueue(node, isInit = true) {
  const { children } = node
  let arr = []
  const nodeChildren = children.filter((c) => Array.isArray(c.children))
  nodeChildren.forEach((child) => {
    arr = [...arr, ...getNodeQueue(child, false)]
  })
  if (nodeChildren.length > 0) {
    arr = [...arr, nodeChildren]
  }
  if (isInit) {
    arr.push([node])
  }
  return arr
}

/**
 * 找出某个结点下的所有子结点，包括本身，若无子节点，则为本身
 */
export function getChildIds(item) {
  const { children, id } = item
  let result = []
  result.push(id)
  if (Array.isArray(children)) {
    children.forEach((child) => {
      result = result.concat(getChildIds(child))
    })
  }
  return result
}
