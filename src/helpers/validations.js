
export const validateLength = (input, size) => {
    if (input.length === size) {
        return true
    }
    return false
}

export const validateIntField = (input) => {
    const expression = new RegExp(/^\d+$/)
    return expression.test(input)
}

export const validateLessLength = (input, size) => {
    if (input.length <= size) {
        return true
    }
    return false
}

export const validateRepited = (listToVerify, attrNAme, value) => {
    if (listToVerify.filter(item => item[attrNAme] === value).length > 0) {
        return true
    }
    return false
}
