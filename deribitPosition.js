//

function buy() {
    let instrument_name = getDataFrom(buyInstrumentNameCell);
    let amount = getDataFrom(buyAmountCell);
    let type = getDataFrom(buyTypeCell);
    let label = getDataFrom(buyLabelCell);
    let price = getDataFrom(buyPriceCell);
    let time_in_force = getDataFrom(buyTimeInForceCell);
    let post_only = getDataFrom(buyPostOnlyCell);
    let reject_post_only = getDataFrom(buyRejectPostOnlyCell);
    let max_show = getDataFrom(buyMaxShowCell);
    let reduce_only = getDataFrom(buyReduceOnlyCell);
    let stop_price = getDataFrom(buyStopPriceCell);
    let trigger = getDataFrom(buyTriggerCell);
    let advanced = getDataFrom(buyAdvancedCell);
    let mmp = getDataFrom(buyMmpCell);

    let client_secret = "8--w-5ibx5TGv8qWz1X4i2gL8Bx5Y1G1kDOI4WEEuz0";
    let client_id = "twrAu34G";
    let tokenData = "https://www.deribit.com/api/v2/public/auth?client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=client_credentials";

    let buyUrl = 'https://www.deribit.com/api/v2/private/buy?' +
        'instrument_name=' + instrument_name +
        '&amount=' + amount +
        '&type=' + type +
        '&label=' + label +
        '&price=' + price +
        '&time_in_force=' + time_in_force +
        '&post_only=' + post_only +
        '&reject_post_only=' + reject_post_only +
        '&max_show=' + max_show +
        '&reduce_only=' + reduce_only +
        '&stop_price=' + stop_price +
        '&trigger=' + trigger +
        '&advanced=' + advanced +
        '&mmp=' + mmp;
    sendRequest(buyUrl, tokenData);
}

function sell() {

}

function sendRequest(url, tokenData) {
    var plusOptions = {
        "headers" : {
            "Authorization" : "Bearer " + tokenData.access_token,
            'method' : 'post'
        }
    };
    var plusResponse = UrlFetchApp.fetch(
        "https://www.googleapis.com/plus/v1/people/me", plusOptions);
    //var plusData = Utilities.jsonParse(plusResponse.getContentText());
}