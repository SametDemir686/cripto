function sendTelegramNotification() {
  let text = SpreadsheetApp.getActiveSheet().getRange("Instruments!B105:E105").getValues();
  sendTextToTelegram(text);
}

function sendTextToTelegram(text) {
  UrlFetchApp.fetch("https://api.telegram.org/bot" + botSecret + "/sendMessage?text=" + text + "&chat_id=" + chatId + "");
}

