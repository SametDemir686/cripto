function updatePositionsAndSendToTelegram() {
    updatePositions();
    sendPositionsToTelegram();
}

function sendPositionsToTelegram() {
    let positions = getPositionsToString();
    sendTextToTelegramWithoutNotification(chats.tradeEmin, positions);
}

function getPositionsToString() {
    let values = SpreadsheetApp.getActiveSheet().getRange("Trade!B105:E105").getValues();
    let text = "";
    for (let i = 0; i < values[0].length; i++) {
        let value = values[0][i];
        text += "Position " + (i + 1) + ": " + value + "\n";
    }
    return text;
}

function sendTextToTelegramWithoutNotification(chat, text) {
    UrlFetchApp.fetch("https://api.telegram.org/bot" + chat.botSecret + "/sendMessage?text=" + encodeURIComponent(text) + "&chat_id=" + chat.chatId + "&parse_mode=HTML&disable_notification=true");
}

function sendTextToTelegramWithNotification(chat, text) {
    UrlFetchApp.fetch("https://api.telegram.org/bot" + chat.botSecret + "/sendMessage?text=" + encodeURIComponent(text) + "&chat_id=" + chat.chatId + "&parse_mode=HTML");
}

function getLastMessage(chat) {
    var result = pullDataFrom("https://api.telegram.org/bot" + chat.botSecret + "/getUpdates").result;
    return result[result.length - 1].message;
}

function getLastMessageText(chat) {
    return getLastMessage(chat).text;
}

function isLastMessage(chat, expectedMessage) {
    return getLastMessageText(chat).toUpperCase() === expectedMessage.toUpperCase();
}

function getLastMessageDate(chat) {
    return getLastMessage(chat).date;
}

function closeIfLastMessageIsClose() {
    if (isLastMessage(chats.alertEmin, "Close")) {
        sendTextToTelegramWithNotification(chats.alertEmin, "Do you want to close? Type Yes in 4 sec");
        Utilities.sleep(4000);
        if (isLastMessage(chats.alertEmin, "Yes")) {
            // closePosition();
            sendPositionsToTelegram();
            sendTextToTelegramWithNotification(chats.alertEmin, "Close Position triggered");
        }
    }
}


