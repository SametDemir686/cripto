function updatePositionsAndSendToTradeEmin() {
    updatePositionsAndSendToTelegram(chats.runWithTelegram);
}

function updatePositionsAndSendToTelegram(chat) {
    updatePositions();
    sendPositionsToTelegram(chat);
}

function sendPositionsToTelegram(chat) {
    let positions = getPositionsToString();
    sendTextToTelegramWithoutNotification(chat, positions);
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

function sendKeyboardToTelegram(chat, text, kokolo) {
    UrlFetchApp.fetch("https://api.telegram.org/bot" + chat.botSecret + "/sendMessage?text=" + encodeURIComponent(text) + "&chat_id=" + chat.chatId + "&parse_mode=HTML" + encodeURIComponent(JSON.stringify(text)));
}

function deleteWebhook(chat) {
    UrlFetchApp.fetch("https://api.telegram.org/bot" + chat.botSecret + "/deleteWebhook");
}

function getLastMessage(chat) {
    deleteWebhook(chat);
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
    if (isLastMessage(chats.runWithTelegram, "Close")) {
        sendTextToTelegramWithNotification(chats.runWithTelegram, "Do you want to close? Type Yes in 4 sec");
        Utilities.sleep(4000);
        if (isLastMessage(chats.runWithTelegram, "Yes")) {
            closePosition();
            sendPositionsToTelegram(chats.runWithTelegram);
            sendTextToTelegramWithNotification(chats.runWithTelegram, "Close Position triggered");
        }
    }
}


function getBestResultToString() {
    let values = SpreadsheetApp.getActiveSheet().getRange("Trade!A45:L45").getValues();
    let titleValues = SpreadsheetApp.getActiveSheet().getRange("Trade!A44:L44").getValues();
    let text = "";
    for (let i = 0; i < values[0].length; i++) {
        let value = values[0][i];
        let titleValue = titleValues[0][i];
        text += titleValue + ":" + value.toFixed(1) + "\n";
    }
    return text;


}

function getBestOptionsToString() {
    let values = SpreadsheetApp.getActiveSheet().getRange("Trade!B29:E29").getValues();
    let titleValues = SpreadsheetApp.getActiveSheet().getRange("Trade!B28:E28").getValues();
    let text = "";
    for (let i = 0; i < values[0].length; i++) {
        let value = values[0][i];
        let titleValue = titleValues[0][i];
        text += titleValue + ":" + value + "\n";
    }
    return text;
}


//function getOptionDatesAvailable() {
//  let values = SpreadsheetApp.getActiveSheet().getRange("Instruments!N9:9").getValues();
//  let text = "";
//  for (let i = 0; i < values[0].length; i++) {
//      let value = values[0][i];
//   text += value ;
//}

//  return text;
// }


//function sendOptionDatesToTelegram() {

//   let optionDates = getOptionDatesAvailable();


//sendKeyboardToTelegram(chats.runWithTelegram, optionDates)

//}

function sendBestResultToTelegram(chat) {
    let bestResult = getBestResultToString();
    sendTextToTelegramWithNotification(chats.runWithTelegram, bestResult);

    let bestOptions = getBestOptionsToString();
    sendTextToTelegramWithNotification(chats.runWithTelegram, bestOptions);

}

function waitForNextMessage() {
    var lastMessage = getLastMessage(chats.runWithTelegram);
    let newMessage = getLastMessage(chats.runWithTelegram);
    while (newMessage.date === lastMessage.date) {
        newMessage = getLastMessage(chats.runWithTelegram);
    }
    return newMessage.text.toUpperCase() === "STOP" ? -1 : 0;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getUniqueIntrumentNames() {
    let lastRow = findLastRow("Instruments!", 'A', 2);
    let values = transpose(SpreadsheetApp.getActiveSheet().getRange("Instruments!A2:A" + lastRow).getValues())[0].map(s => s.split('-')[1]).filter(onlyUnique);
    return transpose([values]);
}

function sendMessageWithKeyboard(chat, text, keyboard) {
    var reply_markup = {
        keyboard: keyboard,
        one_time_keyboard: true,
        resize_keyboard: true
    };
    UrlFetchApp.fetch("https://api.telegram.org/bot" + chat.botSecret + "/sendMessage?text=" + encodeURIComponent(text) +
        "&chat_id=" + chat.chatId +
        "&parse_mode=HTML" +
        "&reply_markup=" + encodeURIComponent(JSON.stringify(reply_markup)));
}

function f() {
    sendMessageWithKeyboard(chats.runWithTelegram, "Option date you want?", getUniqueIntrumentNames());
}

function runWithTelegram() {
    sendTextToTelegramWithNotification(chats.runWithTelegram, 'How much money do you want to invest in?');
    if (waitForNextMessage() === -1) return;
    writeDataTo('Trade!B18', getLastMessage(chats.runWithTelegram).text);

    sendTextToTelegramWithNotification(chats.runWithTelegram, 'Bullish change percentage?');
    if (waitForNextMessage() === -1) return;
    writeDataTo('Trade!K25', getLastMessage(chats.runWithTelegram).text);

    sendTextToTelegramWithNotification(chats.runWithTelegram, 'Bearish change percentage?');
    if (waitForNextMessage() === -1) return;
    writeDataTo('Trade!L25', getLastMessage(chats.runWithTelegram).text);

    sendMessageWithKeyboard(chats.runWithTelegram, "Option date you want?", getUniqueIntrumentNames());
    if (waitForNextMessage() === -1) return;
    writeDataTo('Trade!A3', getLastMessage(chats.runWithTelegram).text);


    writeDataTo(instrumentNameRangeCell, '2000');
    sendTextToTelegramWithNotification(chats.runWithTelegram, 'Calculating Best Options To  Trade !');
    clearRows();
    getInstrumentDates();
    getBestValuesTrade();
    sendBestResultToTelegram(chats.runWithTelegram);

    var d = new Date();
    var timeStamp = d.getTime();
    sendTextToTelegramWithNotification(chats.runWithTelegram, 'http://bit.ly/PnlGraph?v={' + timeStamp + '}');
}