function pnlPut(exitPrice, putNo, putStrike, putAsk) {
    if (exitPrice - putStrike >= 0) {
        return -putAsk * putNo;
    } else {
        return putStrike * putNo - exitPrice * putNo - putAsk * putNo;
    }
}

function pnlCall(exitPrice, callNo, callStrike, callAsk) {
    if (exitPrice - callStrike >= 0) {
        return exitPrice * callNo - callStrike * callNo - callAsk * callNo;
    } else {
        return -callAsk * callNo;
    }
}

function pnlMove(exitPrice, moveNo, movePrice, moveStrikePrice) {
    return moveNo * (movePrice - Math.abs(moveStrikePrice - exitPrice));
}

function pnlFuture(exitPrice, totalCapital, leverage, entry) {
    return (exitPrice - entry) * (totalCapital * leverage / entry);
}

function calculateExpiresIn(timeDelay_HourBased) {
    let now = new Date();
    let then = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0, 0, 0);
    let diffSinceMidNight = now.getTime() - then.getTime();

    let noOfMillisecondsInSec = 1000;
    let noOfMillisecondsInMin = noOfMillisecondsInSec * 60;
    let noOfMillisecondsInHour = noOfMillisecondsInMin * 60;
    let noOfMillisecondsInADay = noOfMillisecondsInHour * 24;
    let timeFromMidNightToNextday11am = noOfMillisecondsInADay + 11 * noOfMillisecondsInHour;
    let timeDelayInMilliseconds = timeDelay_HourBased * noOfMillisecondsInHour;
    return (timeFromMidNightToNextday11am - diffSinceMidNight - timeDelayInMilliseconds) / noOfMillisecondsInADay;
}

function writeBestValues(result) {
    writeDataTo(moveNoCell, result.moveNo);
    writeDataTo(callNoCell, result.callNo);
    writeDataTo(putNoCell, result.putNo);
    writeDataTo(totalCapitalCell, result.totalCapital);
    writeDataTo(levarageCell, result.levarage);
    writeDataTo(greenMaxCell, result.greenMax);
    writeDataTo(averageCell, result.average);
    writeDataTo(successCell, result.success);
    writeDataTo(entryCell, result.entry);
    writeDataTo(totalPremiumCell, result.totalPremium);
}

function setBestValues(moveNo, callNo, putNo, totalCapital, levarage, green, average, exitSayisi, entry, putAsk, callAsk, movePrice, callStrike, putStrike) {
    return {
        moveNo: moveNo,
        callNo: callNo,
        putNo: putNo,
        totalCapital: totalCapital,
        levarage: levarage,
        greenMax: green,
        average: average,
        success: "%" + (green / exitSayisi * 100).toFixed(2),
        entry: entry,
        totalPremium: putAsk * putNo + callAsk * callNo + movePrice * moveNo,
        callStrike: callStrike,
        putStrike: putStrike,
        putAsk: putAsk,
        callAsk: callAsk
    };
}

function bestValuesChanged(result, moveNo, callNo, putNo, totalCapital, levarage, green, average, exitSayisi, entry, putAsk, callAsk, movePrice, callStrike, putStrike) {
    result = setBestValues(result, moveNo, callNo, putNo, totalCapital, levarage, green, average, exitSayisi, entry, putAsk, callAsk, movePrice, callStrike, putStrike);
    writeBestValues(result);
    return result;
}

function getBestValues() {
    pullJSON();
    clearTable();
    let totalCapitalStart = getDataFrom(totalCapitalStartCell);
    let totalCapitalEnd = getDataFrom(totalCapitalEndCell);
    let totalCapitalIncrement = getDataFrom(totalCapitalIncrementCell);
    let levarageStart = getDataFrom(levarageStartCell);
    let levarageEnd = getDataFrom(levarageEndCell);
    let levarageIncrement = getDataFrom(levarageIncrementCell);
    let putNoStart = getDataFrom(putNoStartCell);
    let putNoEnd = getDataFrom(putNoEndCell);
    let putNoIncrement = getDataFrom(putNoIncrementCell);
    let callNoStart = getDataFrom(callNoStartCell);
    let callNoEnd = getDataFrom(callNoEndCell);
    let callNoIncrement = getDataFrom(callNoIncrementCell);
    let moveNoStart = getDataFrom(moveNoStartCell);
    let moveNoEnd = getDataFrom(moveNoEndCell);
    let moveNoIncrement = getDataFrom(moveNoIncrementCell);
    let exitStart = getDataFrom(exitStartCell);
    let exitEnd = getDataFrom(exitEndCell);
    let exitIncrement = getDataFrom(exitIncrementCell);
    let timeDelay = getDataFrom(timeDelayCell);
    let entry = getDataFrom(entryCell);
    let movePrice = getDataFrom(movePriceCell);
    let moveStrikePrice = getDataFrom(moveStrikePriceCell);
    let callRT_IV = getDataFrom(callRT_IVCell);
    let interestRate = 0;
    let expiresIn = calculateExpiresIn(timeDelay);

    let result = {
        moveNo: moveNoStart,
        callNo: callNoStart,
        putNo: putNoStart,
        totalCapital: totalCapitalStart,
        levarage: levarageStart,
        greenMax: 0,
        average: 0,
    };
    let exitSayisi = (exitEnd - exitStart) / exitIncrement + 1;
    let threshold = 0;
    let putLastRange = findLastRange(selectedPutInstrumentColumn, selectedPutInstrumentRow);
    let putInstrumentNames = SpreadsheetApp.getActiveSheet().getRange(selectedPutInstrumentColumn+selectedPutInstrumentRow+":"+putLastRange).getValues()[0];
    let callLastRange = findLastRange(selectedCallInstrumentColumn, selectedCallInstrumentRow);
    let callInstrumentNames = SpreadsheetApp.getActiveSheet().getRange(selectedCallInstrumentColumn+selectedCallInstrumentRow+":"+callLastRange).getValues()[0];

    for (let i = 0; i < putInstrumentNames.length; i++) {
        let putInstrumentName = putInstrumentNames[i];
        let putStrike = putInstrumentName.split("-")[2];
        let putAsk = pullAskPriceDeribit(putInstrumentName, entry);
        for (let j = 0; j < callInstrumentNames.length; j++) {
            let callInstrumentName = callInstrumentNames[j];
            let callStrike = callInstrumentName.split("-")[2];
            let callAsk = pullAskPriceDeribit(callInstrumentName, entry);
            for (let moveNo = moveNoStart; moveNo <= moveNoEnd; moveNo += moveNoIncrement) {
                for (let callNo = callNoStart; callNo <= callNoEnd; callNo += callNoIncrement) {
                    for (let putNo = putNoStart; putNo <= putNoEnd; putNo += putNoIncrement) {
                        for (let totalCapital = totalCapitalStart; totalCapital <= totalCapitalEnd; totalCapital += totalCapitalIncrement) {
                            for (let levarage = levarageStart; levarage <= levarageEnd; levarage += levarageIncrement) {
                                let green = 0;
                                let average = 0;
                                for (let exitPrice = entry + exitStart; exitPrice <= entry + exitEnd; exitPrice += exitIncrement) {
                                    let pnlTotal = pnlPut(exitPrice, putNo, putStrike, putAsk) + pnlCall(exitPrice, callNo, callStrike, callAsk) + pnlMove(exitPrice, moveNo, movePrice, moveStrikePrice) + pnlFuture(exitPrice, totalCapital, levarage, entry);
                                    if (pnlTotal > 0) {
                                        green++;
                                        average += pnlTotal / exitSayisi;
                                    }
                                }
                                if (green / exitSayisi >= threshold) {
                                    if (result.greenMax / exitSayisi < threshold || result.average < average) {
                                        result = bestValuesChanged(result, moveNo, callNo, putNo, totalCapital, levarage, green, average, exitSayisi, entry, putAsk, callAsk, movePrice, callStrike, putStrike);
                                    }
                                } else if (result.greenMax < green) {
                                    result = bestValuesChanged(result, moveNo, callNo, putNo, totalCapital, levarage, green, average, exitSayisi, entry, putAsk, callAsk, movePrice, callStrike, putStrike);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    let row = tableRowStartIndex;
    for (let exitPrice = entry + exitStart; exitPrice <= entry + exitEnd; exitPrice += exitIncrement) {
        let calcOptionResult = calculateOption(exitPrice, result.callStrike, expiresIn, interestRate, callRT_IV);
        let pnlPutResult = pnlPut(exitPrice, result.putNo, result.putStrike, result.putAsk);
        let pnlMoveResult = pnlMove(exitPrice, result.moveNo, movePrice, moveStrikePrice);
        let pnlFutureResult = pnlFuture(exitPrice, result.totalCapital, result.levarage, entry);
        let pnlCallResult = pnlCall(exitPrice, result.callNo, result.callStrike, result.callAsk);
        let pnlTotal = pnlPutResult + pnlCallResult + pnlMoveResult + pnlFutureResult;
        let pnlCallFuture = -(result.callAsk - calcOptionResult.callPreFuture) * result.callNo;
        let pnlPutFuture = -(result.putAsk - calcOptionResult.putPreFuture) * result.putNo;
        let pnlTotalFuture = pnlCallFuture + pnlPutFuture + pnlMoveResult;
        insertToTable(row++, entry, exitPrice, pnlTotal, pnlTotalFuture, calcOptionResult.callPreFuture, calcOptionResult.putPreFuture, pnlFutureResult, pnlMoveResult, pnlCallResult, pnlPutResult);
    }
}

function pullAskPriceDeribit(instrumentName, entry) {
    var data = pullDataFrom("https://www.deribit.com/api/v2/public/get_order_book?instrument_name=" + instrumentName);
    return entry * data.result['asks'][0][0];
}

function findLastRange(columnName, startIndex) {
    var spr = SpreadsheetApp.getActiveSpreadsheet();
    var column = spr.getRange(columnName + ':' + columnName);
    var values = column.getValues(); // get all data in one call
    var ct = startIndex - 1;
    while (values[ct] && values[ct][0] !== "") {
        ct++;
    }
    return columnName + ct;
}

function insertToTable(row, entry, exitPrice, pnlTotal, pnlTotalFuture, callPreFuture, putPreFuture, pnlFutureResult, pnlMoveResult, pnlCallResult, pnlPutResult) {
    writeDataTo(tableEntryColumn + row, entry.toFixed(2));
    writeDataTo(tableExitPriceColumn + row, exitPrice.toFixed(2));
    writeDataTo(tablePnlTotalColumn + row, pnlTotal.toFixed(0));
    writeDataTo(tablePnlTotalFutureColumn + row, pnlTotalFuture.toFixed(0));
    writeDataTo(tableCallPreFutureColumn + row, callPreFuture.toFixed(2));
    writeDataTo(tablePutPreFutureColumn + row, putPreFuture.toFixed(2));
    writeDataTo(tablePnlFutureResultColumn + row, pnlFutureResult.toFixed(2));
    writeDataTo(tablePnlMoveResultColumn + row, pnlMoveResult.toFixed(2));
    writeDataTo(tablePnlCallResultColumn + row, pnlCallResult.toFixed(2));
    writeDataTo(tablePnlPutResultColumn + row, pnlPutResult.toFixed(2));
}