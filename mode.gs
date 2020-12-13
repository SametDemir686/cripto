function getMode() {
    return getDataFrom('K2');
}

function isTestMode() {
    return getMode() === "Test";
}

function isSafeMode() {
    return getMode() === "Safe";
}

function isRealMode() {
    return getMode() === "Real";
}

function getServerAddress() {
    if(isTestMode()) {
        return "https://test.deribit.com";
    } else {
        return "https://www.deribit.com";
    }
}