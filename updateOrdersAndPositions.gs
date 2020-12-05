function updateOrdersAndPositions() {
    updateOrders();
    updatePositions();
}

function updatePositions() {
    clearPositions();
    writePositions();
}

function updateOrders() {
    clearOrders();
    writeOrders();
}

function cancelOrders() {
    let tokenData = pullDataFrom(tokenUrl).result;
    let cancelUrl = 'https://test.deribit.com/api/v2/private/cancel_all';
    sendRequest(cancelUrl, tokenData);
    updateOrders();
}

function clearOrders() {
    SpreadsheetApp.getActive().getSheetByName('Trade').getRange('G86:J105').clear({
        contentsOnly: true,
        skipFilteredRows: false
    });
}

function clearPositions() {
    SpreadsheetApp.getActive().getSheetByName('Trade').getRange('B86:E104').clear({
        contentsOnly: true,
        skipFilteredRows: false
    });
}

function transpose(array) {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

function getDataToBeWrittenOrders(data) {
    let dataToBeWritten = [];

    function extracted(number) {
        if (data.result.length > number) {
            let res = data.result[number];
            dataToBeWritten.push([res.time_in_force, res.reduce_only, res.profit_loss, res.price, res.post_only, res.order_type, res.order_state, res.order_id, res.max_show, res.last_update_timestamp, res.label, res.is_liquidation, res.instrument_name, res.filled_amount, res.direction, res.creation_timestamp, res.commission, res.average_price, res.api, res.amount]);
        } else {
            dataToBeWritten.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
        }
    }

    extracted(0);
    extracted(1);
    extracted(2);
    extracted(3);


    return transpose(dataToBeWritten);
}

function writeOrders() {
    let tokenData = pullDataFrom(tokenUrl).result;
    let url = 'https://test.deribit.com/api/v2/private/get_open_orders_by_currency?currency=BTC&kind=option&type=all';
    let plusOptions = {
        "headers": {
            "Authorization": "Bearer " + tokenData.access_token
        }
    };
    let plusResponse = UrlFetchApp.fetch(url, plusOptions);
    let data = Utilities.jsonParse(plusResponse.getContentText());
    let dataToBeWritten = getDataToBeWrittenOrders(data);

    SpreadsheetApp.getActive().getSheetByName('Trade').getRange('G86:J105').setValues(dataToBeWritten);
}

function getDataToBeWrittenPositions(data) {
    let filteredData = [];
    for (let i = 0; i < data.result.length; i++) {
        if (data.result[i].size !== 0) {
            filteredData.push(data.result[i]);
        }
    }
    let dataToBeWritten = [];

    function extracted(number) {
        if (filteredData.length > number) {
            let res = filteredData[number];
            dataToBeWritten.push([res.average_price, res.delta, res.direction, res.estimated_liquidation_price, res.floating_profit_loss, res.index_price, res.initial_margin, res.instrument_name, res.kind, res.leverage, res.maintenance_margin, res.mark_price, res.open_orders_margin, res.realized_funding, res.realized_profit_loss, res.settlement_price, res.size, res.size_currency, res.total_profit_loss]);
        } else {
            dataToBeWritten.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
        }
    }

    extracted(0);
    extracted(1);
    extracted(2);
    extracted(3);

    return transpose(dataToBeWritten);
}

function writePositions() {
    let tokenData = pullDataFrom(tokenUrl).result;
    let url = 'https://test.deribit.com/api/v2/private/get_positions?currency=BTC&kind=option';
    let plusOptions = {
        "headers": {
            "Authorization": "Bearer " + tokenData.access_token
        }
    };
    let plusResponse = UrlFetchApp.fetch(url, plusOptions);
    let data = Utilities.jsonParse(plusResponse.getContentText());

    let dataToBeWritten = getDataToBeWrittenPositions(data);

    SpreadsheetApp.getActive().getSheetByName('Trade').getRange('B86:E104').setValues(dataToBeWritten);
}
