//things I need for my javascript sections:
//log-in screen
// - register
// - login 
// - submit button to bring you to next page
//Add a book section:
// - Section with all the required spaces that add itself to API
//      - needs have an event listener for the button to submit
//      - button needs to take all input info and verify it's correct and submit to api
//      - list should auto reload with new book added
//book list section 
// - preset to auto generate 10 books to appear if they have books entered
//      - api call that generates books by most recently added
//      - auto generate number out of number of books
//      - next button event listener to change number
//      - back button event listener to go back
// - search and randomly generate suggestions before list
        // - event listener and then api call to return random returns
// - Sort by for each section (always alphabetical)
        // - is this posible? 
// - delete a book by clicking "-" that has a column
// 		- popup that has am "are you sure box" and a "cancel" or "submit" button
//checkout and and check in book
// - checkout book 
//      - search api by book title (can it be suggested?)
// 		- select book 
//		- Enter who it was checkout out to
// - check in book
// 		- show by checked out books
//		- click option for checkin in book
// need to figure out how to return table of data for all elements based on parameter. do i use httpxml?

//function submitAction() {
//    subm
//}



function populateRandomGenre() {
    let dropdown = $('.selectGenre');
    dropdown.empty();
    dropdown.append('<option selected="true" disabled>Choose Genre</option>');
    dropdown.prop('selectedIndex', 0);
    const url = 'https://blooming-tor-75571.herokuapp.com/getbooks/bygenre';

    $.getJSON(url, function (data) {
    $.each(data, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.abbreviation).text(entry.name));
        })
    });
}

function submitRandomGenre() {
    $('.randomGenre').submit(function (event) {
        event.preventDefault();
        booksByGenre()
    })
}

function booksByGenre() { 
    url = 'https://blooming-tor-75571.herokuapp.com/getbooks/bygenre';
    
    console.log(url),

    $.getJSON(url, function (response) {
         const results = //response.photos.photo.map((item, response) => buildThumbnailUrl(item));
         //$('#flickrResults').html(results)
         //console.log
         });
}

    $('.randomReadingLevel').submit(function (event) {
        event.preventDefault();
        booksByReadingLevel()
    });
    $('.randomBoth').submit(function (event) {
        event.preventDefault();
        booksByBoth()
    });

function submitBooksByTitle() {
    $('#searchTerm').submit(function (event) {
        event.preventDefault();
        var queryTarget = $(event.currentTarget).find('#query');
        searchTerm = queryTarget.val();
        booksByTitle(searchTerm);
    });
}


function booksByTitle(searchTerm) { 
    url = 'https://blooming-tor-75571.herokuapp.com/getbooks/byTitle' + ${searchTerm};
    console.log(params),
    //$.getJSON(url, params, function (response) {
         const results = //response.photos.photo.map((item, response) => buildThumbnailUrl(item));
         //$('#flickrResults').html(results)
         //console.log
         //});
}
//returns all books
function allBooks(searchTerm) { 
    url = 'https://blooming-tor-75571.herokuapp.com/getbooks';
    const params = {
        
    };
    console.log(params),

    $.getJSON(url, params, function (response) {
         const results = //response.photos.photo.map((item, response) => buildThumbnailUrl(item));
         //$('#flickrResults').html(results)
         //console.log
         });
}

//returns books by genre

//returns books by reading level
function booksByReadingLevel(searchTerm) { 
    url = 'https://blooming-tor-75571.herokuapp.com/getbooks/byreadinglevel?readingLevel=' + //search entry;
    const params = {
        'method': 'GET',

    };
    console.log(params),

    $.getJSON(url, function (response) {
         const results = response.books((item, response) => buildThumbnailUrl(item));
         $('#flickrResults').html(results)
         console.log
         });
}

function booksByReadingLevelAndGenre(searchTerm) { 
    url = 'https://blooming-tor-75571.herokuapp.com/getbooks/byreadinglevel/bygenre';
    const params = {
        
    };
    console.log(params),

    $.getJSON(url, params, function (response) {
         const results = //response.photos.photo.map((item, response) => buildThumbnailUrl(item));
         //$('#flickrResults').html(results)
         //console.log
         });
}

$(document).ready(function () {
        submitBooksByTitle();
        //populateRandomGenre();
        });