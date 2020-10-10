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
 * @param {Array} tree 组织树源一位数组
 * @param {Array} cars 车辆信息列表
 * @param {string} parentId 父节点id
 * @param {Array} parentIds 父节点数组信息
 */
export function getTree(tree, cars = [], parentId = '-11', parentIds = []) {
  return tree
    .filter((f) => f.p === parentId)
    .map((item) => {
      const nodeInfo = changeNodeInfo(item, treeKeys, {
        parentIds,
        nodeType: 'tree',
      })
      const arr = cars
        .filter((c) => c.r === nodeInfo.id)
        .map((c) =>
          changeNodeInfo(c, carKeys, {
            parentIds: [...parentIds, nodeInfo.id],
            nodeType: 'car',
          })
        )
      const children =
        item.d === null
          ? arr
          : [
              ...getTree(tree, cars, nodeInfo.id, [...parentIds, nodeInfo.id]),
              ...arr,
            ]
      return { ...nodeInfo, children }
    })
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

/**
 * 通过已选择结点，返回自动更新父节点信息的结果
 * @param {Array} list 树列表
 * @param {Array} result 已选择结果
 * @param {Array} parentIds 当前结点父节点列表
 * @param {Array} partCheckedList 部分选中列表
 */
export function getSelectTree(list, result, parentIds, partCheckedList) {
  let l = [...list]
  // 根结点到目标结点所有直接子节点列表
  const arr = parentIds.map((p) => {
    const { children = [] } = l.find((f) => f.id === p)
    l = [...children]
    return children.map(({ id }) => id)
  })
  const r = [...parentIds].reverse()
  let res = [...result]
  let part = [...partCheckedList]
  // 从修改项的父级向根结点判断全选状态
  arr.reverse().forEach((c, i) => {
    const p = r[i]
    res = res.filter((f) => f !== p)
    part = part.filter((t) => t !== p)

    // 孩子结点每项都为选中状态，则添加父级为选中状态
    if (c.every((s) => res.includes(s))) {
      res = [...res, p]
    }
    // 部分选中逻辑
    if (
      (c.some((s) => res.includes(s)) && !c.every((s) => res.includes(s))) ||
      c.some((s) => part.includes(s))
    ) {
      part = [...part, p]
    }
  })
  return [res, part]
}
