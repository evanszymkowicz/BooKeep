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
checkedOutbooks = []
var tableNumber = 1;
var resultsShown = 2;

//returns all books
function allBooks() { 
    url = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(url,  function (response) {
        libraryOfBooks = response;
        booksInLibrary = response.map((item, response) => drawRow(item));
        //watchDeleteBook();
        //const results = LibraryBookTableMaker();
        //drawRow(results);
        //deleteThisBook(item);
        renderIndividualBookListener();
         });
    
}

function drawRow(rowData) {
    let row = 
    `<tr class="bookRow" />
        <td class="bookView"> 
            <button type"submit" class="bookViewButton">View</button>
        </td>
        <td id="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <td class="bookAuthor">${rowData.author}</td>
        <td class="bookRL">${rowData.readingLevel}</td>
        <td class="bookGenre">${rowData.genre}</td>
        <td class="bookDesc"> ${rowData.description} </td>
    </tr>
    `;
    //console.log(row);
    $(".libraryBooksDisplayed").append(row);
    //renderIndividualBookListener();
}
//need to either always render new book, or have someway of auto refreshing json data
//maybe create timer that makes call often
function listenerNewBook() {
    $('.addABook').on('click', function (event) {
        event.preventDefault();
        $('.mainPage').toggle();
        renderLibraryBookNew();
    });

}

function submitNewBook() {
    $('.submitNewBook').on('click', function(event) {
        event.preventDefault();
        const newTitle = $('.addTitle').val();
        const newAuthor = $('.addAuthor').val();
        const genreSelected = $('.addGenre').val();
        const readingLevelSelected = $('.readingLevelNumber').val();
        const newDescription = $('.addDescription').val();
        $('.addNewBookForm').toggle();
        
         //const author = req.user.id;
        
        const newPost = {
            title: newTitle,
            author: newAuthor,
            genre: genreSelected,
            readingLevel: readingLevelSelected,
            description: newDescription
        };
        $.ajax({
                method: "POST",
                url: "https://infinite-river-85875.herokuapp.com/add",
                data: JSON.stringify(newPost),
                dataType: "json",
                contentType: 'application/json',
                
            })
        $('.mainPage').toggle();      
    });
}

function renderLibraryBookNew () {
    const libraryBooksNew = `
    <div class="addNewBookForm">
        <form class="addANewBook">
            Book Title:
            <input type="text" name="bookTitle" class="addTitle">
            Author:
            <input type="text" name="bookAuthor" class="addAuthor">
            Genre:
            <input type="text" name="bookGenre" class="addGenre">
            Reading Level:
            <select name="readingLevel" class="readingLevelNumber">
                <option value="gradePK">Pre-K</option>
                <option value="gradeK">K</option>
                <option value="grade1">1</option>
                <option value="grade2">2</option>
                <option value="grade3">3</option>
                <option value="grade4">4</option>
                <option value="grade5">5</option>
                <option value="grade6">6</option>
            </select>
            Description:
            <input type="text" name="bookDescription" class="addDescription">
            <button class="submitNewBook">Submit</button>
        </form>
    </div>
    `;
    $('.bookBody').html(libraryBooksNew);
    submitNewBook()
}

function renderIndividualBookListener () {
    $('.bookViewButton').on('click', function (event) {
        event.preventDefault();
        var bookIdTarget = $(this).parent().next().text();
        searchId = bookIdTarget;
        individualUrl = 'https://infinite-river-85875.herokuapp.com/getbooks/byID/' + searchId;
        $.getJSON(individualUrl,  function (response) {
            individualBookInLibrary = response.map((response) => renderIndividualBook(response));
            console.log(individualBookInLibrary);
            console.log(response);
            //console.log(item);
            });
        $('.mainPage').toggle();
    });
}

function renderIndividualBook (book) {
    const individualBook = `
    <div class="individualBookPage"
        <img src=''>
        <ul class="inidividualBookList">
            <li id="bookIDTwo">${book.id}</li>
            <li> Title: ${book.title}</li>
            <li> Author: ${book.author}</li>
            <li> Genre: ${book.genre}</li>
            <li> Reading Level: ${book.readingLevel}</li>
            <li> Description: ${book.description}</li>
            <li><button class="deleteBook">Delete</button></li>
            <li><button class="editBook">Edit</button></li>
            <li><button class="checkoutBook">Checkout</button></li>
        </ul>
    </div>
    `;
    $('.bookBody').html(individualBook);
    //var bookIdTargetTwo = $(this).getElementByID('#bookIDTWo').text();
    //console.log(bookIdTargetTwo);
    //does searchIDTwo need to be a param in function(event)?
    $('.deleteBook').click(function (event) {
        var bookIdTargetTwo = $("li:nth-of-type(1)").text();
        event.preventDefault();
        console.log(bookIdTargetTwo);
        handleDeleteBook(bookIdTargetTwo);
    });
    $('.editBook').click(function (event) {
        event.preventDefault();
        renderIndividualBookEditCall(bookIdTargetTwo);
    });
    $('.checkoutBook').click(function (event) {
        event.preventDefault();
        renderIndividualBookCheckout(bookIdTargetTwo);
    });
}


function handleDeleteBook (id) {
    urlBook = 'https://infinite-river-85875.herokuapp.com/delete/' + id;
    console.log(urlBook);
    $.ajax({
            url: urlBook,
            type: 'DELETE',
            dataType: 'json',
            contentType: 'application/json'
        });
    $('.individualBookPage').toggle();
    $('.mainPage').toggle();
}
/*
function renderIndividualBookEditCall(id) {
    urlBook = 'https://infinite-river-85875.herokuapp.com/getBooks/byID/' + id;
    $.getJSON(urlBook,  function (response) {
        individualBookInLibraryEdit = response.map((item, response) => renderIndividualBookEdit(item));
        });
}

//not sure if this will work because jquery is within html element. we shall see
//otherwise use call back in ajax success but for that have to know 
function renderIndividualBookEdit (book) {
    const individualBookEdit = 
    `
    <img src=''>
    <legend>Update Book Info</legend>
    <form class="inidividualBookForm">
        <p class="BookIDThree">${book.id}</p>
        <label> Title:</label></br> 
        <input type="text" class = "individualBookTitle" value= '${book.title}'></br>
        <label> Author:</label></br>
        <input type="text" class = "individualBookAuthor" value= '${book.author}'></br>
        <label> Genre:</label></br>
        <input type="text" class = "individualBookGenre"value= '${book.genre}'></br>
        <label> Reading Level:</label></br>
        <input type="text" class = "individualBookRL"value= '${book.readingLevel}'></br>
        <label> Description:</label></br>
        <input type="text" class = "individualBookDescription"value= '${book.description}'></br>
    <button class="submitBookEdit">Submit</button>
    `;
    $('.bookBody').html(individualBookEdit);
    var bookIdTargetThree = $(this).closest('p').find(".BookIDThree");
        searchIdThree = bookIdTargetThree.text();
    submitIndividualBookEditForm(searchIdThree);
}

function submitInidividualBookEditForm (id) {
    urlBook = 'https://infinite-river-85875.herokuapp.com/update/' + id;
    $('.submitBookEdit').click(function (event) {
        event.preventDefault();
        const form = new FormData();
        form.append('title', $('.individualBookTitle').val());
        form.append('author', $('.individualBookAuthor').val());
        form.append('genre', $('.individualBookGenre').val());
        form.append('readingLevel', $('.individualBookRL').val());
        form.append('description', $('.individualBookDescription').val());
    $.ajax({
        url: urlBook,
        method: 'PUT',
        data: form,
        enctype: 'multipart/form-data',
        });
    $('.individualBookForm').toggle()
    });
}

function renderIndividualBookCheckout (id) {
    const bookCheckoutForm = `
    <form class="inidividualBookCheckoutForm">
        <h2 class="checkoutFormTitle">Checkout Book</h2>
        <p class="BookIDFour bookID">${book.id}</p>
        <label> Student Name:</label></br> 
        <input type="text" class = "studentName"></br>
        <label> Checkout Date:</label></br>
        <input type="date" class = "checkoutDate"></br>
        <button class="submitCheckout">Submit</checkout>
    `
    $('.bookBody').html(bookCheckoutForm);
    var bookIdTargetFour = $(this).closest('p').find(".BookIDFour");
        searchIdFour = bookIdTargetFour.text();
    handleBookCheckout(bookIdTargetFour);
}

function handleBookCheckout (id) {
    urlBook = 'https://infinite-river-85875.herokuapp.com/checkout/' + id;
    $('.submitCheckout').click(function (event) {
        event.preventDefault();
    const checkoutBookDate = {
        checkoutDate: $('.checkoutDate').val(),
    }
    $.ajax({
        url: urlBook,
        method: 'PUT',
        data: JSON.stringify(checkoutBookDate),
        dataType: "json",
        contentType: 'application/json',
        });
    });
    $('.individualBookCheckoutForm').toggle();
}

function renderBookCheckoutPageHandler () {
    checkoutUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(checkoutUrl,  function (response) {
        var checkedBooks = $.map(response, function (k) {
            return k;
        });
        checkedOutBooks.push(checkedBooks);
        var totalCheckedOutBooks = _.reject(users, ['checkedOutDate', null]);
        console.log(totalCheckedOutBooks);

}
*/
function retrieveRandomBook() {
    $('.libraryRandom').on('click', function(event) {
        event.preventDefault();
        renderLibraryBookRandom();
        compileRandomArray();
        $('.mainPage').toggle();      
    });
}

function renderLibraryBookRandom () {
    const libraryBooksRandom = `
    <div class ="randomBookPage">
    <button class="randomGenre">Random Book by Genre</button>
    <select id="selectGenre"></select>
    <button class="randomReadingLevel">Random Book by Reading Level</button>
    <select id="selectRL"></select>
    <button class="randomBoth">Random Book by Genre and Reading Level</button>
        <form>
            <select id="selectGenreBoth"></select>
            <select id="selectRLBoth"></select>
        </form>
    <div class="randomArrayCompiler"
    <div>
    <button class="exitRandom">Exit</button>
    </div>
    `;
    $('.bookBody').html(libraryBooksRandom);
    $('.exitRandom').click(function (event) {
        event.preventDefault();
        $('.randomBookPage').toggle();
    });
}

function retrieveSearchBook() {
    $('.searchLibrary').on('click', function(event) {
        event.preventDefault();
        renderLibraryBookSearchForm();
        submitBooksByTitle();
        //renderIndividualBookListener()
        $('.mainPage').toggle();      
    });
}

function renderLibraryBookSearchForm () {
    const libraryBookSearch = `
    <div class ="searchLibraryPage">
            <input id="query" type="text" name="search" class="searchLocation"  placeholder="Search book title" role="search" aria-label="Search">
        <br>
          <button type="button" class="submitBookSearch" aria-label="Search">
     </div>
     <div class="searchRowTable">
     </div>
    `;
    $('.bookBody').html(libraryBookSearch);
}

/*
function watchDeleteBook() {
    
        console.log(bookIdTarget);
        //var closestBookID = $(this).first().text();
        console.log(searchId);
        //deleteBook(closestBookID)
        //$(this).closest("tr").html('');
        
        
    })  
}*

function deleteBook(item) {
    urlBook = 'https://infinite-river-85875.herokuapp.com/delete/' + item;
    console.log(urlBook);
    $.ajax({
            url: urlBook,
            type: 'DELETE',
            dataType: 'json',
            contentType: 'application/json'
        });
}

*/
function submitBooksByTitle() {
    $('.submitBookSearch').on('click', function (event) {
        event.preventDefault();
        //var queryTarget = $(event.currentTarget).find('#query');
        //console.log(queryTarget)
        var searchTerm = $('#query').val();
        console.log(searchTerm)
        drawSearchHeaders();
        booksByTitle(searchTerm);
    });
}


function booksByTitle(searchTerm) { 
    let searchUrl = 'https://infinite-river-85875.herokuapp.com/getbooks/byTitle/' + searchTerm;  
    console.log(searchUrl);
    $.getJSON(searchUrl, function (response) {
         searchedBooksInLibrary = response.map((item, response) => drawSearchRow(item));
         //$('#flickrResults').html(results)
         console.log(searchedBooksInLibrary);
         console.log(response)
         //});
});
}

function drawSearchHeaders () {
    let header = 
    `<table class="libraryBooksSearch">
            <th>Click to view</th>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Reading Level</th>
            <th>Description</th>
        </table>
    `
    $('.searchRowTable').html(header);
}


function drawSearchRow(rowData) {
 let row = 
    `<tr class="bookRow">
        <td class="bookView"> 
            <button class="bookViewButton">View</button>
        </td>
        <td class="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <td class="bookAuthor">${rowData.author}</td>
        <td class="bookRL">${rowData.readingLevel}</td>
        <td class="bookGenre">${rowData.genre}</td>
        <td class="bookDesc"> ${rowData.description} </td>
    </tr>
    `;
    //console.log(row);
    $(".libraryBooksSearch").append(row);
}

/*
var checkoutArray = []

function compileCheckoutArray() {
    checkoutUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(checkoutUrl,  function (response) {
        var allTheCO = $.map(response, function (k) {
            return k.checkoutDate;
        });
        //function removeDuplicateUsingSet(arr){
            //let unique_array = Array.from(new Set(arr))
            //return unique_array
            //}
        checkoutArray.push(allTheCO);       
        //removeDuplicateUsingSet(libraryOfGenres);
        //console.log(unique_array);
        //let unique_array = [...new Set(libraryOfGenres)];
        //console.log(unique_array);
        //populateRandomGenre(allTheGenres);
    });
}


function watchCheckoutBook () {
    $('.checkoutBook').click(function (event) {
        event.preventDefault();
        var bookIdTargetCheckout = $(this).closest('tr').find(".BookID");
        searchId = bookIdTarget.children();
        console.log(bookIdTarget);
        //var closestBookID = $(this).first().text();
        console.log(searchId);
        //deleteBook(closestBookID)
        //$(this).closest("tr").html('');
        checkoutPopUp()
        updateBookCheckout(bookIdTargetCheckout, bookCheckedout);
    });
    
    
}

function watchSubmitCheckoutBook() {
    $('.submitCheckoutBook').click(function (event) {
        event.preventDefault();
        var bookCheckedout = $('.dateCheckedOut').val();
        compileCheckoutArray();
    });
}

function updateBookCheckout(item, date) {
    urlCheckout = 'https://infinite-river-85875.herokuapp.com/checkout/' + item;
    console.log(urlBook);
        //const author = req.user.id;
    const checkingOutBook = {
            checkoutDate: bookCheckedout,
        };
    $.ajax({
                method: "PUT",
                url: urlCheckout,
                data: JSON.stringify(checkingOutBook),
                dataType: "json",
                contentType: 'application/json',
            })
            .done(function (result) {
                var checkoutBookList = result.map((item, results) => drawCheckoutbook(item));
            });
            
}

function checkoutPopUp() {
    return
        `
            <div>
                <form class="checkoutStudentName">
                    Student Full Name:
                    <input type="text" name="studentName" class="studentName">
                    Date Checked Out:
                    <input type="date" name="dateCheckedOut" class="dateCheckedOut">
                </form>
                <button type="button" class="submitCheckoutBook" name="Submit"> 
            </div>
        </div>
        `
}


function drawCheckoutbook(rowData) {
 let row = 
    `<tr class="bookRow" />
        <td class="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <td class="bookCheckoutDate">${rowData.checkoutDate}</td>
        <td class="bookCheckout">$</td>
        <td class="bookCheckin"> 
            <button class="studentNameCheckin"></button>
        </td>
    </tr>
    `;
    //console.log(row);
    $(".CheckedoutBooksDisplayed").append(row);
}
*/

$(document).ready(function () {
        //populateRandomGenre();
        //submitBooksByTitle();
        //submitRandomGenre();
        //drawTable();
        allBooks();
        retrieveRandomBook();
        listenerNewBook();
        retrieveSearchBook();
        renderIndividualBookListener();
        //postNewBook();
        //watchCheckoutBook();
        //populateRandomGenre();
        //watchDeleteBook();
        //compileRandomArray();
        //randomGenreBooks();
        });