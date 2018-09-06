"use strict"

var libraryofMainPageBooks = [];
var libraryIndex = 0;
var resultsShown = 5;

//calls all library books to main page
function allBooks() { 
    url = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(url,  function (response) {
        libraryofMainPageBooks = response;
        libraryIndex = 0;
        clearLibraryBooksDisplayed();
        drawBooks();
        backButton();
        nextButton();
        renderLibraryBookSearchForm();
        submitBooksByTitle();
        renderIndividualBookListener();
         });
    
}

//clears library books for each occurance of the next and back button and appends table headers
function clearLibraryBooksDisplayed(){
    $('.libraryBooksDisplayed').html('');
    $('.libraryBooksDisplayed').append(`
                <tr>
                    <th>&nbsp;</th>
                    <th class= "bookID">ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <div class="hide">
                        <th class="hide">Genre</th>
                        <th class="hide">Reading Level</th>
                    </div>
                </tr>`);
}

//handles next button call
function nextButton() {
    $('.nextAllData').on('click', function (event) {
    libraryIndex = libraryIndex + resultsShown; 
    libraryIndex = libraryIndex > libraryofMainPageBooks.length ? libraryofMainPageBooks.length - resultsShown : libraryIndex;
    libraryIndex = libraryIndex < 0 ? 0 : libraryIndex;
    console.log(libraryIndex);
    clearLibraryBooksDisplayed();
    drawBooks();
    renderIndividualBookListener();
    });
}

//handles back button call
function backButton() {
    $('.backAllData').on('click', function (event) {
    libraryIndex = libraryIndex - resultsShown; 
    libraryIndex = libraryIndex < 0 ? 0 : libraryIndex; 
    clearLibraryBooksDisplayed();
    drawBooks();
    renderIndividualBookListener();
    });
}

//pulls books from array and indexes them based on what library book occurance we are on
function drawBooks() {
    for (var i = libraryIndex; i < libraryIndex + resultsShown; i++) {
        if (i < libraryofMainPageBooks.length) {
        drawRow(libraryofMainPageBooks[i]);
        };
    };
}

//draws all library book tables
function drawRow(rowData) {
    let row = 
    `
    <tr class="bookRow" />
        <td class="bookView"> 
            <button type"submit" class="bookViewButton">View</button>
        </td>
        <td class="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <td class="bookAuthor">${rowData.author}</td>
        <td class="bookGenre hide">${rowData.genre}</td>
        <td class="bookRL hide">${rowData.readingLevel}</td>
    </tr>
    `;
    $(".libraryBooksDisplayed").append(row);
}

//listens for "Add a Book" to be pressed
function listenerNewBook() {
    $('.addABook').on('click', function (event) {
        event.preventDefault();
        $('.mainPage').toggle();
        renderLibraryBookNew();
    });
}

//renders add a library book form
function renderLibraryBookNew () {
    const libraryBooksNew = `
    <div class="addNewBookForm">
        <div class="exitNewBookForm">
            <a href=""><button class="exitNewBookFormButton">&#10006;</button></a>
        </div>
        <div class="addANewBookImage">
            <img src="https://i.imgur.com/oiibN6F.png">
        </div>
        <form class="addANewBook">
            Book Title:
            <input type="text" name="bookTitle" class="addTitle"></br>
            Author:
            <input type="text" name="bookAuthor" class="addAuthor"></br>
            Genre:
            <input type="text" name="bookGenre" class="addGenre"></br>
            Reading Level:
            <select name="readingLevel" class="readingLevelNumber"></br>
                <option value="gradePK">Pre-K</option>
                <option value="gradeK">Kindergarten</option>
                <option value="grade1">Grade 1</option>
                <option value="grade2">Grade 2</option>
                <option value="grade3">Grade 3</option>
                <option value="grade4">Grade 4</option>
                <option value="grade5">Grade 5</option>
                <option value="grade6">Grade 6</option>
            </select></br>
            Description:
            <textarea type="text" name="bookDescription" class="addDescription"></textArea></br>
            <div class="submitNewBookListener">
                <button class="submitNewBook">Submit</button>
            </div>
        </form>   
    </div>
    `;
    $('.bookBody').html(libraryBooksNew);
    submitNewBook()
}

//submits new book to api
function submitNewBook() {
    $('.submitNewBook').on('click', function(event) {
        event.preventDefault();
        const newTitle = $('.addTitle').val();
        const newAuthor = $('.addAuthor').val();
        const genreSelected = $('.addGenre').val().toUpperCase();
        const readingLevelSelected = $('.readingLevelNumber').val();
        const newDescription = $('.addDescription').val();
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
                
            });
        $('.addNewBookForm').toggle();
        $('.mainPage').toggle(); 
    });
}

//listens for "view" button to be pressed on each book
function renderIndividualBookListener () {
    $('.bookViewButton').on('click', function (event) {
        event.preventDefault();
        var bookIdTarget = $(this).parent().next().text();
        var searchId = bookIdTarget;
        var individualUrl = 'https://infinite-river-85875.herokuapp.com/getbooks/byID/' + searchId;
        $.getJSON(individualUrl,  function (response) {
            individualBookInLibrary = response.map((response) => renderIndividualBook(response));
            console.log(individualBookInLibrary);
            console.log(response);
            });
        $('.mainPage').toggle();
    });
}

//renders individual book that "view" was pressed on 
function renderIndividualBook (book) {
    const individualBook = `
    <div class="individualBookPage">
        <div class="exitIndividualBook">
            <a href=""><button class="individualBookExitButton">&#10006;</button><a>
        </div>
        <div class="renderIndividualImage">
            <img src='https://i.imgur.com/oiibN6F.png'>
        </div>
        <ul class="individualBookList">
            <li class="bookID">${book.id}</li>
            <li> <strong>Title:</strong> ${book.title}</li>
            <li> <strong>Author:</strong> ${book.author}</li>
            <li> <strong>Genre:</strong> ${book.genre}</li>
            <li> <strong>Reading Level:</strong> ${book.readingLevel}</li>
            <li> <strong>Description:</strong> ${book.description}</li>
        </ul>
        <div class="selectorButtons">
            <button class="deleteBook">Delete</button>
            <button class="editBook">Edit</button>
            <button class="checkoutBook">Checkout</button>
        </div>
    </div>
    `;
    $('.bookBody').html(individualBook);
    $('.deleteBook').click(function (event) {
        let bookIdTargetTwo = $("li:nth-of-type(1)").text();
        event.preventDefault();

        handleDeleteBook(bookIdTargetTwo);
    });
    $('.editBook').click(function (event) {
        let bookIdTargetTwo = $("li:nth-of-type(1)").text();
        event.preventDefault();
        renderIndividualBookEditCall(bookIdTargetTwo);
    });
    $('.checkoutBook').click(function (event) {
        let bookIdTargetTwo = $("li:nth-of-type(1)").text();
        event.preventDefault();
        renderIndividualBookCheckoutCall(bookIdTargetTwo);
    });
}

//deletes book from api
function handleDeleteBook (id) {
    var urlBook = 'https://infinite-river-85875.herokuapp.com/delete/' + id;
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

//makes call to api to return book information for edit
function renderIndividualBookEditCall(id) {
    urlBook = 'https://infinite-river-85875.herokuapp.com/getbooks/byID/' + id;
    $.getJSON(urlBook,  function (response) {
        individualBookInLibraryEdit = response.map((response) => renderIndividualBookEdit(response));
        });
}

//renders book information in form
function renderIndividualBookEdit (book) {
    const individualBookEdit = 
    `
    <div class="individualBookEditPage">
        <div class="exitNewBookEditForm">
            <a href=""><button class="exitNewBookEditButton">&#10006;</button></a>
        </div>
        <div class="bookEditPageImage">
            <img src='https://i.imgur.com/oiibN6F.png'>
        </div>
        <h2 class="randomPageTitle">Update Book Info</h2>
        <h4 class="bookID">${book.id}</h4>
        <form class="inidividualBookForm">
            <label> <strong>Title:</strong></label> 
            <input type="text" class = "individualBookTitle" value= '${book.title}'></br>
            <label><strong>Author:</strong></label>
            <input type="text" class = "individualBookAuthor" value= '${book.author}'></br>
            <label><strong>Genre:</strong></label>
            <input type="text" class = "individualBookGenre"value= '${book.genre}'></br>
            <label><strong>Reading Level:</strong></label>
            <input type="text" class = "individualBookRL"value= '${book.readingLevel}'></br>
            <label><strong>Description:</strong></label>
            <textarea type="text" class = "individualBookDescription" value=''>${book.description}</textarea></br>
            <button class="submitBookEdit">Submit</button>
        </form>
    </div>
    `;
    $('.bookBody').html(individualBookEdit);
    $('.submitBookEdit').click(function (event) {
        event.preventDefault();
        var bookIdTargetThree = $("h4:nth-of-type(1)").text();

        submitIndividualBookEditForm(bookIdTargetThree);         
    });
}

//submits edits to api
function submitIndividualBookEditForm (id) {
    var urlBook = 'https://infinite-river-85875.herokuapp.com/update/' + id;
    let form = {
        author: $('.individualBookAuthor').val(),
        title: $('.individualBookTitle').val(),
        readingLevel: $('.individualBookRL').val(),
        description: $('.individualBookDescription').val(),
        genre: $('.individualBookGenre').val()
        };
    $.ajax({
        url: urlBook,
        method: 'PUT',
        data: JSON.stringify(form),
        enctype: 'multipart/form-data',
        contentType: 'application/json'
        });
    $('.individualBookEdit').toggle();
    $('.mainPage').toggle();
}
function renderIndividualBookCheckoutCall(id) {
    var urlBook = 'https://infinite-river-85875.herokuapp.com/getBooks/byID/' + id;
    $.getJSON(urlBook,  function (response) {
        individualBookCheckout = response.map((response) => renderIndividualBookCheckout(response));
        });
}

//renders book checkout form
function renderIndividualBookCheckout(book) {
    const bookCheckoutForm = `
    <div class= "bookCheckoutPage">
        <div class="exitCheckoutEditForm">
            <a href=""><button class="exitCheckOutButton">&#10006;</button></a>
        </div>
        <div class="bookCheckoutImage">
            <img src='https://i.imgur.com/oiibN6F.png'>
        </div>
        <form class="inidividualBookCheckoutForm">
            <h2 class="checkoutFormTitle">Checkout Book</h2>
            <h6 class="BookIDFour bookID">${book.id}</h6>
            <label><strong>Student Name:</strong></label>
            <input type="text" class = "studentName"></br>
            <label><strong>Checkout Date:</strong></label>
            <input type="date" class = "checkoutDate"></br>
            <button class="submitCheckout">Submit</checkout>
        </form>
    </div>
    `
    $('.bookBody').html(bookCheckoutForm);
    $('.submitCheckout').click(function (event) {
        event.preventDefault();
        var bookIdTargetFour = $("h6:nth-of-type(1)").text();
        handleBookCheckout(bookIdTargetFour);
        renderBookCheckoutPageHandler();
        drawCheckoutHeaders();
    });
}

//submits checkout information to api
function handleBookCheckout (id) {
    var urlBook = 'https://infinite-river-85875.herokuapp.com/checkout/' + id;
    const checkoutBookDate = {
        checkoutDate: $('.checkoutDate').val(),
        studentName: $('.studentName').val(),
    }
    console.log()
    console.log(checkoutBookDate);
    $.ajax({
        url: urlBook,
        method: 'PUT',
        data: JSON.stringify(checkoutBookDate),
        dataType: "json",
        contentType: 'application/json',
        });
}

//makes call to api for all books that have been checked out
function renderBookCheckoutPageHandler () {
    var checkoutUrl = 'https://infinite-river-85875.herokuapp.com/getbooks/checkedout';
    $.getJSON(checkoutUrl,  function (response) {
        checkedBooks = response.map((item, response) => drawCheckoutRow(item));
    });
}

//draws checkout page header
function drawCheckoutHeaders () {
    let searchHeader = ` 
        <div class="checkoutListPage">
            <div class="exitBookCheckoutSheet">
                <a href=""><button class="exitCheckOutListButton">&#10006;</button></a>
            </div>
            <div class="bookCheckoutListImage">
                <img src='https://i.imgur.com/oiibN6F.png'>
            </div>
            <table class="libraryBooksCheckedOut">
                <th class="bookID">ID</th>
                <th>Title</th>
                <th class="hide">Student</th>
                <th class="hide">Checkout Date</th>
                <th>&nbsp;</th>
            </table>
        </div>

    `
    $('.bookBody').html(searchHeader);
}

//draws all checkedout books to checkout page and formats json data correctly
function drawCheckoutRow(rowData) {
 let readableCheckout = rowData.checkoutDate.split('-');
 let checkoutSplicing = readableCheckout[2].split('T')[0];
 let prettyDate = readableCheckout[1] +'/'+ checkoutSplicing +'/'+ readableCheckout[0]; 
 let row = 
    `<tr class="bookRow">
        <td class="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <td class="studentName hide">${rowData.studentName}</td>
        <td class="bookcheckoutDate hide">${prettyDate}</td>
        <td class="bookView"> 
            <button class="bookCheckInButton">Check In</button>
        </td> 
    </tr>
    `;
    $(".libraryBooksCheckedOut").append(row);
    $('.bookCheckInButton').click(function (event) {
        event.preventDefault();
        let bookIdTargetFive = $(this).parent().siblings(":first").text();
        handleBookCheckin(bookIdTargetFive);
        });
}

//edits checkin information to null and removes it from page
function handleBookCheckin (id) {
    var urlBookin = 'https://infinite-river-85875.herokuapp.com/checkout/' + id;
    console.log(urlBookin);
    const checkinBookDate = {
        checkoutDate: null,
        studentName: null,
    }
    $.ajax({
        url: urlBookin,
        method: 'PUT',
        data: JSON.stringify(checkinBookDate),
        dataType: "json",
        contentType: 'application/json',
        });
    renderBookCheckoutPageHandler();
    drawCheckoutHeaders();
}

//listens for "Books on Loan" button to be pressed
function renderBookCheckinPage () {
    $('.checkedoutList').on('click', function(event) {
        event.preventDefault();
        $('.mainPage').toggle();
        renderBookCheckoutPageHandler();
        drawCheckoutHeaders(); 
    });
}

//listens for random book button to be pressed
function retrieveRandomBook() {
    $('.libraryRandom').on('click', function(event) {
        event.preventDefault();
        renderLibraryBookRandom();
        compileRandomArray();
        $('.mainPage').toggle();
    });
}

//renders random book page form
function renderLibraryBookRandom () {
    const libraryBooksRandom = `
    <div class="booksRandomPage">
        <div class="exitBookRandomPage">
            <a href=""><button class="exitRandomButton">&#10006;</button></a>
        </div>
        <div class="bookRandomImage">
            <img src='https://i.imgur.com/oiibN6F.png'>
        </div>
        <div class ="randomBookPage">
            <h2 class="randomPageTitle">Randomly Generate a book</h2>
            <div class="randomInputForm">
                <label class="randomGenreLabel">By Genre: </label>
                <select id="selectGenre"></select>
                <button class="randomGenre">submit</button></br>
                <label class="randomGenreLabel">By Reading Level: </label>
                <select id="selectRL"></select>
                <button class="randomReadingLevel">Submit</button>
            </div>
        <div class="randomArrayCompiler">
        </div>
    </div>
    `;
    $('.bookBody').html(libraryBooksRandom);
}

//render library book search form
function renderLibraryBookSearchForm () {
    const libraryBookSearch = `
    <div class ="searchLibraryPage">
        <input id="query" type="text" name="search" class="searchLocation"  placeholder="Search book title" role="search" aria-label="Search">
        <button type="button" class="submitBookSearch" aria-label="Search">&#x1F50D</button>
     </div>
     <div class="searchRowTable">
     </div>
    `;
    $('.searchBody').html(libraryBookSearch);
}

//listens for submit search button to be pressed
function submitBooksByTitle() {
    $('.submitBookSearch').on('click', function (event) {
        event.preventDefault();
        var searchTerm = $('#query').val();
        drawSearchHeaders();
        booksByTitle(searchTerm);
    });
}

//searches api for title query, returns all information and sends it to be drawn
function booksByTitle(searchTerm) { 
    let encodedSearchTerm = encodeURIComponent(searchTerm);
    let searchUrl = 'https://infinite-river-85875.herokuapp.com/getbooks/byTitle/' + encodedSearchTerm;  
    $.getJSON(searchUrl, function (response) {
         let earchedBooksInLibrary = response.map((item, response) => drawSearchRow(item));
        });
}

//draws search table headers
function drawSearchHeaders () {
    let header = `
        <table class="libraryBooksSearch">
            <th>Click to view</th>
            <th class="bookID">ID</th>
            <th>Title</th>
            <th>Author</th>
            <th class="hide">Genre</th>
            <th class="hide">Reading Level</th>
        </table>
        <div>
            <button class="exitSearch">&#9650;</button>
        </div>
    `
    $('.searchRowTable').html(header);
    $('.exitSearch').click(function (event) {
        event.preventDefault();
        $('.libraryBooksSearch').toggle();
    });
}

//draws search results
function drawSearchRow(rowData) {
 let row = 
    `
    <tr class="bookRow">
        <td class="bookView"> 
            <button class="bookViewButton">View</button>
        </td>
        <td class="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <td class="bookAuthor">${rowData.author}</td>
        <div class="hide">
            <td class="bookRL hide">${rowData.readingLevel}</td>
            <td class="bookGenre hide">${rowData.genre}</td>
        </div>
    </tr>
    `;
    //console.log(row);
    $(".libraryBooksSearch").append(row);
    $('.bookViewButton').on('click', function (event) {
        event.preventDefault();
        var bookIdTarget = $(this).parent().next().text();
        let searchId = bookIdTarget;
        let individualUrl = 'https://infinite-river-85875.herokuapp.com/getbooks/byID/' + searchId;
        $.getJSON(individualUrl,  function (response) {
            var individualBookInLibrary = response.map((response) => renderIndividualBook(response));
            });
    });
        renderIndividualBookListener();
}

$(document).ready(function () {
        allBooks();
        retrieveRandomBook();
        listenerNewBook();
        renderIndividualBookListener();
        renderBookCheckinPage();
        });