function updatePositionsAndSendToTelegram() {
    updatePositions();
    sendPositionsToTelegram();
}

function sendPositionsToTelegram() {
    let positions = getPositionsToString();
    sendTextToTelegramWithoutNotification(positions);
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

function sendTextToTelegramWithoutNotification(text) {
    UrlFetchApp.fetch("https://api.telegram.org/bot" + botSecret + "/sendMessage?text=" + encodeURIComponent(text) + "&chat_id=" + chatId + "&parse_mode=HTML&disable_notification=true");
}

function sendTextToTelegramWithNotification(text) {
    UrlFetchApp.fetch("https://api.telegram.org/bot" + botSecret + "/sendMessage?text=" + encodeURIComponent(text) + "&chat_id=" + chatId + "&parse_mode=HTML");
}

function getLastMessage() {
    var result = pullDataFrom("https://api.telegram.org/bot" + botSecret + "/getUpdates").result;
    return result[result.length - 1].message;
}

function getLastMessageText() {
    return getLastMessage().text;
}

function isLastMessage(expectedMessage) {
    return getLastMessageText().toUpperCase() === expectedMessage.toUpperCase();
}

function getLastMessageDate() {
    return getLastMessage().date;
}

function isLastMessageInLast1Min() {
    let now = new Date();
    now.setMinutes(now.getMinutes() - 1);
    return getLastMessageDate() < now;
}

function closeIfLastMessageIsClose() {
    if (isLastMessage("Close")) {
        sendTextToTelegramWithNotification("Do you want to close? Type Yes in 4 sec");
        Utilities.sleep(4000);
        if (isLastMessageInLast1Min() && isLastMessage("Yes")) {
            // closePosition();
            sendPositionsToTelegram();
            sendTextToTelegramWithNotification("Close Position triggered");
        }
    }
}


