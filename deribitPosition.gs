function buyCall() {
    let options = getOptionsFromSheet(buyCallInstrumentNameCell, buyCallAmountCell, buyCallTypeCell, buyCallLabelCell, buyCallPriceCell, buyCallTimeInForceCell, buyCallMaxShowCell, buyCallPostOnlyCell, buyCallRejectPostOnlyCell, buyCallReduceOnlyCell, buyCallStopPriceCell, buyCallTriggerCell, buyCallAdvancedCell, buyCallMmpCell);
    buy(options);
}

function buyPut() {
    let options = getOptionsFromSheet(buyPutInstrumentNameCell, buyPutAmountCell, buyPutTypeCell, buyPutLabelCell, buyPutPriceCell, buyPutTimeInForceCell, buyPutMaxShowCell, buyPutPostOnlyCell, buyPutRejectPostOnlyCell, buyPutReduceOnlyCell, buyPutStopPriceCell, buyPutTriggerCell, buyPutAdvancedCell, buyPutMmpCell);
    buy(options);
}

function sellCall() {
    let options = getOptionsFromSheet(sellCallInstrumentNameCell, sellCallAmountCell, sellCallTypeCell, sellCallLabelCell, sellCallPriceCell, sellCallTimeInForceCell, sellCallMaxShowCell, sellCallPostOnlyCell, sellCallRejectPostOnlyCell, sellCallReduceOnlyCell, sellCallStopPriceCell, sellCallTriggerCell, sellCallAdvancedCell, sellCallMmpCell);
    sell(options);
}

function sellPut() {
    let options = getOptionsFromSheet(sellPutInstrumentNameCell, sellPutAmountCell, sellPutTypeCell, sellPutLabelCell, sellPutPriceCell, sellPutTimeInForceCell, sellPutMaxShowCell, sellPutPostOnlyCell, sellPutRejectPostOnlyCell, sellPutReduceOnlyCell, sellPutStopPriceCell, sellPutTriggerCell, sellPutAdvancedCell, sellPutMmpCell);
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
