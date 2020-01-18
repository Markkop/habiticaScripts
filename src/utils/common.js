/**
 * Logs a message and objects passed as arguments
 */
export function logs() {
    const [message, ...details] = [...arguments]
    const warning = details.reduce((parsedObject, object) => ({ ...parsedObject, ...object }), {})
    console.warn({ message, ...warning })
}

/**
 * Wait for the existance of a value
 * @param { function } getValueFunction function that returns the value
 * @param { number } time wait time before trying again
 * @param { number } maxTries max tries before stop waiting
 * @returns { Promise }
 */
export function waitForExistance(getValueFunction, time = 200, maxTries = 10) {
    return new Promise((resolve, reject) => {
        let tries = 0
        let interval = setInterval(() => {
            const value = getValueFunction()
            if (!value) {
                tries += 1
                return
            }

            if (tries >= maxTries) {
                logs(`No value was found after ${tries} tries`, { getValueFunction })
                clearInterval(interval)
                return reject(null)
            }

            clearInterval(interval)
            return resolve(value)
        }, time)
    })
}

/**
 * Set user and api tokens by getting them from settings page
 */
export async function checkAndSetTokens(settings) {
    if (settings.debugMode) return settings.tokens

    let [user, api] = getCookies('hbt-user', 'hbt-api')
    if (user && api) {
        return {
            user: atob(user),
            api: atob(api),
        }
    }

    await clickOnSelector("[href='/user/settings/site']")
    await clickOnSelector("[href='/user/settings/api']")
    await clickOnSelector('.section .btn')

    const [userElement, apiElement] = document.querySelectorAll('.prettyprint')
    user = userElement && userElement.innerText
    api = apiElement && apiElement.innerText

    document.cookie = `hbt-user=${btoa(user)}`
    document.cookie = `hbt-api=${btoa(api)}`
    await clickOnSelector("[href='/']")

    return {
        user,
        api,
    }
}

/**
 * Click on an element found by document.querySelector(string)
 * @param { string } selector
 */
export async function clickOnSelector(selector) {
    const element = await waitForExistance(() => document.querySelector(selector), 100)
    element && element.click()
}

/**
 * Get cookies values
 * @param  {...string} keys cookie keys
 * @returns { string[] } cookie values
 */
export function getCookies(...keys) {
    const cookies = document.cookie.split(';')
    return keys.map(key => {
        const cookieMatched = cookies.find(cookie => cookie.includes(key))
        return cookieMatched && cookieMatched.split('=')[1]
    })
}
