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

function calculateExpiresIn(timeDelay_HourBased, instrumentDateString) {
    let noOfMillisecondsInHour = 60 * 60 * 1000;
    let noOfMillisecondsInADay = noOfMillisecondsInHour * 24;
    let timeDelayInMilliseconds = timeDelay_HourBased * noOfMillisecondsInHour;

    let end = new Date(instrumentDateString);
    end.setHours(10);
    let endStart = (end - new Date() - timeDelayInMilliseconds);
    return endStart / noOfMillisecondsInADay;
}

function writeBestValues(result) {
    writeDataTo(statusCell, "Writing Best Values");
    getDataFrom("B4");
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
    writeDataTo(resultMaxReturnPercentageCell, result.maxReturnPercentage);
    writeDataTo(resultMinReturnPercentageCell, result.minReturnPercentage);
    writeDataTo(resultAverageReturnPercentageCell, result.averageReturnPercentage);
    writeDataTo(resultTotalFundsInvestedCell, result.totalFundsInvested);
    writeDataTo(resultInitialMarginCallCell, result.initialMarginCall);
    writeDataTo(resultInitialMarginPutCell, result.initialMarginPut);
}

function bestValuesChanged(moveRange, callRange, putRange, capitalRange, green, average, exitSayisi, indexBtcDeribit, putAsk, callAsk, movePrice, callStrike, putStrike, callInstrumentName, putInstrumentName, maxReturnPercentage, minReturnPercentage, averageReturnPercentage, totalFundsInvested, initialMarginCall, initialMarginPut) {
    return {
        moveRange: moveRange,
        callRange: callRange,
        putRange: putRange,
        capitalRange: capitalRange,
        greenMax: green,
        average: average,
        success: "%" + (green / exitSayisi * 100).toFixed(2),
        indexBtcDeribit: indexBtcDeribit,
        totalPremium: calculateTotalPremium(putAsk, putRange, callAsk, callRange, movePrice, moveRange),
        callStrike: callStrike,
        putStrike: putStrike,
        putAsk: putAsk,
        callAsk: callAsk,
        callInstrumentName: callInstrumentName,
        putInstrumentName: putInstrumentName,
        maxReturnPercentage: maxReturnPercentage,
        minReturnPercentage: minReturnPercentage,
        averageReturnPercentage: averageReturnPercentage,
        totalFundsInvested: totalFundsInvested,
        initialMarginCall: initialMarginCall,
        initialMarginPut: initialMarginPut
    };
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

function calculateGreen(p1, p2) {
    if (p1.y >= 0 && p2.y >= 0) {
        return Math.abs(p1.x - p2.x);
    } else if (p1.y < 0 && p2.y >= 0) {
        return Math.abs(p1.x - p2.x) * Math.abs(p2.y) / (Math.abs(p1.y - p2.y));
    } else if (p1.y >= 0 && p2.y < 0) {
        return Math.abs(p1.x - p2.x) * Math.abs(p1.y) / (Math.abs(p1.y - p2.y));
    } else {
        return 0;
    }
}

function testCalculateGreen() {
    console.log(calculateGreen({x: -20, y: -10}, {x: -10, y: 10}) === 5);
    console.log(calculateGreen({x: -20, y: -20}, {x: 10, y: 10}) === 10);
    console.log(calculateGreen({x: 10, y: -10}, {x: 30, y: 10}) === 10);

    console.log(calculateGreen({x: -20, y: 10}, {x: -10, y: -10}) === 5);
    console.log(calculateGreen({x: -20, y: 20}, {x: 10, y: -10}) === 20);
    console.log(calculateGreen({x: 10, y: 10}, {x: 30, y: -10}) === 10);

    console.log(calculateGreen({x: -20, y: -10}, {x: -10, y: -10}) === 0);
    console.log(calculateGreen({x: -20, y: -20}, {x: 10, y: -10}) === 0);
    console.log(calculateGreen({x: 10, y: -10}, {x: 30, y: -10}) === 0);

    console.log(calculateGreen({x: -20, y: 10}, {x: -10, y: 10}) === 10);
    console.log(calculateGreen({x: -20, y: 20}, {x: 10, y: 10}) === 30);
    console.log(calculateGreen({x: 10, y: 10}, {x: 30, y: 10}) === 20);

    console.log(calculateGreen({x: 30, y: 10}, {x: 30, y: 10}) === 0);
    console.log(calculateGreen({x: 30, y: -10}, {x: 30, y: -10}) === 0);
    console.log(calculateGreen({x: -30, y: 10}, {x: -30, y: 10}) === 0);
    console.log(calculateGreen({x: -30, y: -10}, {x: -30, y: -10}) === 0);

    console.log(calculateGreen({x: 30, y: 10}, {x: 30, y: 0}) === 0);
    console.log(calculateGreen({x: -30, y: 10}, {x: -30, y: 0}) === 0);

    console.log(calculateGreen({x: -20, y: 0}, {x: 60, y: -10}) === 0);
    console.log(calculateGreen({x: -20, y: -10}, {x: 60, y: 0}) === 0);
    console.log(calculateGreen({x: 20, y: -10}, {x: 60, y: 0}) === 0);
    console.log(calculateGreen({x: 20, y: 0}, {x: 60, y: -10}) === 0);
    console.log(calculateGreen({x: -20, y: 0}, {x: 60, y: 10}) === 80);
    console.log(calculateGreen({x: -20, y: 10}, {x: 60, y: 0}) === 80);
    console.log(calculateGreen({x: 20, y: 10}, {x: 60, y: 0}) === 40);
    console.log(calculateGreen({x: 20, y: 0}, {x: 60, y: 10}) === 40);
}

function takeIntegralFrom(p, m, n) {
    return (m * p.x * p.x / 2) + (n * p.x);
}

function calculateArea(p1, p2) {
    if (p1.x === p2.x) return 0;
    let m = (p1.y - p2.y) / (p1.x - p2.x);
    let n = (p1.x * p2.y - p1.y * p2.x) / (p1.x - p2.x);
    return takeIntegralFrom(p2, m, n) - takeIntegralFrom(p1, m, n);
}

function f(x) {
    return 3 * x - 50;
}

function getPoint(x, f) {
    return {x: x, y: f(x)};
}

function map(instrumentNames) {
    let result = [];
    for (let instrumentName of instrumentNames) {
        result.push(instrumentName[0]);
    }
    return result;
}

function calculateMaintenanceMarginCall(indexBtcDeribit, callPreFuture) {
    return 0.075 * indexBtcDeribit + callPreFuture;
}

function calculateMaintenanceMarginPut(indexBtcDeribit, putPreFuture) {
    return Math.max(0.075 * indexBtcDeribit, 0.075 * putPreFuture) + putPreFuture;
}

function calculateTotalPremium(putAsk, putRange, callAsk, callRange, movePrice, moveRange) {
    return Math.abs(putAsk * putRange) + Math.abs(callAsk * callRange) + Math.abs(movePrice * moveRange);
}

function calculateInitialMarginCall(indexBtcDeribit, callStrike, callRange, callAskPrice) {
    if (callRange < 0) {
        let x = callStrike > indexBtcDeribit
            ? Math.max(0.15 - ((callStrike - indexBtcDeribit) / indexBtcDeribit), 0.1) + (callAskPrice / indexBtcDeribit)
            : 0.15 + (callAskPrice / indexBtcDeribit);
        return x * indexBtcDeribit * Math.abs(callRange) - callAskPrice * Math.abs(callRange);
    }
    return 0;

}

function calculateInitialMarginPut(indexBtcDeribit, putStrike, putRange, putAskPrice) {
    if (putRange < 0) {
        let x = putStrike < indexBtcDeribit
            ? Math.max(0.15 - (indexBtcDeribit - putStrike) / indexBtcDeribit, 0.1, 0.075 * (putAskPrice / indexBtcDeribit))
            : Math.max(0.15, 0.075 * (putAskPrice / indexBtcDeribit));
        return (x + (putAskPrice / indexBtcDeribit)) * indexBtcDeribit * Math.abs(putRange) - putAskPrice * Math.abs(putRange);
    }
    return 0;
}

function getBestValues() {
    let startTime = new Date();
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
    let balanceFuture = getDataFrom(balanceCell);
    let maxTotalFundsInvested = getDataFrom(maxTotalFundsInvestedCell);
    let interestRate = 0;

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
    let exitSayisi = exitInterval / exitRangeIncrement + 1;
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
                    let initialMarginCall = calculateInitialMarginCall(indexBtcDeribit, callStrike, callRange, callAsk);
                    for (let putRange = putRangeStart; putRange <= putRangeEnd; putRange += putRangeIncrement) {
                        let totalPremium = calculateTotalPremium(putAsk, putRange, callAsk, callRange, movePrice, moveRange);
                        let initialMarginPut = calculateInitialMarginPut(indexBtcDeribit, putStrike, putRange, putAsk);
                        let totalFundsInvested = balanceFuture + totalPremium + initialMarginCall + initialMarginPut;
                        for (let capitalRange = capitalRangeStart; capitalRange <= capitalRangeEnd; capitalRange += capitalRangeIncrement) {
                            let green = 0;
                            let average = 0;

                            let pnlTotalsArray = [
                                pnlTotals(indexBtcDeribit + exitRangeStart, indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange),
                                pnlTotals(indexBtcDeribit + exitRangeEnd, indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange)
                            ];
                            if (parseInt(putStrike) > indexBtcDeribit + exitRangeStart && parseInt(putStrike) < indexBtcDeribit + exitRangeEnd) {
                                pnlTotalsArray.push(pnlTotals(parseInt(putStrike), indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange));
                            }
                            if (parseInt(callStrike) > indexBtcDeribit + exitRangeStart && parseInt(callStrike) < indexBtcDeribit + exitRangeEnd) {
                                pnlTotalsArray.push(pnlTotals(parseInt(callStrike), indexBtcDeribit, exitRangeStart, putRange, putStrike, putAsk, callRange, callStrike, callAsk, moveRange, movePrice, moveStrikePrice, capitalRange));
                            }

                            pnlTotalsArray.sort(function (a, b) {
                                return a.x - b.x
                            });

                            for (let i = 0; i < pnlTotalsArray.length - 1; i++) {
                                green += calculateGreen(pnlTotalsArray[i], pnlTotalsArray[i + 1]);
                                average += calculateArea(pnlTotalsArray[i], pnlTotalsArray[i + 1]) / exitInterval;
                            }
                            let averageReturnPercentage = average / totalFundsInvested * 100;
                            let maxReturnPercentage = -100;
                            let minReturnPercentage = 100;
                            for (let i = 0; i < pnlTotalsArray.length; i++) {
                                let _returnPercentage = pnlTotalsArray[i].y / totalFundsInvested * 100;
                                if (maxReturnPercentage < _returnPercentage) maxReturnPercentage = _returnPercentage;
                                if (minReturnPercentage > _returnPercentage) minReturnPercentage = _returnPercentage;
                            }

                            let max = getMax(minReturnPercentage, averageReturnPercentage, boost, threshold, totalFundsInvested, maxTotalFundsInvested);
                            if (max > result.max) {
                                result = bestValuesChanged(moveRange, callRange, putRange, capitalRange, green, average, exitInterval, indexBtcDeribit, putAsk, callAsk, movePrice, callStrike, putStrike, callInstrumentName, putInstrumentName, maxReturnPercentage, minReturnPercentage, averageReturnPercentage, totalFundsInvested, initialMarginCall, initialMarginPut);
                                result.max = max;
                            }
                        }
                    }
                }
            }
        }
    }

    writeBestValues(result);
    writeDataTo(statusCell, "Calculating IV values");
    getDataFrom("B4");
    let call_IV = parseFloat(pullCall_IV(result.callInstrumentName));
    let put_IV = parseFloat(pullPut_IV(result.putInstrumentName));
    writeDataTo(resultPut_IVCell, put_IV);
    writeDataTo(resultCall_IVCell, call_IV);

    writeDataTo(statusCell, "Writing best values into table");
    getDataFrom("B4");
    let row = tableRowStartIndex;
    let maxMaintenanceMarginCall = 0;
    let maxMaintenanceMarginPut = 0;
    let putDate = result.putInstrumentName.split('-')[1];
    let callDate = result.callInstrumentName.split('-')[1];
    let expiresInCall = calculateExpiresIn(timeDelay, callDate);
    let expiresInPut = calculateExpiresIn(timeDelay, putDate);
    for (let exitPrice = indexBtcDeribit + exitRangeStart; exitPrice <= indexBtcDeribit + exitRangeEnd; exitPrice += exitRangeIncrement) {
        let callPreFuture = calculateCallPreFuture(exitPrice, result.callStrike, expiresInCall, interestRate, call_IV);
        let putPreFuture = calculatePutPreFuture(exitPrice, result.putStrike, expiresInPut, interestRate, put_IV);
        let pnlPutResult = pnlPut(exitPrice, result.putRange, result.putStrike, result.putAsk);
        let pnlMoveResult = pnlMove(exitPrice, result.moveRange, movePrice, moveStrikePrice);
        let pnlFutureResult = pnlFuture(exitPrice, result.capitalRange, indexBtcDeribit);
        let pnlCallResult = pnlCall(exitPrice, result.callRange, result.callStrike, result.callAsk);
        let pnlTotal = pnlPutResult + pnlCallResult + pnlMoveResult + pnlFutureResult;
        let pnlCallFuture = (callPreFuture - result.callAsk) * result.callRange;
        let pnlPutFuture = (putPreFuture - result.putAsk) * result.putRange;
        let pnlTotalFuture = pnlCallFuture + pnlPutFuture + pnlMoveResult;
        let maintenanceMarginCall = result.callRange >= 0 ? 0 : calculateMaintenanceMarginCall(indexBtcDeribit, callPreFuture) * Math.abs(result.callRange);
        let maintenanceMarginPut = result.putRange >= 0 ? 0 : calculateMaintenanceMarginPut(indexBtcDeribit, putPreFuture) * Math.abs(result.putRange);
        if (maxMaintenanceMarginCall < maintenanceMarginCall) maxMaintenanceMarginCall = maintenanceMarginCall;
        if (maxMaintenanceMarginPut < maintenanceMarginPut) maxMaintenanceMarginPut = maintenanceMarginPut;
        insertToTable(row++, indexBtcDeribit, exitPrice, pnlTotal, pnlTotalFuture, pnlCallFuture, pnlPutFuture, pnlFutureResult, pnlMoveResult, pnlCallResult, pnlPutResult, maintenanceMarginCall, maintenanceMarginPut, callPreFuture, putPreFuture);
    }
    writeDataTo(maintenanceMarginCallCell, maxMaintenanceMarginCall);
    writeDataTo(maintenanceMarginPutCell, maxMaintenanceMarginPut);
    writeDataTo(resultPutSizeCell, pullAskSizeDeribit(result.putInstrumentName, indexBtcDeribit));
    writeDataTo(resultCallSizeCell, pullAskSizeDeribit(result.callInstrumentName, indexBtcDeribit));
    getDataFrom("B4");
    // writeDataTo(statusCell, "Calculating Liq Risk");
    // writeLiqRisk(result, indexBtcDeribit, exitRangeStart, exitRangeEnd, exitRangeIncrement, exitInterval);
    // getDataFrom("B4");
    let elapsedTime = (new Date() - startTime) / 1000;
    writeDataTo(statusCell, "Done in " + elapsedTime + " seconds");
}

function getMax(minReturnPercentage, averageReturnPercentage, boost, threshold, totalFundsInvested, maxTotalFundsInvested) {
    if (totalFundsInvested > maxTotalFundsInvested) {
        return 0;
    } else if (minReturnPercentage >= threshold) {
        return boost * averageReturnPercentage;
    } else {
        return averageReturnPercentage;
    }
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

function insertToTable(row, indexBtcDeribit, exitPrice, pnlTotal, pnlTotalFuture, pnlCallFuture, pnlPutFuture, pnlFutureResult, pnlMoveResult, pnlCallResult, pnlPutResult, maintenanceMarginCall, maintenanceMarginPut, callPreFuture, putPreFuture) {
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
    // writeDataTo('N' + row, maintenanceMarginCall.toFixed(0));
    // writeDataTo('O' + row, maintenanceMarginPut.toFixed(0));
    // writeDataTo('P' + row, callPreFuture.toFixed(0));
    // writeDataTo('Q' + row, putPreFuture.toFixed(0));
}

function clearTable() {
    let sheet = SpreadsheetApp.getActive().getSheetByName('Trade');
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
