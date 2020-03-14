///////////////////// News API app ////////////////////////////

let api_url = "https://newsapi.org/v2/everything?qInTitle=";
let newsAPIkey = "02403ceecf7b4629a113e349b90603ec";
let news = [];
let newsID = 0;

$("#searchBtn").on("click", function() {
  let topic = $("#searchText").val();
  let newsID = 0;
  $(".column").attr("style", "display:block");
  $.ajax({
    url: api_url + topic + "&language=en" + "&apikey=" + newsAPIkey
  }).then(function(result) {
    console.log(result);
    newsArray = result;
    updateNews(result);
  });
});
function updateNews(result) {
  $(".newsTitle").text(result.articles[newsID].title);
  $(".newsImage").attr("src", result.articles[newsID].urlToImage);
  $(".newsSource").text("source: " + result.articles[newsID].source.name);
  $(".newsDescription").text(result.articles[newsID].description);
  $(".newsURL").attr("href", result.articles[newsID].url);
}

$(".next").on("click", function() {
  if (newsID < 19) {
    console.log(newsID);
    newsID++;
    updateNews(newsArray);
  }
});

$(".prev").on("click", function() {
  if (newsID > 1) {
    newsID--;
    console.log(newsID);
    updateNews(newsArray);
  }
});

//////////////////////////////////
