function closePositionAuto() {
    let indexPrice = pullIndexPriceDeribit();
    let totalPnls = calculateCurrentPnlTotals(indexPrice);
    if (totalPnls <= -10) {
        sendTextToTelegramWithNotification(chats.runWithTelegram, "Danger is coming!! We are closing the position");
        closePosition();
        sendTextToTelegramWithNotification(chats.runWithTelegram, "Position is closed! You are safe now");
        updatePositionsAndSendToTelegram(chats.runWithTelegram);
    }
}

function getDate(instrumentName) {
    return instrumentName.split('-')[1];
}

function sendMaxLossToTelegram() {
    let position1 = getPosition1();
    let intersections = getExitIntersections(position1.indexBtcDeribit, position1.callRange, position1.callStrike, position1.callOptionPrice, position1.putRange, position1.putStrike, position1.putOptionPrice, -10);
    for (let intersection of intersections) {
        let exitPrice = intersection.x;
        let maxLoss = calcPnlTotalFuture(exitPrice, position1, 0);
        sendTextToTelegramWithoutNotification(chats.runWithTelegram, 'Max Loss: ' + maxLoss);
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
    return getPnlTotal(indexPrice, position1);
}

function getPnlTotal(indexPrice, p2) {
    return calculatePnlTotal(indexPrice, p2.indexBtcDeribit, 0, p2.putRange, p2.putStrike, p2.putOptionPrice, p2.callRange, p2.callStrike, p2.callOptionPrice, 0, 0, 0, 0);
}

function getPosition1() {
    let values = SpreadsheetApp.getActiveSheet().getRange("Trade!B29:L29").getValues()[0];
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
