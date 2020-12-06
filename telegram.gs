
function sendTelegramNotification(body) {
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botSecret + "/sendMessage?text=" + encodeURIComponent(body) + "&chat_id=" + chatId + "&parse_mode=HTML");
}

