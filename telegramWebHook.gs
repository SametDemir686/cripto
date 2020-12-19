var token = "1439106550:AAGqH87pMb9Fy0i8OZLZOS5Db13vQN3QDww"; // FILL IN YOUR OWN TOKEN
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "https://script.google.com/macros/s/AKfycbwWYT3AJmfrCgzLYjh6hWwOYccv2FZh2p0YbarL7w/exec"; // FILL IN YOUR GOOGLE WEB APP ADDRESS

function getMe() {
    var url = telegramUrl + "/getMe";
    var response = UrlFetchApp.fetch(url);
    Logger.log(response.getContentText());
}

function setWebhook() {
    var url = telegramUrl + "/setWebhook?url=" + webAppUrl + "&drop_pending_updates=true";
    var response = UrlFetchApp.fetch(url);
    Logger.log(response.getContentText());
}

function sendText(id, text) {
    var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + text;
    var response = UrlFetchApp.fetch(url);
    Logger.log(response.getContentText());
}

function doGet(e) {
    return HtmlService.createHtmlOutput("Hi there");
}

function doPost(e) {
    try {
        switch (JSON.parse(e.postData.contents).message.text.toUpperCase()) {
            case "CLOSE":
                closeIfLastMessageIsClose();
                break;
            case "RUN":
                runWithTelegram();
                break;
            case "BTC":
                let btcPriceNow = pullIndexPriceDeribit();
                sendTextToTelegramWithNotification(chats.runWithTelegram, btcPriceNow);
                break;
            case "POSITION":
                updatePositionsAndSendToTradeEmin();
                break;
        }
    } catch (e) {
        sendTextToTelegramWithNotification(chats.runWithTelegram, 'UNKNOWN ERROR!!');
    }
    sendTextToTelegramWithNotification(chats.runWithTelegram, '  Type "Run" to start \n Type "Close" to close your open position \n Type "Btc" to check BTC price  \n Type "Position" to check your postion PNL ');
    setWebhook();
}



