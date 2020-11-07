function pnlPut(exitPrice, putRange, putStrike, putAsk) {
    if (exitPrice - putStrike >= 0) {
        return -putAsk * putRange;
    } else {
        return putStrike * putRange - exitPrice * putRange - putAsk * putRange;
    }
}

function pnlCall(exitPrice, callRange, callStrike, callAsk) {
    if (exitPrice - callStrike >= 0) {
        return exitPrice * callRange - callStrike * callRange - callAsk * callRange;
    } else {
        return -callAsk * callRange;
    }
}

function pnlMove(exitPrice, moveRange, movePrice, moveStrikePrice) {
    return moveRange * (movePrice - Math.abs(moveStrikePrice - exitPrice));
}

function pnlFuture(exitPrice, capitalRange, indexBtcDeribit) {
    return (exitPrice - indexBtcDeribit) * (capitalRange / indexBtcDeribit);
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
    writeDataTo(resultMoveNoCell, result.moveRange);
    writeDataTo(resultCallNoCell, result.callRange);
    writeDataTo(resultPutNoCell, result.putRange);
    writeDataTo(resultCapitalNo, result.capitalRange);
    writeDataTo(resultAverageCell, result.average);
    writeDataTo(resultSuccessCell, result.success);
    writeDataTo(resultIndexBtcDeribitCell, result.indexBtcDeribit);
    writeDataTo(resultTotalPremiumCell, result.totalPremium);
}

function setBestValues(moveRange, callRange, putRange, capitalRange, green, average, exitSayisi, indexBtcDeribit, putAsk, callAsk, movePrice, callStrike, putStrike) {
    return {
        moveRange: moveRange,
        callRange: callRange,
        putRange: putRange,
        capitalRange: capitalRange,
        greenMax: green,
        average: average,
        success: "%" + (green / exitSayisi * 100).toFixed(2),
        indexBtcDeribit: indexBtcDeribit,
        totalPremium: putAsk * putRange + callAsk * callRange + movePrice * moveRange,
        callStrike: callStrike,
        putStrike: putStrike,
        putAsk: putAsk,
        callAsk: callAsk
    };
}

function bestValuesChanged(result, moveRange, callRange, putRange, capitalRange, green, average, exitSayisi, indexBtcDeribit, putAsk, callAsk, movePrice, callStrike, putStrike) {
    result = setBestValues(result, moveRange, callRange, putRange, capitalRange, green, average, exitSayisi, indexBtcDeribit, putAsk, callAsk, movePrice, callStrike, putStrike);
    writeBestValues(result);
    return result;
}

function getBestValues() {
    pullJSON();
    clearTable();
    let capitalRangeStart = getDataFrom(capitalRangeStartCell);
    let capitalRangeEnd = getDataFrom(capitalRangeEndCell);
    let capitalRangeIncrement = getDataFrom(capitalRangeIncrementCell);
    let putRangeStart = getDataFrom(putRangeStartCell);
    let putRangeEnd = getDataFrom(putRangeEndCell);
    let putRangeIncrement = getDataFrom(putRangeIncrementCell);
    let callRangeStart = getDataFrom(callRangeStartCell);
    let callRangeEnd = getDataFrom(callRangeEndCell);
    let callRangeIncrement = getDataFrom(callRangeIncrementCell);
    let moveRangeStart = getDataFrom(moveRangeStartCell);
    let moveRangeEnd = getDataFrom(moveRangeEndCell);
    let moveRangeIncrement = getDataFrom(moveRangeIncrementCell);
    let exitRangeStart = getDataFrom(exitRangeStartCell);
    let exitRangeEnd = getDataFrom(exitRangeEndCell);
    let exitRangeIncrement = getDataFrom(exitRangeIncrementCell);
    let timeDelay = getDataFrom(timeDelayCell);
    let indexBtcDeribit = getDataFrom(resultIndexBtcDeribitCell);
    let movePrice = getDataFrom(resultMovePriceCell);
    let moveStrikePrice = getDataFrom(resultMoveStrikePriceCell);
    let call_IV = getDataFrom(resultCall_IVCell);
    let put_IV = getDataFrom(resultPut_IVCell);
    let interestRate = 0;
    let expiresIn = calculateExpiresIn(timeDelay);

    let result = {
        moveRange: moveRangeStart,
        callRange: callRangeStart,
        putRange: putRangeStart,
        capitalRange: capitalRangeStart,
        greenMax: 0,
        average: 0,
    };
    let exitSayisi = (exitRangeEnd - exitRangeStart) / exitRangeIncrement + 1;
    let threshold = 0;
    let putLastRange = findLastRange(selectedPutInstrumentColumn, selectedPutInstrumentRow);
    let putInstrumentNames = SpreadsheetApp.getActiveSheet().getRange(selectedPutInstrumentColumn + selectedPutInstrumentRow + ":" + putLastRange).getValues()[0];
    let callLastRange = findLastRange(selectedCallInstrumentColumn, selectedCallInstrumentRow);
    let callInstrumentNames = SpreadsheetApp.getActiveSheet().getRange(selectedCallInstrumentColumn + selectedCallInstrumentRow + ":" + callLastRange).getValues()[0];

    for (let i = 0; i < putInstrumentNames.length; i++) {
        let putInstrumentName = putInstrumentNames[i];
        let putStrike = putInstrumentName.split("-")[2];
        let putAsk = pullAskPriceDeribit(putInstrumentName, indexBtcDeribit);
        for (let j = 0; j < callInstrumentNames.length; j++) {
            let callInstrumentName = callInstrumentNames[j];
            let callStrike = callInstrumentName.split("-")[2];
            let callAsk = pullAskPriceDeribit(callInstrumentName, indexBtcDeribit);
            for (let moveRange = moveRangeStart; moveRange <= moveRangeEnd; moveRange += moveRangeIncrement) {
                for (let callRange = callRangeStart; callRange <= callRangeEnd; callRange += callRangeIncrement) {
                    for (let putRange = putRangeStart; putRange <= putRangeEnd; putRange += putRangeIncrement) {
                        for (let capitalRange = capitalRangeStart; capitalRange <= capitalRangeEnd; capitalRange += capitalRangeIncrement) {
                            let green = 0;
                            let average = 0;
                            for (let exitPrice = indexBtcDeribit + exitRangeStart; exitPrice <= indexBtcDeribit + exitRangeEnd; exitPrice += exitRangeIncrement) {
                                let pnlTotal = pnlPut(exitPrice, putRange, putStrike, putAsk) + pnlCall(exitPrice, callRange, callStrike, callAsk) + pnlMove(exitPrice, moveRange, movePrice, moveStrikePrice) + pnlFuture(exitPrice, capitalRange, indexBtcDeribit);
                                if (pnlTotal > 0) {
                                    green++;
                                    average += pnlTotal / exitSayisi;
                                }
                            }
                            if (green / exitSayisi >= threshold) {
                                if (result.greenMax / exitSayisi < threshold || result.average < average) {
                                    result = bestValuesChanged(result, moveRange, callRange, putRange, capitalRange, green, average, exitSayisi, indexBtcDeribit, putAsk, callAsk, movePrice, callStrike, putStrike);
                                }
                            } else if (result.greenMax < green) {
                                result = bestValuesChanged(result, moveRange, callRange, putRange, capitalRange, green, average, exitSayisi, indexBtcDeribit, putAsk, callAsk, movePrice, callStrike, putStrike);
                            }

                        }
                    }
                }
            }
        }
    }

    let row = tableRowStartIndex;
    for (let exitPrice = indexBtcDeribit + exitRangeStart; exitPrice <= indexBtcDeribit + exitRangeEnd; exitPrice += exitRangeIncrement) {
        let calcOptionResult = calculateOption(exitPrice, result.callStrike, expiresIn, interestRate, call_IV, put_IV);
        let pnlPutResult = pnlPut(exitPrice, result.putRange, result.putStrike, result.putAsk);
        let pnlMoveResult = pnlMove(exitPrice, result.moveRange, movePrice, moveStrikePrice);
        let pnlFutureResult = pnlFuture(exitPrice, result.capitalRange, indexBtcDeribit);
        let pnlCallResult = pnlCall(exitPrice, result.callRange, result.callStrike, result.callAsk);
        let pnlTotal = pnlPutResult + pnlCallResult + pnlMoveResult + pnlFutureResult;
        let pnlCallFuture = -(result.callAsk - calcOptionResult.callPreFuture) * result.callRange;
        let pnlPutFuture = -(result.putAsk - calcOptionResult.putPreFuture) * result.putRange;
        let pnlTotalFuture = pnlCallFuture + pnlPutFuture + pnlMoveResult;
        insertToTable(row++, indexBtcDeribit, exitPrice, pnlTotal, pnlTotalFuture, calcOptionResult.callPreFuture, calcOptionResult.putPreFuture, pnlFutureResult, pnlMoveResult, pnlCallResult, pnlPutResult);
    }
}

function pullAskPriceDeribit(instrumentName, indexBtcDeribit) {
    var data = pullDataFrom("https://www.deribit.com/api/v2/public/get_order_book?instrument_name=" + instrumentName);
    return indexBtcDeribit * data.result['asks'][0][0];
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

function insertToTable(row, indexBtcDeribit, exitPrice, pnlTotal, pnlTotalFuture, callPreFuture, putPreFuture, pnlFutureResult, pnlMoveResult, pnlCallResult, pnlPutResult) {
    writeDataTo(tableIndexBtcDeribitColumn + row, indexBtcDeribit.toFixed(2));
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