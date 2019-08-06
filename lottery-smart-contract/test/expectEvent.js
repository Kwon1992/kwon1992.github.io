const assert = require('chai').assert; // chai 사용

const inLogs = async (logs, eventName) => {
    const event = logs.find(e => e.event === eventName);
    assert.exists(event);
}

module.exports = {
    inLogs
}
// inLogs를 export 하겠다.

