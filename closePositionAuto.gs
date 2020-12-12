function closePositionAuto() {
    writeDataTo(undefined);
    let indexPrice = pullIndexPriceDeribit();
    let totalPnls = calculateCurrentPnlTotals(indexPrice);
    if (totalPnls <= -10) {
        sendTextToTelegramWithNotification(chats.stopLossAlert, "Danger is coming!! Do you want to close your position?");
        Utilities.sleep(60000);
        if(!isLastMessage(chats.stopLossAlert, "No")) {
            closePosition();
        }
    }
}

function calculateCurrentPnlTotals(indexPrice) {
    return getPnlTotal(indexPrice, getPosition1())
        + getPnlTotal(indexPrice, getPosition2());
}

function getPnlTotal(indexPrice, p2) {
    return calculatePnlTotal(indexPrice, p2.indexBtcDeribit, 0, p2.putRange, p2.putStrike, p2.putOptionPrice, p2.callRange, p2.callStrike, p2.callOptionPrice, 0, 0, 0, 0);
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
        callStrike: getStrike(values[4]),
        putOptionPrice: values[5],
        totalFundsInvested: values[6],
        initialMarginCall: values[7],
        initialMarginPut: values[8],
        indexBtcDeribit: values[9]
    };
}

function getStrike(instrumentName) {
    return instrumentName.split('-')[2];
}
