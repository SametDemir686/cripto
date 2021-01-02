function confirmActionOpenPosition() {
    if (!isSafeMode()) {
        confirmAction(openPosition);
    } else {
        alert("You are in safe mode");
    }
}

function confirmActionClosePosition() {
    if (!isSafeMode()) {
        confirmAction(closePosition);
    } else {
        alert("You are in safe mode");
    }
}

function confirmAction(func) {
    var ui = SpreadsheetApp.getUi();
    var buttonPressed = ui.alert("Are You Sure?", ui.ButtonSet.YES_NO);
    if (buttonPressed === ui.Button.YES) {
        func();
    }
}

function openPosition() {
    if (!isSafeMode()) {
        runIfCellNotEmpty(openBuyCall1InstrumentNameCell, openBuyCall1);
        runIfCellNotEmpty(openBuyPut1InstrumentNameCell, openBuyPut1);
        runIfCellNotEmpty(openSellCall1InstrumentNameCell, openSellCall1);
        runIfCellNotEmpty(openSellPut1InstrumentNameCell, openSellPut1);
        runIfCellNotEmpty(openBuyCall2InstrumentNameCell, openBuyCall2);
        runIfCellNotEmpty(openBuyPut2InstrumentNameCell, openBuyPut2);
        runIfCellNotEmpty(openSellCall2InstrumentNameCell, openSellCall2);
        runIfCellNotEmpty(openSellPut2InstrumentNameCell, openSellPut2);
        createTrigger('closePositionAuto');
    }
    updateOrdersAndPositions();
}

function closePosition() {
    if (!isSafeMode()) {
        runIfCellNotEmpty(closeBuyCall1InstrumentNameCell, closeBuyCall1);
        runIfCellNotEmpty(closeBuyPut1InstrumentNameCell, closeBuyPut1);
        runIfCellNotEmpty(closeSellCall1InstrumentNameCell, closeSellCall1);
        runIfCellNotEmpty(closeSellPut1InstrumentNameCell, closeSellPut1);
        runIfCellNotEmpty(closeBuyCall2InstrumentNameCell, closeBuyCall2);
        runIfCellNotEmpty(closeBuyPut2InstrumentNameCell, closeBuyPut2);
        runIfCellNotEmpty(closeSellCall2InstrumentNameCell, closeSellCall2);
        runIfCellNotEmpty(closeSellPut2InstrumentNameCell, closeSellPut2);
        sendTextToTelegramWithNotification(chats.runWithTelegram, 'Loss: ' + calcPnlTotalFuture(pullIndexPriceDeribit(), getPosition1(), 0));
        deleteTrigger('closePositionAuto');
    }
    updateOrdersAndPositions();
}

function sizeCheck() {
    return checkCall(openBuyCall1InstrumentNameCell)
        && checkCall(openSellCall1InstrumentNameCell)
        && checkCall(openBuyCall2InstrumentNameCell)
        && checkCall(openSellCall2InstrumentNameCell)
        && checkPut(openBuyPut1InstrumentNameCell)
        && checkPut(openSellPut1InstrumentNameCell)
        && checkPut(openBuyPut2InstrumentNameCell)
        && checkPut(openSellPut2InstrumentNameCell);
}

function checkCall(instrumentNameCell) {
    let instrumentName = getDataFrom(instrumentNameCell);
    if (instrumentName) {
        let openBuyCallAskDeribit = pullAskDeribit(instrumentName);
        let callSize = getDataFrom(resultCallSizeCell);
        return openBuyCallAskDeribit.size >= callSize;
    }
    return true;
}

function checkPut(instrumentNameCell) {
    let instrumentName = getDataFrom(instrumentNameCell);
    if (instrumentName) {
        let openBuyPutAskDeribit = pullAskDeribit(instrumentName);
        let putPrice = getDataFrom(resultPutOptionCell);
        let putSize = getDataFrom(resultPutSizeCell);
        return openBuyPutAskDeribit.size >= putSize;
    }
    return true;
}

function pullAskDeribit(instrumentName) {
    var data = pullDataFrom(getServerAddress() + "/api/v2/public/get_order_book?instrument_name=" + instrumentName);
    return {
        price: data.result['asks'][0][0],
        size: data.result['asks'][0][1]
    };
}

function runIfCellNotEmpty(cell, openFunction) {
    if (getDataFrom(cell))
        openFunction();
}

function openBuyCall1() {
    let options = getOptionsFromSheet(openBuyCall1InstrumentNameCell, openBuyCall1AmountCell, openBuyCall1TypeCell, openBuyCall1LabelCell, openBuyCall1PriceCell, openBuyCall1TimeInForceCell, openBuyCall1MaxShowCell, openBuyCall1PostOnlyCell, openBuyCall1RejectPostOnlyCell, openBuyCall1ReduceOnlyCell, openBuyCall1StopPriceCell, openBuyCall1TriggerCell, openBuyCall1AdvancedCell, openBuyCall1MmpCell);
    buy(options);
}

function openBuyPut1() {
    let options = getOptionsFromSheet(openBuyPut1InstrumentNameCell, openBuyPut1AmountCell, openBuyPut1TypeCell, openBuyPut1LabelCell, openBuyPut1PriceCell, openBuyPut1TimeInForceCell, openBuyPut1MaxShowCell, openBuyPut1PostOnlyCell, openBuyPut1RejectPostOnlyCell, openBuyPut1ReduceOnlyCell, openBuyPut1StopPriceCell, openBuyPut1TriggerCell, openBuyPut1AdvancedCell, openBuyPut1MmpCell);
    buy(options);
}

function openSellCall1() {
    let options = getOptionsFromSheet(openSellCall1InstrumentNameCell, openSellCall1AmountCell, openSellCall1TypeCell, openSellCall1LabelCell, openSellCall1PriceCell, openSellCall1TimeInForceCell, openSellCall1MaxShowCell, openSellCall1PostOnlyCell, openSellCall1RejectPostOnlyCell, openSellCall1ReduceOnlyCell, openSellCall1StopPriceCell, openSellCall1TriggerCell, openSellCall1AdvancedCell, openSellCall1MmpCell);
    sell(options);
}

function openSellPut1() {
    let options = getOptionsFromSheet(openSellPut1InstrumentNameCell, openSellPut1AmountCell, openSellPut1TypeCell, openSellPut1LabelCell, openSellPut1PriceCell, openSellPut1TimeInForceCell, openSellPut1MaxShowCell, openSellPut1PostOnlyCell, openSellPut1RejectPostOnlyCell, openSellPut1ReduceOnlyCell, openSellPut1StopPriceCell, openSellPut1TriggerCell, openSellPut1AdvancedCell, openSellPut1MmpCell);
    sell(options);
}

function closeBuyCall1() {
    let options = getOptionsFromSheet(closeBuyCall1InstrumentNameCell, closeBuyCall1AmountCell, closeBuyCall1TypeCell, closeBuyCall1LabelCell, closeBuyCall1PriceCell, closeBuyCall1TimeInForceCell, closeBuyCall1MaxShowCell, closeBuyCall1PostOnlyCell, closeBuyCall1RejectPostOnlyCell, closeBuyCall1ReduceOnlyCell, closeBuyCall1StopPriceCell, closeBuyCall1TriggerCell, closeBuyCall1AdvancedCell, closeBuyCall1MmpCell);
    buy(options);
}

function closeBuyPut1() {
    let options = getOptionsFromSheet(closeBuyPut1InstrumentNameCell, closeBuyPut1AmountCell, closeBuyPut1TypeCell, closeBuyPut1LabelCell, closeBuyPut1PriceCell, closeBuyPut1TimeInForceCell, closeBuyPut1MaxShowCell, closeBuyPut1PostOnlyCell, closeBuyPut1RejectPostOnlyCell, closeBuyPut1ReduceOnlyCell, closeBuyPut1StopPriceCell, closeBuyPut1TriggerCell, closeBuyPut1AdvancedCell, closeBuyPut1MmpCell);
    buy(options);
}

function closeSellCall1() {
    let options = getOptionsFromSheet(closeSellCall1InstrumentNameCell, closeSellCall1AmountCell, closeSellCall1TypeCell, closeSellCall1LabelCell, closeSellCall1PriceCell, closeSellCall1TimeInForceCell, closeSellCall1MaxShowCell, closeSellCall1PostOnlyCell, closeSellCall1RejectPostOnlyCell, closeSellCall1ReduceOnlyCell, closeSellCall1StopPriceCell, closeSellCall1TriggerCell, closeSellCall1AdvancedCell, closeSellCall1MmpCell);
    sell(options);
}

function closeSellPut1() {
    let options = getOptionsFromSheet(closeSellPut1InstrumentNameCell, closeSellPut1AmountCell, closeSellPut1TypeCell, closeSellPut1LabelCell, closeSellPut1PriceCell, closeSellPut1TimeInForceCell, closeSellPut1MaxShowCell, closeSellPut1PostOnlyCell, closeSellPut1RejectPostOnlyCell, closeSellPut1ReduceOnlyCell, closeSellPut1StopPriceCell, closeSellPut1TriggerCell, closeSellPut1AdvancedCell, closeSellPut1MmpCell);
    sell(options);
}

function openBuyCall2() {
    let options = getOptionsFromSheet(openBuyCall2InstrumentNameCell, openBuyCall2AmountCell, openBuyCall2TypeCell, openBuyCall2LabelCell, openBuyCall2PriceCell, openBuyCall2TimeInForceCell, openBuyCall2MaxShowCell, openBuyCall2PostOnlyCell, openBuyCall2RejectPostOnlyCell, openBuyCall2ReduceOnlyCell, openBuyCall2StopPriceCell, openBuyCall2TriggerCell, openBuyCall2AdvancedCell, openBuyCall2MmpCell);
    buy(options);
}

function openBuyPut2() {
    let options = getOptionsFromSheet(openBuyPut2InstrumentNameCell, openBuyPut2AmountCell, openBuyPut2TypeCell, openBuyPut2LabelCell, openBuyPut2PriceCell, openBuyPut2TimeInForceCell, openBuyPut2MaxShowCell, openBuyPut2PostOnlyCell, openBuyPut2RejectPostOnlyCell, openBuyPut2ReduceOnlyCell, openBuyPut2StopPriceCell, openBuyPut2TriggerCell, openBuyPut2AdvancedCell, openBuyPut2MmpCell);
    buy(options);
}

function openSellCall2() {
    let options = getOptionsFromSheet(openSellCall2InstrumentNameCell, openSellCall2AmountCell, openSellCall2TypeCell, openSellCall2LabelCell, openSellCall2PriceCell, openSellCall2TimeInForceCell, openSellCall2MaxShowCell, openSellCall2PostOnlyCell, openSellCall2RejectPostOnlyCell, openSellCall2ReduceOnlyCell, openSellCall2StopPriceCell, openSellCall2TriggerCell, openSellCall2AdvancedCell, openSellCall2MmpCell);
    sell(options);
}

function openSellPut2() {
    let options = getOptionsFromSheet(openSellPut2InstrumentNameCell, openSellPut2AmountCell, openSellPut2TypeCell, openSellPut2LabelCell, openSellPut2PriceCell, openSellPut2TimeInForceCell, openSellPut2MaxShowCell, openSellPut2PostOnlyCell, openSellPut2RejectPostOnlyCell, openSellPut2ReduceOnlyCell, openSellPut2StopPriceCell, openSellPut2TriggerCell, openSellPut2AdvancedCell, openSellPut2MmpCell);
    sell(options);
}

function closeBuyCall2() {
    let options = getOptionsFromSheet(closeBuyCall2InstrumentNameCell, closeBuyCall2AmountCell, closeBuyCall2TypeCell, closeBuyCall2LabelCell, closeBuyCall2PriceCell, closeBuyCall2TimeInForceCell, closeBuyCall2MaxShowCell, closeBuyCall2PostOnlyCell, closeBuyCall2RejectPostOnlyCell, closeBuyCall2ReduceOnlyCell, closeBuyCall2StopPriceCell, closeBuyCall2TriggerCell, closeBuyCall2AdvancedCell, closeBuyCall2MmpCell);
    buy(options);
}

function closeBuyPut2() {
    let options = getOptionsFromSheet(closeBuyPut2InstrumentNameCell, closeBuyPut2AmountCell, closeBuyPut2TypeCell, closeBuyPut2LabelCell, closeBuyPut2PriceCell, closeBuyPut2TimeInForceCell, closeBuyPut2MaxShowCell, closeBuyPut2PostOnlyCell, closeBuyPut2RejectPostOnlyCell, closeBuyPut2ReduceOnlyCell, closeBuyPut2StopPriceCell, closeBuyPut2TriggerCell, closeBuyPut2AdvancedCell, closeBuyPut2MmpCell);
    buy(options);
}

function closeSellCall2() {
    let options = getOptionsFromSheet(closeSellCall2InstrumentNameCell, closeSellCall2AmountCell, closeSellCall2TypeCell, closeSellCall2LabelCell, closeSellCall2PriceCell, closeSellCall2TimeInForceCell, closeSellCall2MaxShowCell, closeSellCall2PostOnlyCell, closeSellCall2RejectPostOnlyCell, closeSellCall2ReduceOnlyCell, closeSellCall2StopPriceCell, closeSellCall2TriggerCell, closeSellCall2AdvancedCell, closeSellCall2MmpCell);
    sell(options);
}

function closeSellPut2() {
    let options = getOptionsFromSheet(closeSellPut2InstrumentNameCell, closeSellPut2AmountCell, closeSellPut2TypeCell, closeSellPut2LabelCell, closeSellPut2PriceCell, closeSellPut2TimeInForceCell, closeSellPut2MaxShowCell, closeSellPut2PostOnlyCell, closeSellPut2RejectPostOnlyCell, closeSellPut2ReduceOnlyCell, closeSellPut2StopPriceCell, closeSellPut2TriggerCell, closeSellPut2AdvancedCell, closeSellPut2MmpCell);
    sell(options);
}

function getOptionsFromSheet(instrumentNameCell, amountCell, typeCell, labelCell, priceCell, timeInForceCell, maxShowCell, postOnlyCell, rejectPostOnlyCell, reduceOnlyCell, stopPriceCell, triggerCell, advancedCell, mmpCell) {
    return {
        instrumentName: getDataFrom(instrumentNameCell),
        amount: getDataFrom(amountCell),
        type: getDataFrom(typeCell),
        label: getDataFrom(labelCell),
        price: getDataFrom(priceCell),
        timeInForce: getDataFrom(timeInForceCell),
        maxShow: getDataFrom(maxShowCell),
        postOnly: getDataFrom(postOnlyCell),
        rejectPostOnly: getDataFrom(rejectPostOnlyCell),
        reduceOnly: getDataFrom(reduceOnlyCell),
        stopPrice: getDataFrom(stopPriceCell),
        trigger: getDataFrom(triggerCell),
        advanced: getDataFrom(advancedCell),
        mmp: getDataFrom(mmpCell)
    };
}

function sendPrivateRequest(url) {
    let tokenData = pullDataFrom(tokenUrl).result;
    return sendRequest(url, tokenData);
}

function getAccountSummary() {
    let accountSummaryUrl = "https://www.deribit.com/api/v2/private/get_account_summary?currency=BTC";
    let accountSummary = sendPrivateRequest(accountSummaryUrl).result;
    let indexPriceDeribit = pullIndexPriceDeribit();
    return {
        balance: accountSummary.balance * indexPriceDeribit,
        available_withdrawal_funds: accountSummary.available_withdrawal_funds * indexPriceDeribit,
        margin_balance: accountSummary.margin_balance * indexPriceDeribit
    };
}

function buy(options) {
    let buyUrl = getBuyUrl(options);
    sendPrivateRequest(buyUrl);
}

function sell(options) {
    let sellUrl = getSellUrl(options);
    sendPrivateRequest(sellUrl);
}

function getSellUrl(options) {
    let sellUrl = getServerAddress() + '/api/v2/private/sell?';
    return getUrl(sellUrl, options);
}

function getBuyUrl(options) {
    let buyUrl = getServerAddress() + '/api/v2/private/buy?';
    return getUrl(buyUrl, options);
}

function getUrl(url, options) {
    url += 'instrument_name=' + options.instrumentName;

    function addField(name, value) {
        if (value) {
            url += '&' + name + '=' + value;
        }
    }

    addField('type', options.type);
    addField('label', options.label);
    addField('price', options.price);
    addField('amount', options.amount);
    addField('time_in_force', options.timeInForce);
    addField('post_only', options.postOnly);
    addField('reject_post_only', options.rejectPostOnly);
    addField('max_show', options.maxShow);
    addField('reduce_only', options.reduceOnly);
    addField('stop_price', options.stopPrice);
    addField('trigger', options.trigger);
    addField('advanced', options.advanced);
    addField('mmp', options.mmp);
    return url;
}

function sendRequest(url, tokenData) {
    var plusOptions = {
        "headers": {
            "Authorization": "Bearer " + tokenData.access_token
        }
    };
    var plusResponse = UrlFetchApp.fetch(url, plusOptions);
    return Utilities.jsonParse(plusResponse.getContentText());
}

function binanceSpotWallet() {
    let plusOptions = {
        "headers": {
            "X-MBX-APIKEY": "nEneTAzZjtrayjvfD3cZ98DpEYjPKIOlH34Qj8TP9FoDni3Sl9LE9eARCHvzPDpV"
        }
    };
    let timeStamp = ("" + getDataFrom('AltCoins!A1')).split('.')[0];
    let url = 'https://api.binance.com/sapi/v1/accountSnapshot?timestamp=' + timeStamp + "&type=SPOT";
    let plusResponse = UrlFetchApp.fetch(url, plusOptions);
    let data = Utilities.jsonParse(plusResponse.getContentText());

}