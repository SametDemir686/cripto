function closePositionAuto() {
    let indexPrice = pullIndexPriceDeribit();
    let totalPnls = calculateCurrentPnlTotals(indexPrice);
    if (totalPnls <= -10) {
        closePosition();
        sendTextToTelegramWithNotification(chats.stopLossAlert, "Danger is coming!! We are closing the position\nPosition is closed! You are safe now :)");
        updatePositionsAndSendToTelegram(chats.stopLossAlert);
    }
}

function createT() {
    createTrigger('closePositionAuto');
}

function createTrigger(funcName) {
    ScriptApp.newTrigger(funcName)
        .timeBased()
        .everyMinutes(1)
        .create();
}

function deleteTrigger(funcName) {
    var allTriggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < allTriggers.length; i++) {
        if (allTriggers[i].getHandlerFunction() === funcName) {
            ScriptApp.deleteTrigger(allTriggers[i]);
            break;
        }
    }
}

function calculateCurrentPnlTotals(indexPrice) {
    let position1 = getPosition1();
    let pnlTotal = getPnlTotal(indexPrice, position1);
    let position2 = getPosition2();
    let pnlTotal1 = getPnlTotal(indexPrice, position2);
    return pnlTotal + pnlTotal1;
}

function getPnlTotal(indexPrice, p2) {
    let calculatePnlTotal1 = calculatePnlTotal(indexPrice, p2.indexBtcDeribit, 0, p2.putRange, p2.putStrike, p2.putOptionPrice, p2.callRange, p2.callStrike, p2.callOptionPrice, 0, 0, 0, 0);
    return calculatePnlTotal1;
}

function getPosition1() {
    let values = SpreadsheetApp.getActiveSheet().getRange("Trade!B29:L29").getValues()[0];
    return getValues(values);
}

function getPosition2() {
    let values = SpreadsheetApp.getActiveSheet().getRange("Trade!B30:L30").getValues()[0];
    return getValues(values);
}

function getValues(values) {
    return {
        callRange: values[0],
        putRange: values[1],
        callInstrumentName: values[2],
        putInstrumentName: values[3],
        putStrike: getStrike(values[3]),
        callOptionPrice: values[4],
        callStrike: getStrike(values[2]),
        putOptionPrice: values[5],
        totalFundsInvested: values[6],
        initialMarginCall: values[7],
        initialMarginPut: values[8],
        indexBtcDeribit: values[9]
    };
}

function getStrike(instrumentName) {
    return parseInt(instrumentName.split('-')[2]);
}
