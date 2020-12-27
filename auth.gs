let tokenUrl = getServerAddress() + "/api/v2/public/auth?client_id=" + getClientId() + "&client_secret=" + getClientSecret() + "&grant_type=client_credentials";

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
    },
    runWithTelegram: {
        botSecret: '1439106550:AAGqH87pMb9Fy0i8OZLZOS5Db13vQN3QDww',
        chatId: -1001457406790
    
}
  
  
  
};



function getServerAddress() {
    if (isTestMode()) {
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

function getClientId() {
    let clientIdReal = getDataFrom('Instruments!N2');
    let clientIdTest = getDataFrom('Instruments!N5');
    return isTestMode() ? clientIdTest : clientIdReal;
}

function getClientSecret() {
    let clientSecretReal = getDataFrom('Instruments!Q2');
    let clientSecretTest = getDataFrom('Instruments!Q5');
    return isTestMode() ? clientSecretTest : clientSecretReal;
}