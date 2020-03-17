///////////////////// News API app ////////////////////////////

$("#searchBtn").on("click", function () {
  let topic = $("#searchText").val();

  $(".column").attr("style", "display:block");
  newsAPIstub($("#searchText").val());
  wikiAPIstub($("#searchText").val());
  flickrAPIstub($("#searchText").val());
});

function wikiAPIstub(topic) {
  console.log("wikiAPI called with..." + " " + topic);
  //var queryURL = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles=pizza&imlimit=20&origin=*&format=json&formatversion=2";
  //var queryURL = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+topic+"&origin=*&format=json"
  var queryURL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&origin=*&titles=" + topic;
  // Performing an AJAX request with the queryURL
  $.ajax({
      url: queryURL,
      method: "GET"
    })
    // After data comes back from the request
    .then(function (response) {
      console.log(queryURL);

      // console.log(response);
      // storing the data from the AJAX request in the results variable
      //var results = response.data;
      var obj = response.query.pages;
      var ob = Object.keys(obj)[0];
      console.log(obj[ob]["extract"]);
      var wikiResponse = response.query.pages;
      $("#wiki-content").text(obj[ob]["extract"])
    });
}

function flickrAPIstub(topic = "other") {
  console.log("flicrAPI called with..." + " " + topic);
  let api_url = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" +
    topic + '&safe_search=1)';;

  $("#flickrDiv").empty();

  $.ajax({
    url: api_url,
    dataType: "jsonp", // jsonp
    jsonpCallback: 'jsonFlickrFeed', // add this property
    success: function (result, status, xhr) {
      $.each(result.items, function (i, item) {
        $("<img>").attr("src", item.media.m).appendTo("#flickrDiv");
        if (i === 5) {
          return false;
        }
      });
    },
    error: function (xhr, status, error) {
      console.log(xhr)
      $("#flickrDiv").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
  });

}

function newsAPIstub(topic) {
  console.log("newsAPI called with..." + " " + topic);

  let api_url = "https://newsapi.org/v2/everything?qInTitle=";
  let newsAPIkey = "02403ceecf7b4629a113e349b90603ec";
  let news = [];
  let newsID = 0;

  $.ajax({
    url: api_url + topic + "&language=en" + "&apikey=" + newsAPIkey
  }).then(function (result) {
    //console.log(result);
    newsArray = result;
    updateNews(result);
  });

  function updateNews(result) {
    $(".newsTitle").text(result.articles[newsID].title);
    $(".newsImage").attr("src", result.articles[newsID].urlToImage);
    $(".newsSource").text("source: " + result.articles[newsID].source.name);
    $(".newsDescription").text(result.articles[newsID].description);
    $(".newsURL").attr("href", result.articles[newsID].url);
  }

  $(".next").on("click", function () {
    if (newsID < 19) {
      console.log(newsID);
      newsID++;
      updateNews(newsArray);
    }
  });

  $(".prev").on("click", function () {
    if (newsID > 1) {
      newsID--;
      console.log(newsID);
      updateNews(newsArray);
    }
  });
}


//////////////////////////////////