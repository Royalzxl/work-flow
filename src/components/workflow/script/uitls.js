import { ConditionDept, ConditionValue, ConditionRange, ConditionMulti } from './createRule'

/**
 *  @description 初始化数据，改变数据格式 用于生成流程节点
 *  @param {Array} list 用于遍历生成节点的数组
 *  @param {Object} node 外部传入的数据对象
 */
export const IteratorData = (list, node) => {
    let Arr = []
    Arr.push(node)
    while (Arr.length > 0) {
        let temp = Arr.pop()
        list.push(temp)
        if (temp.childNode != null || temp.childNode != undefined) {
            Arr.push(temp.childNode)
        }
    }
}

/**
 *  @description 新增节点
 *  @param {Array} list 节点数据列表 用于渲染
 *  @param {Object} newNode 当前节点
 *  @param {Object} node 顶层父级节点数据
 */
export const AddNewNode = (newNode, node, list) => {
    // 把数据添加到渲染列表中
    AddList(newNode, list)
    // 把数据添加到node下的子节点中，用于传到后台
    InsertParent(newNode, node)
}

/**
 *  @description 新增节点数据 用于渲染
 *  @param {Object} node 当前节点数据
 *  @param {Array} list 节点数据列表 用于渲染
 */
export const AddList = (node, list) => {
    // 获取位置
    let position = FindPosition(node.prevId, list)
    if(position !== null) {
        // 在list相应位置 新增一个节点数据
        list.splice(position + 1, 0, node)
    }
}

/**
 *  @description 找到当前节点的前一个节点的位置
 *  @param {String} id  当要查询节点的id
 *  @param {Array} list 节点数据列表 用于渲染
 */
export const FindPosition = (id, list) => {
    let position = null
    // 获取位置
    list.some((element,index) => {
        if(element.nodeId == id) {
            position = index
            return true
        }
    })
    // 返回位置
    return position
}

/**
 *  @description 把当前节点数据添加到节点树node中，便于传到后台
 *  @param {Object} node 节点树
 *  @param {Object} newNode 当前节点
 */
export const InsertParent = (newNode, node) => {
    // 查找到当前节点的父节点，添加数据
    if(node.nodeId == newNode.prevId) {
        // 数据转换
        if(node.childNode != null) {
            node.childNode.prevId = newNode.nodeId
        }
        newNode.childNode = node.childNode
        node.childNode = newNode
        return
    }
    if(node.childNode != null) {
        // 递归
        return InsertParent(newNode, node.childNode)
    }
}

/**
 *  @description 移除当前节点
 *  @param {Object} delNode 要移除的节点
 *  @param {Object} node 节点树
 *  @param {Array} list 渲染列表
 */
export const RemoveNode = (delNode, node, list) => {
    // 移除渲染列表里面的数据
    RemoveNodeInList(delNode.nodeId, list)
    // 移除节点树node里面的数据
    RemoveNodeInNode(delNode, node)
}

/**
 *  @description 移除列表里面的数据
 *  @param {String} id 要移除的节点
 *  @param {Array} list 渲染列表
 */
export const RemoveNodeInList = (id, list) => {
    let position = FindPosition(id, list)
    if(position != null) {
        list.splice(position, 1)
    }
}

/**
 *  @description 移除节点树node 里面的数据
 *  @param {Object} delNode 要移除的节点
 *  @param {Object} node 节点树
 */
export const RemoveNodeInNode = (delNode, node) => {
    // 查找到当前节点的父节点，移除数据
    if(node.nodeId == delNode.prevId) {
        if(delNode.childNode != null) {
            // 把要移除节点的子节点层级往上提
            delNode.childNode.prevId = node.nodeId
            // 把自己的子节点 赋值给自己
            delNode = delNode.childNode
        } else {
            delNode = null
        }
        // 把剩下的子节点挂载到父节节点上
        node.childNode = delNode
        return
    }
    // 递归查询
    if(node.childNode != null) {
        RemoveNodeInNode(delNode, node.childNode)
    }
}

/**
 *  @description 移除条件分支
 *  @param {Object} conditionNode 当前移除的分支节点
 *  @param {Object} node 父级节点
 *  @param {Object} data 整个数据顶级节点
 *  @param {Array} list 外层渲染列表
 *  @param {Object} conditionsList 特殊处理控制表单数据
 */
export const RemoveConditionNode = (conditionNode, node, data, list, conditionsList) => {
    // 移除条件分支
    let position = FindPosition(conditionNode.nodeId, node.conditionNodes)
    if(position != null) {
        node.conditionNodes.splice(position, 1)
        // 删除顶级条件列表 用于控制表单删除
        delete conditionsList[conditionNode.nodeId]
    }

    // 只剩下一个条件分支
    if(node.conditionNodes.length == 1) {
        // 删除顶级条件列表 用于控制表单删除
        delete conditionsList[node.conditionNodes[0].nodeId]
        // 处理节点树data
        ChangeNodePosition(node.conditionNodes[0].childNode, node, data, list)
    }
}

/**
 *  @description 条件分支只剩下一个时，移除整个条件分支，把剩下的条件分支下面的子节点层级向上提升2层
 *  @param {object} conditionNode 剩下的一个分支节点子节点
 *  @param {Object} node 分支节点的父节节点
 *  @param {Object} data 整个数据顶级节点
 *  @param {Array} list 外层渲染列表
 */
export const ChangeNodePosition = (conditionNode, node, data, list) => {
    let position = FindPosition(node.nodeId, list)
    if(data.nodeId == node.prevId) {
        if(conditionNode != null || conditionNode != undefined) {
            conditionNode.prevId = data.nodeId
            // 处理渲染列表
            if(position != null) {
                let tempArr = []
                IteratorData(tempArr, conditionNode)
                if(tempArr.length > 0){
                    tempArr.forEach((element, index) => {
                        if(index == 0) list.splice(position+index, 1, element)
                        else list.splice(position+index, 0, element)
                    })
                }
            }
            // 处理条件分支下面条件节点里面子节点存在的情况下，把条件分支下子节点数据提到条件分支节点位置
            if(node.childNode && node.childNode != {}) {
                AddEndNode(conditionNode, node.childNode)
                conditionNode.prevId = data.nodeId
                data.childNode = conditionNode
            } else {
                data.childNode = conditionNode
            }
        }
        if(conditionNode == null || conditionNode == undefined){
            // 处理渲染列表
            if(position != null) {
                list.splice(position, 1)
            }
            // 处理条件分支下面条件节点里面子节点存在的情况下，把条件分支下子节点数据提到条件分支节点位置
            if(node.childNode && node.childNode != {}) {
                node.childNode.prevId = data.nodeId
                data.childNode = node.childNode
            } else {
                data.childNode = conditionNode
            }
        }
        return
    }

    // 分别判断 递归查询node节点的父节点
    if(data.type == 'route') {
        data.conditionNodes.forEach(element => {
            if(element.childNode != null) ChangeNodePosition(conditionNode, node, element, list)
        });
        data.childNode && ChangeNodePosition(conditionNode, node, data.childNode, list)
    } else {
        if(data.childNode != null) ChangeNodePosition(conditionNode, node, data.childNode, list)
    }
}

/**
 *  @description 条件分支只剩下一个时，移除整个条件分支，把分支的子节点加入条件下面的子节点
 *  @param {object} nodeList 剩下的一个条件节点下的子节点
 *  @param {Object} endNode 分支的子节点
 */
export const AddEndNode = (nodeList, endNode) => {
    if(!nodeList.childNode) {
        endNode.prevId = nodeList.nodeId
        nodeList.childNode = endNode
    } else AddEndNode(nodeList.childNode, endNode)
}


// 深度拷贝
export const ObjDeepCopy = (source) => {
    let sourceCopy = source instanceof Array ? [] : {};
    if(!source) sourceCopy = source
    for (let item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? ObjDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}

// 生成条件规则
// 用于condition-rule.vue
export const CreateRule = (data) => {
    let Object_Rule = null
    if(data.type == 'Radio') 
        Object_Rule = new ConditionValue(data.type, data.id, data.name, data.options)
    if(data.type == 'start') 
        Object_Rule = new ConditionDept(data.type, data.id, data.name)
    if(data.type == 'Checkbox') 
        Object_Rule = new ConditionMulti(data.type, data.id, data.name, data.options)
    if(data.type == 'DateRange' || data.type == 'Number' || data.type == 'CFormula' || data.type == 'Amount') 
        Object_Rule = new ConditionRange(data.type, data.id, data.name)
    
    return Object_Rule
}

// 特殊处理取消选中后的数据
// 用于set-peopel-modal.vue
// type 1为树形 2为选择列表 3为条件生成时触发
export const MinusCheck = (data, type, list) => {
    // 特殊处理取消选中时数据
    let	treeData = list.filter(el => el.children || el.children === null),
        selectData = list.filter(el => el.name),
        checkData = type == 1 ? treeData : type == 2 ? selectData : list,
        noRepeat = [],
        indexArr = []
    if(data.length < checkData.length) {
        noRepeat = (type != 1 && type != 2) ? checkData.filter(el => data.every(element => el.createdId != element.createdId)) : checkData.filter(el => data.every(element => el.id != element.id && el.type === element.type))
        // 获取取消的数据在总数据里面的index
        noRepeat.forEach(element => {
            list.some((el, index) => {
                if(type == 1 || type == 2) {
                    if(type == 1) {
                        if(element.id == el.id && (el.children || el.children === null))
                            indexArr.push(index)
                    } else {
                        if(element.id == el.id && el.name)
                            indexArr.push(index)
                    }
                } else {
                    if(element.createdId == el.createdId)
                        indexArr.push(index)
                }
            })
        })
        
        // 移除这些数据
        // splice 改变原数组
        indexArr.forEach((el, index) => {
            list.splice(el - index, 1)
        })
    }
}