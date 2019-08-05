const getTokens = (type) => {
    switch (type) {
        case "user":
            return "user"
        case "api":
            return "api"
        default:
            return "no type found"
    }
}

module.exports = getTokens