var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search");
var categoryBtn = $("#categories");
var recentSearches = JSON.parse(localStorage.getItem("recentSearches"))?JSON.parse(localStorage.getItem("recentSearches")):[];

// search box event handler - rachel
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from seach input
    var show = searchInputEl.value.trim();

    if(show) {
        saveSearch(show);
        saveSearch(show);
        getApplePodShowRepos(show);
        getSubjectTitles(show);
        searchInputEl.value = "";
    } else {
        openModal();
        changeContent("Please enter a valid category");
    }
};
// search box event handler - rachel

// pull from Apple Podcasts API - lilly
var getApplePodShowRepos = function(show) {
    // format the github api url
    var apiUrl = "https://itunes.apple.com/search?term=" + show + "&entity=podcast&attribute=keywordsTerm&crossorigin=use-credentials&limit=20";
    
    // make a request to the url
    fetch(apiUrl).then(function(response) {

        // if request was successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(response);
                console.log(data);
                console.log(data.results);
                // displayPods(data. artistName);
                displayPods(data.results)
            });
        // if request fails
        }  else {
            openModal();
            changeContent("Error: search term not found");
        }
        // if connection issue
    }).catch(function(error) {
        // this catch is chained to the end of the ".then"
        openModal();
        changeContent("Error: search term not found. Please try again.");
    });
};
// pull from Apple Podcasts API - lilly

// pull from Open Library API - Josh
var getSubjectTitles = function(show) {
  var apiUrl = "https://openlibrary.org/search.json?q=" + show + "&limit=20";

   fetch(apiUrl, {}).then(function(response) {
     // if request is successful
     if (response.ok) {
      response.json().then(function(data) {
        console.log("book fetch successful");
        console.log(data);
        console.log(data.docs);
        displayBooks(data.docs);
      });
     } else {
      openModal();
      changeContent("Error: search term not found");
     }

    // if connection issue
    }).catch(function(error) {
      // this catch is chained to the end of the ".then"
      openModal();
      changeContent("Error: search term not found. Please try again.");
    });
};
// end Josh's fetch section

// display book fetch results - rachel
var displayBooks = function (data) {
  console.log(data[0].author_name[0]);
  console.log(data[0].title);

  for (var i = 0; i < data.length; i++) {
    var authorName = data[i].author_name[0];
    var bookTitle = data[i].title;
    listItem = document.createElement('li');
    listItem.textContent = 
    subjectList.appendChild(listItem);
    listItem.textContent = 
    subjectList.appendChild(listItem);
}
}
// display book results - rachel

// category button event listener - rachel
categoryBtn.on("click", function(event) {
    // when any of the category buttons are clicked, the precise one will be identified
    if (event.target.nodeName == "BUTTON") {
        var category = event.target.textContent;
    }
    getApplePodShowRepos(category);
    getSubjectTitles(category);
});

searchFormEl.addEventListener("submit", formSubmitHandler);
// category button event listener - rachel


// function to display podcasts to html - tyler
var displayPods = function(shows) {

    $("#podcasts").empty();

    console.log(shows[0].artistName);      
    console.log(shows[0].collectionName);      
    
    for (let i = 0; i < shows.length; i++) {
        const element = shows[i];
        
        var podcastContainer = document.getElementById("podcasts");

        var image = document.createElement("img");
        image.setAttribute("src", shows[i].artworkUrl100);

        var artist = document.createElement("h1");
        artist.textContent = shows[i].artistName;

        var title = document.createElement("p");
        title.textContent = shows[i].collectionName;
    
        var podcast = document.createElement("a");
        podcast.setAttribute("href", shows[i].trackViewUrl);
        podcast.setAttribute("target", "_blank");
        podcast.classList = "box";

        podcast.appendChild(image);
        podcast.appendChild(artist);
        podcast.appendChild(title);
        podcastContainer.appendChild(podcast);
    };
    // function to display podcasts to html - tyler
  };

    // open modal
    var openModal = function() {
        var modal = document.querySelector(".modal");
        modal.classList.add('is-active');
    }

    // change modal text
    var changeContent = function(innerText) {
        var modalText = document.querySelector("#modal-text")
        modalText.innerHTML = innerText;
    }

    // modal trigger
    document.addEventListener('DOMContentLoaded', () => {
        // Functions to close a modal
        function closeModal($el) {
          $el.classList.remove('is-active');
        }
      
        function closeAllModals() {
          (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
          });
        }
      
        // Add a click event on buttons to open a specific modal
        (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
          const modal = $trigger.dataset.target;
          const $target = document.getElementById(modal);
          console.log($target);
      
          $trigger.addEventListener('click', () => {
            openModal($target);
          });
        });
      
        // Add a click event on various child elements to close the parent modal
        (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
          const $target = $close.closest('.modal');
      
          $close.addEventListener('click', () => {
            closeModal($target);
          });
        });
      
        // Add a keyboard event to close all modals
        document.addEventListener('keydown', (event) => {
          const e = event || window.event;
      
          if (e.keyCode === 27) { // Escape key
            closeAllModals();
          }
        });
      });

      // Save recent searches to local storage
      var saveSearch = function (search) {
        if (recentSearches.indexOf(search)=== -1) {
            recentSearches.push(search)
        
            if (recentSearches.length > 10) {
                recentSearches.shift();
            }
  
            localStorage.setItem("recentSearches", JSON.stringify(recentSearches))
        }
        }

      // Retreive recent searches from local storage