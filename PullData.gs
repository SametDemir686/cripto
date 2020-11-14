
function pullJSON() {
    pullIndexPriceDeribitAndWrite();
    pullMoveStrikePriceFtx();
    pullMoveAskPriceFtx();
}

function pullDataFrom(url) {
    var response = UrlFetchApp.fetch(url);
    return JSON.parse(response.getContentText());
}

function writeDataTo(writeTo, data) {
    SpreadsheetApp.getActiveSheet().getRange(writeTo).setValue(data);
}


function getDataFrom(getFrom) {
    return SpreadsheetApp.getActiveSheet().getRange(getFrom).getValue();
}

function pullIndexPriceDeribitAndWrite() {
    var data = pullDataFrom("https://www.deribit.com/api/v2/public/get_index_price?index_name=btc_usd");
    writeDataTo(resultIndexBtcDeribitCell, data.result['index_price']);
}

function pullCall_IV(callInstrumentName) {
    var data = pullDataFrom("https://www.deribit.com/api/v2/public/get_order_book?instrument_name=" + callInstrumentName);
    return data.result['mark_iv'];
}

function pullPut_IV(putInstrumentName) {
    var data = pullDataFrom("https://www.deribit.com/api/v2/public/get_order_book?instrument_name=" + putInstrumentName);
    return data.result['mark_iv'];
}

function pullMoveStrikePriceFtx() {
    let instrumentName = getDataFrom(moveInstrumentNameFtxCell);
    var data = pullDataFrom("https://ftx.com/api/futures/" + instrumentName + "/stats");
    writeDataTo(resultMoveStrikePriceCell, data.result['strikePrice']);
}

function pullMoveAskPriceFtx() {
    let instrumentName = getDataFrom(moveInstrumentNameFtxCell);
    var data = pullDataFrom("https://ftx.com/api/futures/" + instrumentName + "/orderbook");
    writeDataTo(resultMovePriceCell, data.result['asks']);
}


