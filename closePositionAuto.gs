function closePositionAuto() {
    let indexPrice = pullIndexPriceDeribit();
    let totalPnls = calculateCurrentPnlTotals(indexPrice);
    if (totalPnls <= -100) {
        sendTextToTelegramWithNotification(chats.runWithTelegram, "Danger is coming!! We are closing the position");
        closePosition();
        sendTextToTelegramWithNotification(chats.runWithTelegram, "Position is closed! You are safe now");
        updatePositionsAndSendToTelegram(chats.runWithTelegram);
    }
}

function getMaxProfit(position) {
    return -position.putOptionPrice * position.putRange - position.callOptionPrice * position.callRange;
}

function buyPerpetuals() {
    if (isTestMode())
        sellPerpetual(10, 20000);
}

function buyPerpetual(amount, stopPrice) {
    buy({
        instrumentName: "BTC-PERPETUAL",
        amount: amount,
        type: "market",
        timeInForce: "good_til_cancelled",
    });
    sell({
        instrumentName: "BTC-PERPETUAL",
        amount: amount,
        type: "stop_market",
        trigger: "index_price",
        timeInForce: "good_til_cancelled",
        stopPrice: stopPrice,
    });
}

function isInstrumentExpired(instrumentName) {
    return calculateExpiresIn(0, getDate(instrumentName)) < 0;
}

function isPositionExpired(position) {
    if (isPositionCall(position)) {
        return isInstrumentExpired(position.callInstrumentName);
    } else {
        return isInstrumentExpired(position.putInstrumentName);
    }
}

function isPositionCall(position) {
    return position.callRange !== 0;
}

function getTersPozisyondaMiyiz() {
    return getDataFrom('girme!A1');
}

function setTersPozisyondaMiyiz(value) {
    writeDataTo('girme!A1', value);
}

function optionStopLossController() {
    let indexPrice = pullIndexPriceDeribit();
    let profit = calculateCurrentPnlTotals(indexPrice);
    let position = getPosition1();
    let maxProfit = getMaxProfit(position);
    let tersPozisyondaMiyiz = getTersPozisyondaMiyiz() === 'TRUE';
    if (isPositionExpired(position)) {
        closePerpetuals();
        deleteTrigger('optionStopLossController');
        return;
    }
    if (isPositionCall(position)) {
        let amount = (Math.round(position.callRange * indexPrice / 10) * 10);
        if (profit < maxProfit / 2 && !tersPozisyondaMiyiz) {
            buy({
                instrumentName: "BTC-PERPETUAL",
                amount: amount,
                type: "market",
                timeInForce: "good_til_cancelled",
            });
            setTersPozisyondaMiyiz('TRUE');
        } else if (profit > maxProfit / 4 * 3 && tersPozisyondaMiyiz) {
            sell({
                instrumentName: "BTC-PERPETUAL",
                amount: amount,
                type: "market",
                timeInForce: "good_til_cancelled",
            });
            setTersPozisyondaMiyiz('FALSE');
        }
    } else {
        let amount = (Math.round(position.putRange * indexPrice / 10) * 10);
        if (profit < maxProfit / 2 && !tersPozisyondaMiyiz) {
            sell({
                instrumentName: "BTC-PERPETUAL",
                amount: amount,
                type: "market",
                timeInForce: "good_til_cancelled",
            });
            setTersPozisyondaMiyiz('TRUE');
        } else if (profit > maxProfit / 4 * 3 && tersPozisyondaMiyiz) {
            buy({
                instrumentName: "BTC-PERPETUAL",
                amount: amount,
                type: "market",
                timeInForce: "good_til_cancelled",
            });
            setTersPozisyondaMiyiz('FALSE');
        }
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
        sendTextToTelegramWithoutNotification(chats.runWithTelegram, "Stop Point: " + exitPrice.toFixed(0) + "\n" + 'Stop Loss: ' + maxLoss.toFixed(0));
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
