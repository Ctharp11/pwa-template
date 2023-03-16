if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
  
const notificationButton = document.getElementById("notifications");
  
if (notificationButton) {
  notificationButton.addEventListener("click", () => {
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        randomNotification();
      }
    });
  });
}
  
const getNewQuote = async () => {
  var url = "https://type.fit/api/quotes";
  const response = await fetch(url);
  const allQuotes = await response.json();
  const indx = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[indx];
};
   
async function randomNotification() {
  const quote = await getNewQuote();
  const notifTitle = "This is a Quote";
  const notifBody = quote 
    ? `${quote.text} - ${quote.author}`
    : "There was an error getting the quote.";
  const options = {
    body: notifBody,
  };
  new Notification(notifTitle, options);
}
