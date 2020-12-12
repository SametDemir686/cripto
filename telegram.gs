function sendTelegramNotification() {
    updatePositions();
    let values = SpreadsheetApp.getActiveSheet().getRange("Trade!B105:E105").getValues();
    let text = "";
    for (let i = 0; i < values[0].length; i++) {
        let value = values[0][i];
        text += "Position " + (i + 1) + ": " + value + "\n";
    }
    sendTextToTelegram(text);
}

function sendTextToTelegram(text) {
    UrlFetchApp.fetch("https://api.telegram.org/bot" + botSecret + "/sendMessage?text=" + encodeURIComponent(text) + "&chat_id=" + chatId + "&parse_mode=HTML&disable_notification=true");
}



function receiveTextToSheet() {
    var result =  pullDataFrom("https://api.telegram.org/bot" + botSecret + "/getUpdates").result;
    writeDataTo(telegramClosePosition, result[result.length-1].message.text);
  let text= result[result.length-1].message.text;
  if(text==="Close"){ 
     let text2= "Do you want to close? Type Yes in 4 sec";
     UrlFetchApp.fetch("https://api.telegram.org/bot" + botSecret + "/sendMessage?text=" + encodeURIComponent(text2) + "&chat_id=" + chatId + "&parse_mode=HTML");
     Utilities.sleep(4000 ); 
     var result =  pullDataFrom("https://api.telegram.org/bot" + botSecret + "/getUpdates").result;
     writeDataTo(telegramClosePosition, result[result.length-1].message.text);
     let text3= result[result.length-1].message.text;
    if(text3==="Yes"){
     closePosition();
     Utilities.sleep(3000 ); 
     sendTelegramNotification();
     let text4= "Close Position triggered";
     UrlFetchApp.fetch("https://api.telegram.org/bot" + botSecret + "/sendMessage?text=" + encodeURIComponent(text4) + "&chat_id=" + chatId + "&parse_mode=HTML");
     }
   
   }
  
}


