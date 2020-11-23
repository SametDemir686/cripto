function openPosition() {
    if (sizePriceCheck()) {
        runIfCellNotEmpty(openBuyCallInstrumentNameCell, openBuyCall);
        runIfCellNotEmpty(openBuyPutInstrumentNameCell, openBuyPut);
        runIfCellNotEmpty(openSellCallInstrumentNameCell, openSellCall);
        runIfCellNotEmpty(openSellPutInstrumentNameCell, openSellPut);
    }
}

function closePosition() {
    runIfCellNotEmpty(closeBuyCallInstrumentNameCell, closeBuyCall);
    runIfCellNotEmpty(closeBuyPutInstrumentNameCell, closeBuyPut);
    runIfCellNotEmpty(closeSellCallInstrumentNameCell, closeSellCall);
    runIfCellNotEmpty(closeSellPutInstrumentNameCell, closeSellPut);
}

function sizePriceCheck() {
    return checkCall(openBuyCallInstrumentNameCell)
        && checkCall(openSellCallInstrumentNameCell)
        && checkPut(openBuyPutInstrumentNameCell)
        && checkPut(openSellPutInstrumentNameCell);
}

function checkCall(instrumentNameCell) {
    let instrumentName = getDataFrom(instrumentNameCell);
    if (instrumentName) {
        let openBuyCallAskDeribit = pullAskDeribit(instrumentName);
        let callPrice = getDataFrom(resultCallOptionCell);
        let callSize = getDataFrom(resultCallSizeCell);
        return openBuyCallAskDeribit.price === callPrice && openBuyCallAskDeribit.size >= callSize;
    }
    return true;
}

function checkPut(instrumentNameCell) {
    let instrumentName = getDataFrom(instrumentNameCell);
    if (instrumentName) {
        let openBuyPutAskDeribit = pullAskDeribit(instrumentName);
        let putPrice = getDataFrom(resultPutOptionCell);
        let putSize = getDataFrom(resultPutSizeCell);
        return openBuyPutAskDeribit.price === putPrice && openBuyPutAskDeribit.size >= putSize;
    }
    return true;
}

function pullAskDeribit(instrumentName) {
    var data = pullDataFrom("https://www.deribit.com/api/v2/public/get_order_book?instrument_name=" + instrumentName);
    return {
        price: data.result['asks'][0][0],
        size: data.result['asks'][0][1]
    };
}

function runIfCellNotEmpty(cell, openFunction) {
    if (getDataFrom(cell))
        openFunction();
}

function openBuyCall() {
    let options = getOptionsFromSheet(openBuyCallInstrumentNameCell, openBuyCallAmountCell, openBuyCallTypeCell, openBuyCallLabelCell, openBuyCallPriceCell, openBuyCallTimeInForceCell, openBuyCallMaxShowCell, openBuyCallPostOnlyCell, openBuyCallRejectPostOnlyCell, openBuyCallReduceOnlyCell, openBuyCallStopPriceCell, openBuyCallTriggerCell, openBuyCallAdvancedCell, openBuyCallMmpCell);
    buy(options);
}

function openBuyPut() {
    let options = getOptionsFromSheet(openBuyPutInstrumentNameCell, openBuyPutAmountCell, openBuyPutTypeCell, openBuyPutLabelCell, openBuyPutPriceCell, openBuyPutTimeInForceCell, openBuyPutMaxShowCell, openBuyPutPostOnlyCell, openBuyPutRejectPostOnlyCell, openBuyPutReduceOnlyCell, openBuyPutStopPriceCell, openBuyPutTriggerCell, openBuyPutAdvancedCell, openBuyPutMmpCell);
    buy(options);
}

function openSellCall() {
    let options = getOptionsFromSheet(openSellCallInstrumentNameCell, openSellCallAmountCell, openSellCallTypeCell, openSellCallLabelCell, openSellCallPriceCell, openSellCallTimeInForceCell, openSellCallMaxShowCell, openSellCallPostOnlyCell, openSellCallRejectPostOnlyCell, openSellCallReduceOnlyCell, openSellCallStopPriceCell, openSellCallTriggerCell, openSellCallAdvancedCell, openSellCallMmpCell);
    sell(options);
}

function openSellPut() {
    let options = getOptionsFromSheet(openSellPutInstrumentNameCell, openSellPutAmountCell, openSellPutTypeCell, openSellPutLabelCell, openSellPutPriceCell, openSellPutTimeInForceCell, openSellPutMaxShowCell, openSellPutPostOnlyCell, openSellPutRejectPostOnlyCell, openSellPutReduceOnlyCell, openSellPutStopPriceCell, openSellPutTriggerCell, openSellPutAdvancedCell, openSellPutMmpCell);
    sell(options);
}

function closeBuyCall() {
    let options = getOptionsFromSheet(closeBuyCallInstrumentNameCell, closeBuyCallAmountCell, closeBuyCallTypeCell, closeBuyCallLabelCell, closeBuyCallPriceCell, closeBuyCallTimeInForceCell, closeBuyCallMaxShowCell, closeBuyCallPostOnlyCell, closeBuyCallRejectPostOnlyCell, closeBuyCallReduceOnlyCell, closeBuyCallStopPriceCell, closeBuyCallTriggerCell, closeBuyCallAdvancedCell, closeBuyCallMmpCell);
    buy(options);
}

function closeBuyPut() {
    let options = getOptionsFromSheet(closeBuyPutInstrumentNameCell, closeBuyPutAmountCell, closeBuyPutTypeCell, closeBuyPutLabelCell, closeBuyPutPriceCell, closeBuyPutTimeInForceCell, closeBuyPutMaxShowCell, closeBuyPutPostOnlyCell, closeBuyPutRejectPostOnlyCell, closeBuyPutReduceOnlyCell, closeBuyPutStopPriceCell, closeBuyPutTriggerCell, closeBuyPutAdvancedCell, closeBuyPutMmpCell);
    buy(options);
}

function closeSellCall() {
    let options = getOptionsFromSheet(closeSellCallInstrumentNameCell, closeSellCallAmountCell, closeSellCallTypeCell, closeSellCallLabelCell, closeSellCallPriceCell, closeSellCallTimeInForceCell, closeSellCallMaxShowCell, closeSellCallPostOnlyCell, closeSellCallRejectPostOnlyCell, closeSellCallReduceOnlyCell, closeSellCallStopPriceCell, closeSellCallTriggerCell, closeSellCallAdvancedCell, closeSellCallMmpCell);
    sell(options);
}

function closeSellPut() {
    let options = getOptionsFromSheet(closeSellPutInstrumentNameCell, closeSellPutAmountCell, closeSellPutTypeCell, closeSellPutLabelCell, closeSellPutPriceCell, closeSellPutTimeInForceCell, closeSellPutMaxShowCell, closeSellPutPostOnlyCell, closeSellPutRejectPostOnlyCell, closeSellPutReduceOnlyCell, closeSellPutStopPriceCell, closeSellPutTriggerCell, closeSellPutAdvancedCell, closeSellPutMmpCell);
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

function buy(options) {
    let tokenData = pullDataFrom(tokenUrl).result;
    let buyUrl = getBuyUrl(options);
    sendRequest(buyUrl, tokenData);
}

function sell(options) {
    let tokenData = pullDataFrom(tokenUrl).result;
    let sellUrl = getSellUrl(options);
    sendRequest(sellUrl, tokenData);
}

function getSellUrl(options) {
    let sellUrl = 'https://www.deribit.com/api/v2/private/sell?';
    return getUrl(sellUrl, options);
}

function getBuyUrl(options) {
    let buyUrl = 'https://www.deribit.com/api/v2/private/buy?';
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
    var plusData = Utilities.jsonParse(plusResponse.getContentText());
}
