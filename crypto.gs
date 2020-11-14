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
    return moveRange * (-movePrice + Math.abs(moveStrikePrice - exitPrice));
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
    writeDataTo(resultCallAskCell, result.callAsk);
    writeDataTo(resultPutAskCell, result.putAsk);
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
        totalPremium: Math.abs(putAsk * putRange) + Math.abs(callAsk * callRange) + Math.abs(movePrice * moveRange),
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

function writeLiqRisk(result, indexBtcDeribit, exitRangeStart, exitRangeEnd, exitRangeIncrement) {
    let exitSayisi = (exitRangeEnd - exitRangeStart) / exitRangeIncrement + 1;
    let balance = getDataFrom(balanceCell);
    let leverage = result.capitalRange / balance;
    let liq = result.indexBtcDeribit * (1 - (16 / (leverage * 17)));
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

    writeDataTo(resultLiqRiskCell, "%" + (count / exitSayisi * 100).toFixed(2))
}

function calculatePnlTotal(exitPrice, indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange) {
    return pnlPut(exitPrice, putRange, putStrike, putAsk)
        + pnlCall(exitPrice, callRange, callStrike, callAsk)
        + pnlMove(exitPrice, moveRange, movePrice, moveStrikePrice)
        + pnlFuture(exitPrice, capitalRange, indexBtcDeribit);
}

function pnlTotals(exitPrice, indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange) {
    return {
        x: exitPrice,
        y: calculatePnlTotal(exitPrice, indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange)
    };
}

function get_intersection(p0, p1, p2, p3) {
    let s1_x = p1.x - p0.x;
    let s1_y = p1.y - p0.y;
    let s2_x = p3.x - p2.x;
    let s2_y = p3.y - p2.y;

    let s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
    let t = (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
        return {x: p0.x + (t * s1_x), y: p0.y + (t * s1_y)};
    else
        return null;
}

function calculateGreen(p1, p2) {
    let intersection = get_intersection(p1, p2, {x: p1.x, y: 0}, {x: p2.x, y: 0});
    if (intersection == null) {
        if (p1.y >= 0) {
            return Math.abs(p2.x - p1.x);
        } else {
            return 0;
        }
    } else {
        if (p1.y >= 0) {
            return Math.abs(p1.x - intersection.x);
        } else {
            return Math.abs(p2.x - intersection.x);
        }
    }
}

function testCalculateGreen() {
    let p1 = {x: 15, y: 20};
    let p2 = {x: 25, y: 10};
    console.log(calculateGreen(p1, p2));
}

function takeIntegralFrom(p, m, n) {
    return (m * p.x * p.x / 2) + (n * p.x);
}

function calculateArea(p1, p2) {
    if (p1.x === p2.x) return 0;
    let m = (p1.y - p2.y) / (p1.x - p2.x);
    let n = (p1.x * p2.y - p1.y * p2.x) / (p1.x - p2.x);
    return -takeIntegralFrom(p1, m, n) + takeIntegralFrom(p2, m, n);
}

function f(x) {
    return 3 * x - 50;
}

function getPoint(x, f) {
    return {x: x, y: f(x)};
}

function getMax(green, average, threshold, exitInterval, boost) {
    if (green / exitInterval >= threshold) {
        return boost * exitInterval * average;
    } else {
        return green * average;
    }
}

function map(instrumentNames) {
    let result = [];
    for (let instrumentName of instrumentNames) {
        result.push(instrumentName[0]);
    }
    return result;
}

function calculateMaintenanceMarginCall(indexBtcDeribit, calcOptionResult) {
    return 0.075 * indexBtcDeribit + calcOptionResult.callPreFuture;
}

function calculateMaintenanceMarginPut(indexBtcDeribit, calcOptionResult) {
    return Math.max(0.075, 0.075 * calcOptionResult.putPreFuture) + calcOptionResult.putPreFuture;
}

function getBestValues() {
    writeDataTo(statusCell, "Pulling Data from Internet");
    getDataFrom("B4");
    pullJSON();
    writeDataTo(statusCell, "Clearing Table");
    getDataFrom("B4");
    clearTable();
    writeDataTo(statusCell, "Getting Initial Values");
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
        max: -10000000,
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
    let threshold = getDataFrom(thresholdCell);
    let boost = getDataFrom(boostCell);
    let exitInterval = exitRangeEnd - exitRangeStart;
    let putLastRange = findLastRange(selectedPutInstrumentColumn, selectedPutInstrumentRow);
    let putInstrumentNames = SpreadsheetApp.getActiveSheet().getRange(selectedPutInstrumentColumn + selectedPutInstrumentRow + ":" + putLastRange).getValues();
    let callLastRange = findLastRange(selectedCallInstrumentColumn, selectedCallInstrumentRow);
    let callInstrumentNames = SpreadsheetApp.getActiveSheet().getRange(selectedCallInstrumentColumn + selectedCallInstrumentRow + ":" + callLastRange).getValues();
    let putAsks = pullAskPricesDeribit(map(putInstrumentNames), indexBtcDeribit);
    let callAsks = pullAskPricesDeribit(map(callInstrumentNames), indexBtcDeribit);

    writeDataTo(statusCell, "Calculating Best Values");
    getDataFrom("B4");
    for (let i = 0; i < putInstrumentNames.length; i++) {
        let putInstrumentName = putInstrumentNames[i][0];
        let putStrike = putInstrumentName.split("-")[2];
        let putAsk = putAsks[i];
        for (let j = 0; j < callInstrumentNames.length; j++) {
            let callInstrumentName = callInstrumentNames[j][0];
            let callStrike = callInstrumentName.split("-")[2];
            let callAsk = callAsks[j];
            for (let moveRange = moveRangeStart; moveRange <= moveRangeEnd; moveRange += moveRangeIncrement) {
                for (let callRange = callRangeStart; callRange <= callRangeEnd; callRange += callRangeIncrement) {
                    for (let putRange = putRangeStart; putRange <= putRangeEnd; putRange += putRangeIncrement) {
                        for (let capitalRange = capitalRangeStart; capitalRange <= capitalRangeEnd; capitalRange += capitalRangeIncrement) {
                            let green = 0;
                            let average = 0;

                            let pnlTotalsArray = [
                                pnlTotals(indexBtcDeribit + exitRangeStart, indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange),
                                pnlTotals(indexBtcDeribit + exitRangeEnd, indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange),
                                pnlTotals(parseInt(putStrike), indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange),
                                pnlTotals(parseInt(callStrike), indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange)
                            ];

                            pnlTotalsArray.sort(function (a, b) {
                                return a.x - b.x
                            });

                            for (let i = 0; i < pnlTotalsArray.length - 1; i++) {
                                green += calculateGreen(pnlTotalsArray[i], pnlTotalsArray[i + 1]);
                                average += calculateArea(pnlTotalsArray[i], pnlTotalsArray[i + 1]) / exitInterval;
                            }

                            let max = getMax(green, average, threshold, exitInterval, boost);
                            if (max > result.max) {
                                result = bestValuesChanged(moveRange, callRange, putRange, capitalRange, green, average, exitInterval, indexBtcDeribit, putAsk, callAsk, movePrice, callStrike, putStrike, callInstrumentName, putInstrumentName);
                                result.max = max;
                            }
                        }
                    }
                }
            }
        }
    }

    writeDataTo(statusCell, "Calculating IV values");
    pullCall_IV(result.callInstrumentName);
    pullPut_IV(result.putInstrumentName);
    let call_IV = getDataFrom(resultCall_IVCell);
    let put_IV = getDataFrom(resultPut_IVCell);

    writeDataTo(statusCell, "Writing best values into table");
    getDataFrom("B4");
    let row = tableRowStartIndex;
    let maxMaintenanceMarginCall = 0;
    let maxMaintenanceMarginPut = 0;
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
        let maintenanceMarginCall = result.callRange >= 0 ? 0 : calculateMaintenanceMarginCall(indexBtcDeribit, calcOptionResult) * Math.abs(result.callRange);
        let maintenanceMarginPut = result.putRange >= 0 ? 0 : calculateMaintenanceMarginPut(indexBtcDeribit, calcOptionResult) * Math.abs(result.putRange);
        if (maxMaintenanceMarginCall < maintenanceMarginCall) maxMaintenanceMarginCall = maintenanceMarginCall;
        if (maxMaintenanceMarginPut < maintenanceMarginPut) maxMaintenanceMarginPut = maintenanceMarginPut;
        insertToTable(row++, indexBtcDeribit, exitPrice, pnlTotal, pnlTotalFuture, pnlCallFuture, pnlPutFuture, pnlFutureResult, pnlMoveResult, pnlCallResult, pnlPutResult);
    }
    writeDataTo(maintenanceMarginCallCell, maxMaintenanceMarginCall);
    writeDataTo(maintenanceMarginPutCell, maxMaintenanceMarginPut);
    writeDataTo(statusCell, "Calculating Liq Risk");
    getDataFrom("B4");
    writeLiqRisk(result, indexBtcDeribit, exitRangeStart, exitRangeEnd, exitRangeIncrement, exitInterval);
    getDataFrom("B4");
    writeDataTo(statusCell, "Done");
}

function pullAskPriceDeribit(instrumentName, indexBtcDeribit) {
    var data = pullDataFrom("https://www.deribit.com/api/v2/public/get_order_book?instrument_name=" + instrumentName);
    return indexBtcDeribit * data.result['asks'][0][0];
}

function pullAskPricesDeribit(instrumentNames, indexBtcDeribit) {
    let result = [];
    for (let instrumentName of instrumentNames) {
        result.push(pullAskPriceDeribit(instrumentName, indexBtcDeribit));
    }
    return result;
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
    let sheet = SpreadsheetApp.getActive().getSheetByName('Trade')
    let lastRow = sheet.getLastRow();
    let clear = [];
    for (let i = tableRowStartIndex; i <= lastRow; i++) {
        clear.push([""]);
    }
    SpreadsheetApp.getActiveSheet().getRange(tableIndexBtcDeribitColumn + tableRowStartIndex + ":" + tableIndexBtcDeribitColumn + (clear.length + tableRowStartIndex - 1)).setValues(clear);
    SpreadsheetApp.getActiveSheet().getRange(tableExitPriceColumn + tableRowStartIndex + ":" + tableExitPriceColumn + (clear.length + tableRowStartIndex - 1)).setValues(clear);
    SpreadsheetApp.getActiveSheet().getRange(tablePnlFutureResultColumn + tableRowStartIndex + ":" + tablePnlFutureResultColumn + (clear.length + tableRowStartIndex - 1)).setValues(clear);
    SpreadsheetApp.getActiveSheet().getRange(tablePnlCallResultColumn + tableRowStartIndex + ":" + tablePnlCallResultColumn + (clear.length + tableRowStartIndex - 1)).setValues(clear);
    SpreadsheetApp.getActiveSheet().getRange(tablePnlPutResultColumn + tableRowStartIndex + ":" + tablePnlPutResultColumn + (clear.length + tableRowStartIndex - 1)).setValues(clear);
    SpreadsheetApp.getActiveSheet().getRange(tablePnlMoveResultColumn + tableRowStartIndex + ":" + tablePnlMoveResultColumn + (clear.length + tableRowStartIndex - 1)).setValues(clear);
    SpreadsheetApp.getActiveSheet().getRange(tablePnlTotalColumn + tableRowStartIndex + ":" + tablePnlTotalColumn + (clear.length + tableRowStartIndex - 1)).setValues(clear);
    SpreadsheetApp.getActiveSheet().getRange(tablePnlCallFutureColumn + tableRowStartIndex + ":" + tablePnlCallFutureColumn + (clear.length + tableRowStartIndex - 1)).setValues(clear);
    SpreadsheetApp.getActiveSheet().getRange(tablePnlPutFutureColumn + tableRowStartIndex + ":" + tablePnlPutFutureColumn + (clear.length + tableRowStartIndex - 1)).setValues(clear);
    SpreadsheetApp.getActiveSheet().getRange(tablePnlTotalFutureColumn + tableRowStartIndex + ":" + tablePnlTotalFutureColumn + (clear.length + tableRowStartIndex - 1)).setValues(clear);
}
