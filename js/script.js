$("#flickrDiv").slick();
$("#searchBtn").on("click", function() {
  let topic = $("#searchText")
    .val()
    .toLowerCase()
    .trim();
  $(".column").attr("style", "display:block");
  newsAPIstub(topic);
  wikiAPIstub(topic);
  flickrAPIstub(topic);
});

function newsAPIstub(topic) {
  let api_url = "https://newsapi.org/v2/everything?qInTitle=";
  let newsAPIkey = "02403ceecf7b4629a113e349b90603ec";
  let newsID = 0;

  $.ajax({
    url: api_url + topic + "&language=en" + "&apikey=" + newsAPIkey
  }).then(function(result) {
    newsArray = result;
    updateNews(result);
  });

  function updateNews(result) {
    $(".newsImage").attr("src", result.articles[newsID].urlToImage);
    $(".newsTitle").text(result.articles[newsID].title);
    $(".newsSource").text("source: " + result.articles[newsID].source.name);
    $(".newsDescription").text(result.articles[newsID].description);
    $(".newsURL").attr("href", result.articles[newsID].url);
  }

  $(".next").on("click", function() {
    if (newsID < 19) {
      newsID++;
      updateNews(newsArray);
    }
  });

  $(".prev").on("click", function() {
    if (newsID > 1) {
      newsID--;
      updateNews(newsArray);
    }
  });
}

function flickrAPIstub(topic) {
  let api_key = "4b3ee8660253745b72043ab4adcfa0a2";
  let api_url =
    "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=" +
    api_key +
    "&tags=" +
    topic +
    "&format=json&nojsoncallback=1&safe_search=1&is_getty=true&extras=url_m";

  $.ajax({
    url: api_url
  }).then(function(result) {
    $("#flickrDiv").slick("unslick");
    $("#flickrDiv").empty();
    for (i = 0; i <= 10; i++) {
      let img = $("<img>").attr("src", result.photos.photo[i].url_m);
      img.css("margin", "auto");
      img.css("height", "200");
      img.css("padding", "5px");
      $("#flickrDiv").append(img);
    }
    let imagesLoaded = 0;
    let totalImages = $("#flickrDiv img").length;
    $("#flickrDiv img").on("load", function() {
      imagesLoaded++;
      if (imagesLoaded == totalImages) {
        $("#flickrDiv").slick({
          infinite: true,
          speed: 1000,
          centerMode: true,
          variableWidth: true
        });
      }
    });
  });
}

function wikiAPIstub(topic) {
  let queryURL =
    "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&origin=*&titles=" +
    topic;
  // Performing an AJAX request with the queryURL
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // After data comes back from the request
    .then(function(response) {
      let obj = response.query.pages;
      let ob = Object.keys(obj)[0];
      $("#wikipediaDiv").html(obj[ob]["extract"]);
      $(".wikipediaURL").attr(
        "href",
        "https://en.wikipedia.org/?curid=" + obj[ob]["pageid"]
      );
    });
}
