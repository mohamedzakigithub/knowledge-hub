$("#flickrDiv").slick();
$("#searchBtn").on("click", function() {
  $("#flickrDiv").hide();
  let topic = $("#searchText")
    .val()
    .toLowerCase()
    .trim();
  if (topic) {
    $(".hero").animate(
      {
        top: 0
      },
      1000
    );
    $(".section").animate(
      {
        top: 10
      },
      1500,
      function() {
        $(".column").attr("style", "display:block");
        newsAPIstub(topic);
        wikiAPIstub(topic);
        flickrAPIstub(topic);
      }
    );
  }
});

function newsAPIstub(topic) {
  let api_url = "https://newsapi.org/v2/everything?qInTitle=";
  let newsAPIkey = "02403ceecf7b4629a113e349b90603ec";
  let newsID = 0;

  $.ajax({
    url: api_url + topic + "&language=en" + "&apikey=" + newsAPIkey
  }).then(function(result) {
    if (result.totalResults < 1) {
      $(".newsTitle").text("No articles found");
      $(".newsURL").hide();
      $(".newsImage").hide();
      $(".newsSource").hide();
      $(".newsDescription").hide();
      $(".next").hide();
      $(".prev").hide();
    } else {
      newsArray = result;
      updateNews(result);
    }
  });

  function updateNews(result) {
    $(".newsImage")
      .attr("src", result.articles[newsID].urlToImage)
      .show();
    $(".newsTitle")
      .text(result.articles[newsID].title)
      .show();
    $(".newsSource")
      .text("source: " + result.articles[newsID].source.name)
      .show();
    $(".newsDescription")
      .text(result.articles[newsID].description)
      .show();
    $(".newsURL")
      .attr("href", result.articles[newsID].url)
      .show();
    $(".next").show();
    $(".prev").show();
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
    if (result.photos.photo.length < 1) {
      $("#flickrDiv")
        .html("<h1>No photos found</h1>")
        .css("background-color", "white");
    } else {
      $("#flickrDiv").css("background-color", "transparent");
      $("#flickrDiv").slick("unslick");
      $("#flickrDiv").empty();
      for (i = 0; i < result.photos.photo.length; i++) {
        let img = $("<img>").attr("src", result.photos.photo[i].url_m);
        img.css("margin", "auto");
        img.css("height", "400");
        img.css("padding", "5px");
        $("#flickrDiv").append(img);
      }
      let imagesLoaded = 0;
      let totalImages = $("#flickrDiv img").length;
      $("#flickrDiv img").on("load", function() {
        imagesLoaded++;
        if (imagesLoaded == totalImages) {
          $("#flickrDiv").show();
          $("#flickrDiv").slick({
            infinite: true,
            speed: 1000,
            centerMode: true,
            variableWidth: true
          });
        }
      });
    }
  });
}

function titleCase(str) {
  return $(str.split(/\s|_/))
    .map(function() {
      return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    })
    .get()
    .join(" ");
}

function wikiAPIstub(topic) {
  if (topic.indexOf(" ") >= 0) {
    topic = titleCase(topic);
  }

  console.log("topic is ", topic);
  let queryURL =
    "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&origin=*&titles=" +
    topic;
  // let queryURL =
  // "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&origin=*&titles=New%20Zealand";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(result) {
    console.log(result);
    if (Object.keys(result.query.pages)[0] < 0) {
      $("#wikipediaDiv").text("No Wikipedia articles found");
      $(".wikipediaURL").hide();
    } else {
      let obj = result.query.pages;
      let ob = Object.keys(obj)[0];
      $("#wikipediaDiv").html(obj[ob]["extract"]);
      console.log("Wiki result is", result);
      $(".wikipediaURL")
        .attr("href", "https://en.wikipedia.org/?curid=" + obj[ob]["pageid"])
        .show();
    }
  });
}
