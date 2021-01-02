function updatePositionsAndSendToTradeEmin() {
    updatePositionsAndSendToTelegram(chats.runWithTelegram);
}

function updatePositionsAndSendToTelegram(chat) {
    updatePositions();
    sendPositionsToTelegram(chat);
    sendMaxLossToTelegram(chat);
}

function sendPositionsToTelegram(chat) {
    let positions = getPositionsToString();
    sendTextToTelegramWithoutNotification(chat, positions);
}

function getPositionValues() {
    let totalProfitLosses = SpreadsheetApp.getActiveSheet().getRange("Trade!B104:E104").getValues()[0];
    let directions = SpreadsheetApp.getActiveSheet().getRange("Trade!B88:E88").getValues()[0];
    let instrumentNames = SpreadsheetApp.getActiveSheet().getRange("Trade!B93:E93").getValues()[0];
    let result = [];
    for (let i = 0; i < totalProfitLosses.length; i++) {
        let totalProfitLoss = totalProfitLosses[i];
        let direction = directions[i];
        let instrumentName = instrumentNames[i];
        if (totalProfitLoss) {
            let prices = pullPricesDeribit(instrumentName);
            let price = direction.toLowerCase() === "sell" ? prices.asks : prices.bids;
            let totalLoss = totalProfitLoss / prices.markPrice * price * prices.indexPrice;
            result.push(totalLoss.toFixed(0));
        } else {
            result.push(0);
        }
    }
    return result;
}

function getPositionsToString() {
    let values = getPositionValues();
    let text = "";
    for (let i = 0; i < values.length; i++) {
        let value = values[i];
        text += "Position ($) " + (i + 1) + ": " + value + "\n";
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
    if (isLastMessage(chats.runWithTelegram, "/Close")) {
        sendTextToTelegramWithNotification(chats.runWithTelegram, "Do you want to close? Type Yes in 10 sec");
        waitForNextMessage(10000);
        if (isLastMessage(chats.runWithTelegram, "Yes")) {
            sendTextToTelegramWithNotification(chats.runWithTelegram, "Close Position triggered");
            closePosition();
            sendPositionsToTelegram(chats.runWithTelegram);
            sendTextToTelegramWithNotification(chats.runWithTelegram, "Position Closed");
        }
    }
}

function OpenIfLastMessageIsOpen() {
    if (isLastMessage(chats.runWithTelegram, "/Open")) {
        sendTextToTelegramWithNotification(chats.runWithTelegram, "Do you want to open a position? Type Yes in 10 sec");
        Utilities.sleep(10000);
        if (isLastMessage(chats.runWithTelegram, "Yes")) {
            sendTextToTelegramWithNotification(chats.runWithTelegram, "Open Position triggered");
            openPosition();
            sendPositionsToTelegram(chats.runWithTelegram);
            sendTextToTelegramWithNotification(chats.runWithTelegram, "Position Opened");
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
        text += titleValue + ":"+ value.toFixed(1) + "\n";
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
    while (newMessage.date === lastMessage.date || newMessage.from.id !== chats.emin.user_id) {
        newMessage = getLastMessage(chats.runWithTelegram);
    }
    if (newMessage.text.toUpperCase() === "/STOP") {
        sendTextToTelegramWithoutNotification(chats.runWithTelegram, "As you wish boss");
        return -1;
    }
    return 0;
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

function sendBalanceTelegram() {
    let balance = getBalance();
    sendTextToTelegramWithoutNotification(chats.runWithTelegram, balance);
}

function runWithTelegram() {
    sendTextToTelegramWithNotification(chats.runWithTelegram, 'Ne kadar yatırım yapmak istersin $ ?');
    if (waitForNextMessage() === -1) return;
    writeDataTo('Trade!B18', getLastMessage(chats.runWithTelegram).text);

    sendTextToTelegramWithNotification(chats.runWithTelegram, 'Btc en fazla ne kadar yükselir % ?');
    if (waitForNextMessage() === -1) return;
    writeDataTo('Trade!K25', getLastMessage(chats.runWithTelegram).text);

    sendTextToTelegramWithNotification(chats.runWithTelegram, 'Btc en fazla ne kadar düşer % ?');
    if (waitForNextMessage() === -1) return;
    writeDataTo('Trade!L25', getLastMessage(chats.runWithTelegram).text);

    sendMessageWithKeyboard(chats.runWithTelegram, "İşlem yapmak istediğin opsiyon tarihini seç ?", getUniqueIntrumentNames());
    if (waitForNextMessage() === -1) return;
    writeDataTo('Trade!A3', getLastMessage(chats.runWithTelegram).text);


    writeDataTo(instrumentNameRangeCell, 5000);
    sendTextToTelegramWithNotification(chats.runWithTelegram, 'Verdiğin bilgilere göre en iyi opsiyon hesaplanıyor !');
    clearRows();
    getInstrumentDates();
    getBestValuesTrade();
    sendBestResultToTelegram(chats.runWithTelegram);

    var d = new Date();
    var timeStamp = d.getTime();
    sendTextToTelegramWithNotification(chats.runWithTelegram, 'http://bit.ly/PnlGraph?v={' + timeStamp + '}');
}