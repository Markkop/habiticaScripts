const getTokens = require('./tokens')

test('returns api' , () => {
    expect(getTokens("api")).toBe("api")
})