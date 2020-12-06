
function sendTelegramNotification() {
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botSecret + "/sendMessage?text=" + "hoooop" + "&chat_id=" + chatId + "");
}

