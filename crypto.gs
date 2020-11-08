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
    writeDataTo(resultCallInstrumentCell, result.callInstrumentName);
    writeDataTo(resultPutInstrumentCell, result.putInstrumentName);
}

function bestValuesChanged(moveRange, callRange, putRange, capitalRange, green, average, exitSayisi, indexBtcDeribit, putAsk, callAsk, movePrice, callStrike, putStrike, callInstrumentName, putInstrumentName) {
    let result = {
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
        callAsk: callAsk,
        callInstrumentName: callInstrumentName,
        putInstrumentName: putInstrumentName
    };
    writeBestValues(result);
    return result;
}

function writeLiqRisk(result, indexBtcDeribit, exitRangeStart, exitRangeEnd, exitRangeIncrement, exitSayisi) {
    let balance = getDataFrom(balanceCell);
    let leverage = Math.abs(result.capitalRange / balance);
    let liq = result.indexBtcDeribit - result.indexBtcDeribit * (100 / (leverage + leverage / 16) / 100);
    let count = 0;
    if (result.capitalRange < 0) {
        for (let exitPrice = indexBtcDeribit + exitRangeStart; exitPrice <= indexBtcDeribit + exitRangeEnd; exitPrice += exitRangeIncrement) {
            if (exitPrice < liq) {
                count++;
            }
        }
    } else if (result.capitalRange > 0) {
        for (let exitPrice = indexBtcDeribit + exitRangeStart; exitPrice <= indexBtcDeribit + exitRangeEnd; exitPrice += exitRangeIncrement) {
            if (exitPrice > liq) {
                count++;
            }
        }
    }

    writeDataTo(resultLiqRiskCell, "%" + (count / exitSayisi * 100))
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
    let interestRate = 0;
    let expiresIn = calculateExpiresIn(timeDelay);

    let result = {
        moveRange: "Unknown",
        callRange: "Unknown",
        putRange: "Unknown",
        capitalRange: "Unknown",
        greenMax: 0,
        average: 0,
        max: 0,
        success: "Unknown",
        indexBtcDeribit: "Unknown",
        totalPremium: "Unknown",
        callStrike: "Unknown",
        putStrike: "Unknown",
        putAsk: "Unknown",
        callAsk: "Unknown",
        callInstrumentName: "Unknown",
        putInstrumentName: "Unknown"
    };
    let exitSayisi = (exitRangeEnd - exitRangeStart) / exitRangeIncrement + 1;
    let putLastRange = findLastRange(selectedPutInstrumentColumn, selectedPutInstrumentRow);
    let putInstrumentNames = SpreadsheetApp.getActiveSheet().getRange(selectedPutInstrumentColumn + selectedPutInstrumentRow + ":" + putLastRange).getValues();
    let callLastRange = findLastRange(selectedCallInstrumentColumn, selectedCallInstrumentRow);
    let callInstrumentNames = SpreadsheetApp.getActiveSheet().getRange(selectedCallInstrumentColumn + selectedCallInstrumentRow + ":" + callLastRange).getValues();

    for (let i = 0; i < putInstrumentNames.length; i++) {
        let putInstrumentName = putInstrumentNames[i][0];
        let putStrike = putInstrumentName.split("-")[2];
        let putAsk = pullAskPriceDeribit(putInstrumentName, indexBtcDeribit);
        for (let j = 0; j < callInstrumentNames.length; j++) {
            let callInstrumentName = callInstrumentNames[j][0];
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
                            if (green > result.greenMax) {
                                result = bestValuesChanged(moveRange, callRange, putRange, capitalRange, green, average, exitSayisi, indexBtcDeribit, putAsk, callAsk, movePrice, callStrike, putStrike, callInstrumentName, putInstrumentName);
                            }
                        }
                    }
                }
            }
        }
    }

    pullCall_IV(result.callInstrumentName);
    pullPut_IV(result.putInstrumentName);
    let call_IV = getDataFrom(resultCall_IVCell);
    let put_IV = getDataFrom(resultPut_IVCell);
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
        insertToTable(row++, indexBtcDeribit, exitPrice, pnlTotal, pnlTotalFuture, pnlCallFuture, pnlPutFuture, pnlFutureResult, pnlMoveResult, pnlCallResult, pnlPutResult);
    }

    writeLiqRisk(result, indexBtcDeribit, exitRangeStart, exitRangeEnd, exitRangeIncrement, exitSayisi);
}


function test() {
    let threshold = 1;
    let result = {
        greenMax: 0,
        averageMax: 0
    };
    let data = [
        {green: 2, average: 128.7297729, call: "BTC-8NOV20-15000-P", put: "BTC-8NOV20-15000-C"},
        {green: 2, average: 68.02417144, call: "BTC-8NOV20-15000-P", put: "BTC-8NOV20-15000-C"},
        {green: 1, average: 7.409285, call: "BTC-8NOV20-15000-P", put: "BTC-8NOV20-15000-C"},
        {green: 2, average: 35.58917144, call: "BTC-8NOV20-15000-P", put: "BTC-8NOV20-15000-C"},
        {green: 2, average: 96.29477288, call: "BTC-8NOV20-15000-P", put: "BTC-8NOV20-15000-C"},
        {green: 2, average: 143.4611679, call: "BTC-8NOV20-15000-P", put: "BTC-8NOV20-15000-C"}
    ];
    for (let i = 0; i < data.length; i++) {
        let datum = data[i];
        let green = datum.green;
        let average = datum.average;

        if (green >= threshold) {
            if (average > result.averageMax) {
                result = {greenMax: datum.green, averageMax: datum.average}
            }
        } else {
            if (green > result.greenMax) {
                result = {greenMax: datum.green, averageMax: datum.average}
            }
        }

    }

    writeDataTo('P95', result.greenMax);
    writeDataTo('Q95', result.averageMax);
    writeDataTo('R95', result.call);
    writeDataTo('S95', result.put);
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

function insertToTable(row, indexBtcDeribit, exitPrice, pnlTotal, pnlTotalFuture, pnlCallFuture, pnlPutFuture, pnlFutureResult, pnlMoveResult, pnlCallResult, pnlPutResult) {
    writeDataTo(tableIndexBtcDeribitColumn + row, indexBtcDeribit.toFixed(2));
    writeDataTo(tableExitPriceColumn + row, exitPrice.toFixed(2));
    writeDataTo(tablePnlFutureResultColumn + row, pnlFutureResult.toFixed(2));
    writeDataTo(tablePnlCallResultColumn + row, pnlCallResult.toFixed(2));
    writeDataTo(tablePnlPutResultColumn + row, pnlPutResult.toFixed(2));
    writeDataTo(tablePnlMoveResultColumn + row, pnlMoveResult.toFixed(2));
    writeDataTo(tablePnlTotalColumn + row, pnlTotal.toFixed(0));
    writeDataTo(tablePnlCallFutureColumn + row, pnlCallFuture.toFixed(2));
    writeDataTo(tablePnlPutFutureColumn + row, pnlPutFuture.toFixed(2));
    writeDataTo(tablePnlTotalFutureColumn + row, pnlTotalFuture.toFixed(0));
}

function clearTable() {
    for (let row = tableRowStartIndex; row < 300; row++) {
        writeDataTo(tableIndexBtcDeribitColumn + row, "");
        writeDataTo(tableExitPriceColumn + row, "");
        writeDataTo(tablePnlFutureResultColumn + row, "");
        writeDataTo(tablePnlCallResultColumn + row, "");
        writeDataTo(tablePnlPutResultColumn + row, "");
        writeDataTo(tablePnlMoveResultColumn + row, "");
        writeDataTo(tablePnlTotalColumn + row, "");
        writeDataTo(tablePnlCallFutureColumn + row, "");
        writeDataTo(tablePnlPutFutureColumn + row, "");
        writeDataTo(tablePnlTotalFutureColumn + row, "");
    }
}
