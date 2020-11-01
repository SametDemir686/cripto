async function pullIndexPrice(getUrl, properties, name) {
    var url = "https://www.deribit.com/api/v2/" + getUrl + "?" + properties;
    let data = await (await fetch(url)).json();
    indexBtc = data.result[name];
}

async function pullMoveStrk() {
    let instrumentName = document.getElementById("ftxMove").value;
    var url = "https://ftx.com/api/futures/" + instrumentName + "/stats";
    let data = await (await fetch(url)).json();
    let resultData = data.result['strikePrice'];
    console.log("Move Strike Price", resultData);
    moveStrikePrice = resultData;
}

async function pullPut() {
    let instrumentName = document.getElementById("put").value;
    var url = "https://www.deribit.com/api/v2/public/get_order_book?instrument_name=" + instrumentName;
    let data = await (await fetch(url)).json();
    let resultAsks = data.result['asks'];
    putAsk = resultAsks[0][0] * entry;
    putAskPosSize = resultAsks[0][1];
    await console.log("Put Ask", putAsk);
}

async function pullCall() {
    let instrumentName = document.getElementById("call").value;
    var url = "https://www.deribit.com/api/v2/public/get_order_book?instrument_name=" + instrumentName;
    let data = await (await fetch(url)).json();
    let resultAsks = data.result['asks'];
    callAsk = resultAsks[0][0] * entry;
    callAskPosSize = resultAsks[0][1];
    await console.log("Call Ask", callAsk);
}

async function pullMovePrice() {
    let instrumentName = document.getElementById("ftxMove").value;
    var url = "https://ftx.com/api/futures/" + instrumentName + "/orderbook";
    let data = await (await fetch(url)).json();
    let resultData = data.result['asks'][0][0];
    console.log("Move Price", resultData);
    movePrice = resultData;
}

async function pullEntry() {
    var url = "https://ftx.com/api/futures/BTC-PERP";
    let data = await (await fetch(url)).json();
    let resultData = data.result['index'];
    console.log("Index", resultData);
    entry = resultData;
}

async function pullJSON() {
    await pullEntry();
    await pullIndexPrice("public/get_index_price", "index_name=btc_usd", 'index_price');
    await pullCall();
    await pullPut();
    await pullMoveStrk();
    await pullMovePrice();
}