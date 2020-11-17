class Base {
    constructor(type, id, title, key) {
        this.createdType = type
        this.createdId = id
        this.paramLabel = title
        this.type = key
        this.paramKey = `${key}_${new Date().getTime()}`
        this.isEmpty = false
    }
}

// 发起人
export class ConditionDept extends Base {
    constructor(type, id, title) {
        super(type, id, title, 'condition_dept')
        this.person = []
    }
}

// 单选设置
export class ConditionValue extends Base {
    constructor(type, id, title, options) {
        super(type, id, title, 'condition_value')
        this.paramValue = ""
        this.paramValues = []
        this.oriValue = options
        this.key = '0'
        this.valid = "valid"
    }
}

// 区间设置
export class ConditionRange extends Base {
    constructor(type, id, title) {
        super(type, id, title, 'condition_range')
        this.value = "0"
        this.valid = "valid"
        this.betweenLower = '0'
        this.valueLower = '1'
        this.betweenUpper = '0'
        this.valueUpper = '1'
        this.key = "0"
    }
}

// 多选设置
export class ConditionMulti extends Base {
    constructor(type, id, title, options) {
        super(type, id, title, 'condition_multi')
        this.paramValue = ""
        this.paramValues = []
        this.oriValue = options
        this.valid = "valid"
        this.key = "0"
        this.matchType = "0"
    }
}