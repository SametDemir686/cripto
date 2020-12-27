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

function pullIndexPriceDeribit() {
    let data = pullDataFrom(getServerAddress() + "/api/v2/public/get_index_price?index_name=btc_usd");
    return data.result['index_price'];
}

function pullCall_IV(callInstrumentName) {
    var data = pullDataFrom(getServerAddress() + "/api/v2/public/get_order_book?instrument_name=" + callInstrumentName);
    return data.result['mark_iv'];
}

function pullPut_IV(putInstrumentName) {
    var data = pullDataFrom(getServerAddress() + "/api/v2/public/get_order_book?instrument_name=" + putInstrumentName);
    return data.result['mark_iv'];
}

function pullMarkPrice(instrumentName) {
    return pullDataFrom(getServerAddress() + "/api/v2/public/get_order_book?instrument_name=" + instrumentName).result['mark_price'];
}

function pullCall_MarkPrice(callInstrumentName) {
    var markPrice = pullMarkPrice(callInstrumentName);
    writeDataTo(CallMarkPrice, markPrice);
}

function pullPut_MarkPrice(putInstrumentName) {
    var markPrice = pullMarkPrice(putInstrumentName);
    writeDataTo(PutMarkPrice, markPrice);
}

function pullMoveStrikePriceFtx() {
    let instrumentName = getDataFrom(moveInstrumentNameFtxCell);
    var data = pullDataFrom("https://ftx.com/api/futures/" + instrumentName + "/stats");
    writeDataTo(resultMoveStrikePriceCell, data.result['strikePrice']);
}

function pullPricesDeribit(instrumentName) {
    var data = pullOrderBook(instrumentName);
    return {
        markPrice: pullMarkPrice(instrumentName),
        asks: getAsks(data, 1),
        bids: getBids(data, 1),
        indexPrice: pullIndexPriceDeribit()
    };
}

function pullMoveAskPriceFtx() {
    let instrumentName = getDataFrom(moveInstrumentNameFtxCell);
    var data = pullDataFrom("https://ftx.com/api/futures/" + instrumentName + "/orderbook");
    writeDataTo(resultMovePriceCell, data.result['asks']);
}

function pullAskSizeDeribit(instrumentName) {
    var data = pullDataFrom(getServerAddress() + "/api/v2/public/get_order_book?instrument_name=" + instrumentName);
    return data.result['asks'][0][1];
}

function pullBidSizeDeribit(instrumentName) {
    var data = pullDataFrom(getServerAddress() + "/api/v2/public/get_order_book?instrument_name=" + instrumentName);
    return data.result['bids'][0][1];
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