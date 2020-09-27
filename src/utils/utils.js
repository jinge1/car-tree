/**
 * 生成最小值min到最大值max范围的随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 */
export function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 生成指定深度组织树
 * @param {number} maxDeep 最大深度
 * @param {number} currentDeep 当前深度
 * @param {parentId} parentId 父节点id
 */
export function madeTree(maxDeep = 3, currentDeep = 0, parentIds = []) {
  // 每一级孩子节点数量
  const childrenNum = [...Array(randomNum(2, 3)).keys()]
  return childrenNum.map((n) => {
    const id = n < 10 ? `0${n}` : `${n}`
    const childrenInfo =
      currentDeep < maxDeep
        ? { children: madeTree(maxDeep, currentDeep + 1, [...parentIds, `${parentIds.join('')}${id}`])}
        : {}
    return {
      title: `title-${parentIds.join('')}${id}`,
      id: `${parentIds.join('')}${id}`,
      parentIds,
      ...childrenInfo,
    }
  })
}
