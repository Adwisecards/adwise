const getPageFromCount = (count, pageSize) => {
    return Math.ceil(count / pageSize)
}

export {
    getPageFromCount
}
