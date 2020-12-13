const client_id = getDataFrom('Instruments!N2');
const client_secret = getDataFrom('Instruments!Q2');
let tokenUrl = getServerAddress() + "/api/v2/public/auth?client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=client_credentials";

const chats = {
    tradeEmin: {
        botSecret: '1494148897:AAEo_CfNCCkK3c4tRNbyGG5QmLOGzDfHE74',
        chatId: 1132267979
    },
    alertEmin: {
        botSecret: '1437826636:AAF45R4NfmthPkGWAMeU3DXyhmbRwZB4C8k',
        chatId: 1132267979
    },
    stopLossAlert: {
        botSecret: '1482529145:AAGrXF7fXk00PFZGrA0_KmgZuyFx4o0XAek',
        chatId: 1132267979
    }
};

function getServerAddress() {
    if(isTestMode()) {
        return "https://test.deribit.com";
    } else {
        return "https://www.deribit.com";
    }
}

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