function sendTelegramNotification() {
  let values = SpreadsheetApp.getActiveSheet().getRange("Trade!B105:E105").getValues();
  let text = "";
  for (let i = 0; i < values[0].length; i++) {
    let value = values[0][i];
    text += "Position " + (i+1) + ": " + value + "\n";
  }
  sendTextToTelegram(text);
}

function sendTextToTelegram(text) {
  UrlFetchApp.fetch("https://api.telegram.org/bot" + botSecret + "/sendMessage?text=" + encodeURIComponent(text) + "&chat_id=" + chatId + "&parse_mode=HTML");
}

