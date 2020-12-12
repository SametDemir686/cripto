function getPosition1() {
    let values = SpreadsheetApp.getActiveSheet().getRange("Trade!B29:L29").getValues()[0];
    return undefined;
}

function getPosition2() {
    let values = SpreadsheetApp.getActiveSheet().getRange("Trade!B30:L30").getValues()[0];

    let callRange = values[0];
    let putRange = values[1];
    let callInstrumentName = values[2];
    let putInstrumentName = values[3];
    let callOptionPrice = values[4];
    let putOptionPrice = values[5];
    let totalFundsInvested = values[6];
    let initialMarginCall = values[7];
    let initialMarginPut = values[8];
    let indexBtcDeribit = values[9];

    return undefined;
}

function calculateCurrentPnlTotals() {
    let position1 = getPosition1();
    let position2 = getPosition2();
    return undefined;
}

function closePositionAuto() {
    let indexPrice = pullIndexPriceDeribit();
    let totalPnls = calculateCurrentPnlTotals();
    if (indexPrice > totalPnls) {

    }
}