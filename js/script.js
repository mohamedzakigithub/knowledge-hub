$("#flickrDiv").slick(); // Initialize slick carousel.

// Add click event listener for the search button and declare the handler function.
$("#searchBtn").on("click", function() {
  $(".column").hide();
  $("#flickrDiv").hide();
  let topic = $("#searchText")
    .val()
    .toLowerCase()
    .trim();

  // Hero and search box/button animation
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
      // Call all APIs with the topic after animation finishes.
      function() {
        $(".column").attr("style", "display:block");
        newsAPIstub(topic);
        wikiAPIstub(topic);
        flickrAPIstub(topic);
      }
    );
  }
});

// News API
function newsAPIstub(topic) {
  let api_url = "https://newsapi.org/v2/everything?qInTitle=";
  let newsAPIkey = "02403ceecf7b4629a113e349b90603ec";
  let newsID = 0;
  let totalResults = 0;
  let newsArray = [];

  // Ajax call
  $.ajax({
    url: api_url + topic + "&language=en" + "&apikey=" + newsAPIkey // Format URL
  }).then(function(result) {
    totalResults = result.articles.length;

    // Check for returned articles number
    if (totalResults < 1) {
      $(".newsTitle").text("No articles found");
      $(".newsURL").hide();
      $(".newsImage").hide();
      $(".newsSource").hide();
      $(".newsDescription").hide();
      $(".next").hide();
      $(".prev").hide();
    } else {
      newsArray = result.articles;
      updateNews(newsArray); // Call updateNews function.
    }
  });

  // UpdateNews function extract news title, images, source and description and set them to the assigned elements.
  function updateNews(newsArray) {
    $(".currentArticle").text(newsID + 1 + " of " + totalResults);

    // Manage Next and Previous buttons display and hide
    switch (true) {
      case newsID < 1: {
        $(".next").show();
        $(".prev").hide();
        break;
      }
      case newsID >= 1 && newsID < totalResults - 1: {
        $(".prev").show();
        $(".next").show();
        break;
      }
      case newsID >= totalResults - 1: {
        $(".next").hide();
        $(".prev").show();
        break;
      }
    }
    $(".newsImage")
      .attr("src", newsArray[newsID].urlToImage)
      .show();
    $(".newsTitle")
      .text(newsArray[newsID].title)
      .show();
    $(".newsSource")
      .text("source: " + newsArray[newsID].source.name)
      .show();
    $(".newsDescription")
      .text(newsArray[newsID].description)
      .show();
    $(".newsURL")
      .attr("href", newsArray[newsID].url)
      .show();
  }

  // Add event listeners for next and previous buttons
  $(".next").on("click", function() {
    if (newsID < totalResults - 1) {
      newsID++;
      updateNews(newsArray);
    }
  });
  $(".prev").on("click", function() {
    if (newsID > 0) {
      newsID--;
      updateNews(newsArray);
    }
  });
}

// flickr API
function flickrAPIstub(topic) {
  let api_key = "4b3ee8660253745b72043ab4adcfa0a2";
  let api_url =
    "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=" +
    api_key +
    "&tags=" +
    topic +
    "&format=json&nojsoncallback=1&safe_search=1&is_getty=true&extras=url_m"; //Format URL

  // Ajax call.
  $.ajax({
    url: api_url
  }).then(function(result) {
    // Check for returned results
    if (result.photos.photo.length < 1) {
      $("#flickrDiv")
        .parent()
        .parent()
        .css("background-color", "white");
      $("#flickrDiv").show();
      $("#flickrDiv").html("<h1>No photos found</h1>");
    } else {
      $("#flickrDiv")
        .parent()
        .parent()
        .css("background-color", "transparent");
      $("#flickrDiv").slick("unslick");
      $("#flickrDiv").empty();
      for (i = 0; i < result.photos.photo.length; i++) {
        let img = $("<img>").attr("src", result.photos.photo[i].url_m);
        img.css("margin", "auto");
        img.css("height", "400");
        img.css("padding", "5px");
        $("#flickrDiv").append(img);
      }

      // Wait for all the images to load before initializing the carousel
      let imagesLoaded = 0;
      let totalImages = $("#flickrDiv img").length;
      $("#flickrDiv img").on("load", function() {
        imagesLoaded++;
        if (imagesLoaded == totalImages) {
          $("#flickrDiv").show();
          $("#flickrDiv").slick({
            // Initialize slick carousel
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

// Wikipedia API
function wikiAPIstub(topic) {
  // Function to change search text to title case for use by wikipedia API.
  function titleCase(str) {
    return $(str.split(/\s|_/))
      .map(function() {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
      })
      .get()
      .join(" ");
  }
  if (topic.indexOf(" ") >= 0) {
    topic = titleCase(topic);
  }
  let queryURL =
    "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&origin=*&titles=" +
    topic; // Format URL

  // Ajax call.
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(result) {
    if (Object.keys(result.query.pages)[0] < 0) {
      $("#wikipediaDiv").text("No Wikipedia articles found");
      $(".wikipediaURL").hide();
    } else {
      let obj = result.query.pages;
      let ob = Object.keys(obj)[0];
      $("#wikipediaDiv").html(obj[ob]["extract"]);
      $(".wikipediaURL")
        .attr("href", "https://en.wikipedia.org/?curid=" + obj[ob]["pageid"])
        .show();
    }
  });
}
