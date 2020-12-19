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

function sendKeyboardToTelegram(chat, text,kokolo) {
    UrlFetchApp.fetch("https://api.telegram.org/bot" + chat.botSecret + "/sendMessage?text=" + encodeURIComponent(text) + "&chat_id=" + chat.chatId + "&parse_mode=HTML"+encodeURIComponent(JSON.stringify(text)));
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
        text +=  titleValue + ":" + value.toFixed(1) + "\n";
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
        text +=  titleValue + ":" + value + "\n";
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



function lastMessageDateIsDifferent () {
// Utilities.sleep(5 * 1000);  


    var lastdate = getLastMessageDate(chats.runWithTelegram);

    do {
        Utilities.sleep(5 * 1000);
    }
    while (getLastMessageDate(chats.runWithTelegram) == lastdate);


    return  dateIsdifferent=1;


}
function runWithTelegram() {
    //let textt=  getLastMessage(chats.runWithTelegram).text;

    // if( textt.split(",")[1] !=undefined && textt.split(",")[2]!=	undefined  && textt.split(",")[3] !=	undefined && textt.split(",")[4] !=undefined && textt.split(",")[5] !=undefined && textt.split(",")[6] !=undefined){



    sendTextToTelegramWithNotification(chats.runWithTelegram, ' How much money do you want to invest in?');

    if ( lastMessageDateIsDifferent () ==1 ){
        let desired=  getLastMessage(chats.runWithTelegram).text;
        writeDataTo('Trade!B18',desired );
        let  dateIsdifferent=0;
    }



    sendTextToTelegramWithNotification(chats.runWithTelegram, ' Bullish change percentage?');

    if ( lastMessageDateIsDifferent () ==1 ){
        let bullpercent11=  getLastMessage(chats.runWithTelegram).text;
        writeDataTo('Trade!K25', bullpercent11);
        let   dateIsdifferent=0;
    }

    sendTextToTelegramWithNotification(chats.runWithTelegram, ' Bearish change percentage?');

    if ( lastMessageDateIsDifferent () ==1 ){
        let bearpercent11=  getLastMessage(chats.runWithTelegram).text;
        writeDataTo('Trade!L25', bearpercent11);
        let  dateIsdifferent=0;
    }

    sendTextToTelegramWithNotification(chats.runWithTelegram, ' Option date you want ? (19Dec20)');
    // sendOptionDatesToTelegram(chats.runWithTelegram);
    if ( lastMessageDateIsDifferent () ==1 ){
        let date=  getLastMessage(chats.runWithTelegram).text;
        writeDataTo('Trade!A3',date );
        let  dateIsdifferent=0;
    }


    writeDataTo(instrumentNameRangeCell,'2000' );
    sendTextToTelegramWithNotification(chats.runWithTelegram, ' Calculating Best Options To  Trade ! ');
    clearRows();
    getInstrumentDates();
    getBestValuesTrade();
    sendBestResultToTelegram(chats.runWithTelegram);

    var d = new Date();
    var timeStamp = d.getTime();
    sendTextToTelegramWithNotification(chats.runWithTelegram, 'http://bit.ly/PnlGraph?v={' + timeStamp +'}');




    //let bullpercent22 = textt.split(",")[3];
    //let bearpercent22 =  textt.split(",")[
    //writeDataTo('Trade!K26', bullpercent22);
    //writeDataTo('Trade!L26', bearpercent22 );




}


function runWithTelegram2() {
    //getBestValuesTrade2();
}
       


