/**
 * Add css styles to the document
 * @param { String } styleSheet
 */
export function setDocumentStyle(styleSheet) {
    const lines = styleSheet.replace(/\;/g, '').match(/(.+)+/g)
    const rules = lines.reduce(parseStyleSheet, [])
    const style = document.createElement('style')
    document.head.appendChild(style)
    rules.forEach(addStyleSheetRule, style)
}

/**
 * Add a new CSS style rule
 * @param { String } rule
 */
export function addStyleSheetRule(rule) {
    this.sheet.insertRule(rule, this.sheet.cssRules.length)
}

/**
 * Parse stylesheet's lines in single css rules
 * @param { String[] } rules
 * @param { String } line
 */
export function parseStyleSheet(rules, line) {
    if (line[0] === '}') {
        return rules
    }

    if (line.includes('{')) {
        return rules.concat(line)
    }

    const previousRule = rules[rules.length - 1]
    const selector = previousRule.split('{')[0]
    if (!previousRule.includes('}')) {
        rules[rules.length - 1] = previousRule + line + '}'
        return rules
    }

    return rules.concat(selector + ' {' + line + '}')
}
