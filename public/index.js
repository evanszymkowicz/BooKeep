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
//data is the api call. will need to rename

/*function drawTable(data) {
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
}*/

var tableNumber = 1;
var resultsShown = 2;

//returns all books
function allBooks(searchTerm) { 
    url = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(url,  function (response) {
        booksInLibrary = response.map((item, response) => drawRow(item))
        //const results = LibraryBookTableMaker();
        //drawRow(results);
         });
}

/*function LibraryBookTableMaker () {
    var results = '';
    for(var i = (tableNumber * resultsShown - resultsShown) ; i < (tableNumber * resultsShown); i++) {
    results += drawRow(results[i]);
  }
  return results
}*/


function drawRow(rowData) {
    var row = $("<tr />")
    $(".libraryBooksDisplayed").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
    row.append($("<td>" + rowData.title + "</td>"));
    row.append($("<td>" + rowData.author + "</td>"));
    row.append($("<td>" + rowData.readingLevel + "</td>"));
    row.append($("<td>" + rowData.genre + "</td>"));
    row.append($("<td>" + rowData.description + "</td>"));
    row.append($("<td>" + '<button class="deleteBook">Delete Book</button>' + "</td>"));
}

function postNewBook() {
    $('.addABook').on('click', '.submitNewBook', function (event) {
        event.preventDefault();
        const newTitle = $('.addTitle').val();
        const newAuthor = $('.addAuthor').val();
        const genreSelected = $('.addGenre').val();
        const readingLevelSelected = $('.readingLevelNumber').val();
        const newDescription = $('.addDescription').val();
        //const author = req.user.id;
        
        const newPost = {
            title: newTitle,
            author: newAuthor,
            genre: genreSelected,
            readingLevel: readingLevelSelected,
            description: newDescription
        };
        console.log(url);
        $.post("https://infinite-river-85875.herokuapp.com/add", newPost, function (newbook) {
            //let newBookInLibrary = newBook.map(item, response) //=> drawRow(item));
            console.log(newbook);
        }, 'json');
    

        /*$.ajax({
                method: "POST",
                url: "https://infinite-river-85875.herokuapp.com/add",
                data: JSON.stringify(newPost),
                dataType: "json",
                contentType: 'application/json',
                
            })
            .done(function (result) {
                
                console.log(result);
            })*/
            
    });
}

function populateRandomGenre() {
    let dropdown = $('.selectGenre');
    dropdown.empty();
    dropdown.append('<option selected="true" disabled>Choose Genre</option>');
    dropdown.prop('selectedIndex', 0);
    const url = 'https://infinite-river-85875.herokuapp.com/getbooks/bygenre';

    $.getJSON(url, function (data) {
    $.each(data, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.abbreviation).text(entry.name));
        })
    });
}
/*
function submitRandomGenre() {
    $('.randomGenre').submit(function (event) {
        event.preventDefault();
        booksByGenre()
    })
}

function booksByGenre() { 
    url = 'https://infinite-river-85875.herokuapp.com/getbooks/bygenre';
    
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
*/
function submitBooksByTitle() {
    $('#searchTerm').submit(function (event) {
        event.preventDefault();
        var queryTarget = $(event.currentTarget).find('#query');
        searchTerm = queryTarget.val();
        booksByTitle(searchTerm);
    });
}


function booksByTitle(searchTerm) { 
    let url = 'https://infinite-river-85875.herokuapp.com/getbooks/byTitle/:title';
    const params = {
       title: searchTerm,
    };

    console.log(url);    

    $.getJSON(url, params, function (response) {
         searchedBooksInLibrary = response.map((item, response) => drawSearchRow(item))
         //$('#flickrResults').html(results)
         console.log(results)
         //});
});
}

function drawSearchRow(rowData) {
    var row = $("<tr />")
    $(".libraryBooksSearch").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
    row.append($("<td>" + rowData.title + "</td>"));
    row.append($("<td>" + rowData.author + "</td>"));
    row.append($("<td>" + rowData.readingLevel + "</td>"));
    row.append($("<td>" + rowData.genre + "</td>"));
    row.append($("<td>" + rowData.description + "</td>"));
    row.append($("<td>" + '<button class="deleteBook">Delete Book</button>' + "</td>"));
}

//returns books by genre
/*
//returns books by reading level
function booksByReadingLevel(searchTerm) { 
    url = 'https://infinite-river-85875.herokuapp.com/getbooks/byreadinglevel?readingLevel=' + //search entry;
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
    url = 'https://infinite-river-85875.herokuapp.com/getbooks/byreadinglevel/bygenre';
    const params = {
        
    };
    console.log(params),

    $.getJSON(url, params, function (response) {
         const results = //response.photos.photo.map((item, response) => buildThumbnailUrl(item));
         //$('#flickrResults').html(results)
         //console.log
         });
}
*/
$(document).ready(function () {
        //populateRandomGenre();
        //submitBooksByTitle();
        //drawTable();
        allBooks();
        postNewBook();
        //populateRandomGenre();
        });