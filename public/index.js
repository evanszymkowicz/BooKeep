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

//next buttons
//random functionality
//not allow to checkout book alert
//date appearance
//duplicates of genres
//search only returning one letter queries

var libraryofMainPageBooks = [];
var libraryIndex = 0;
//var tableNumber = 1;
var resultsShown = 5;


//returns all books
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
        //booksInLibrary = response.map((item, response) => drawRow(item));
        //watchDeleteBook();
        //const results = LibraryBookTableMaker();
        //drawRow(results);
        //deleteThisBook(item);
        renderIndividualBookListener();
         });
    
}

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

function drawBooks() {
    for (var i = libraryIndex; i < libraryIndex + resultsShown; i++) {
        if (i < libraryofMainPageBooks.length) {
        drawRow(libraryofMainPageBooks[i]);
        };
    };
}

function backButton() {
    $('.backAllData').on('click', function (event) {
    libraryIndex = libraryIndex - resultsShown; 
    libraryIndex = libraryIndex < 0 ? 0 : libraryIndex; 
    clearLibraryBooksDisplayed();
    drawBooks();
    renderIndividualBookListener();
    });
}
//Next() => { libraryIndex = libraryIndex + resultsShown; libraryIndex = libraryIndex > libraryofMainPAgeBooks.length ? libraryofMainPageBooks.length - resultsShown : libraryIndex; libraryIndex = libraryIndex < 0 ? 0 : libraryIndex; } 
//back() => { libraryIndex = libraryIndex - resultsShown; libraryIndex = libraryIndex < 0 ? 0 : libraryIndex; }
//drawBooks() => {for(var i = libraryIndex; i < libraryIndex + resultsShown; i++) { ... draw the book at index i ... }}

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
        <div class="hide">
            <td class="bookGenre hide">${rowData.genre}</td>
            <td class="bookRL hide">${rowData.readingLevel}</td>
        </div>
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
        const genreSelected = $('.addGenre').val().toUpperCase();
        const readingLevelSelected = $('.readingLevelNumber').val();
        const newDescription = $('.addDescription').val();
        //$('.addNewBookForm').toggle();
        //$('.mainPage').toggle();  
        
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
                
            });
        $('.addNewBookForm').toggle();
        $('.mainPage').toggle(); 
        //allBooks();
    });
}

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
    //$('.exitRandom').click(function (event) {
        //event.preventDefault();
        
    //});
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
    
    //var bookIdTargetTwo = $(this).getElementByID('#bookIDTWo').text();
    //console.log(bookIdTargetTwo);
    //does searchIDTwo need to be a param in function(event)?
    $('.deleteBook').click(function (event) {
        let bookIdTargetTwo = $("li:nth-of-type(1)").text();
        event.preventDefault();
        console.log(bookIdTargetTwo);
        handleDeleteBook(bookIdTargetTwo);
    });
    $('.editBook').click(function (event) {
        let bookIdTargetTwo = $("li:nth-of-type(1)").text();
        event.preventDefault();
        console.log(bookIdTargetTwo);
        renderIndividualBookEditCall(bookIdTargetTwo);
    });
    $('.checkoutBook').click(function (event) {
        let bookIdTargetTwo = $("li:nth-of-type(1)").text();
        event.preventDefault();
        console.log(bookIdTargetTwo);
        renderIndividualBookCheckoutCall(bookIdTargetTwo);
    });
    //$('.exitRandom').click(function (event) {
        //event.preventDefault();
        //$('.bookBody').toggle();
        //$('.mainPage').toggle();
    //});
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

function renderIndividualBookEditCall(id) {
    urlBook = 'https://infinite-river-85875.herokuapp.com/getbooks/byID/' + id;
    $.getJSON(urlBook,  function (response) {
        individualBookInLibraryEdit = response.map((response) => renderIndividualBookEdit(response));
        console.log(individualBookInLibraryEdit);
        console.log(response);
        });
}

//not sure if this will work because jquery is within html element. we shall see
//otherwise use call back in ajax success but for that have to know 
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
        console.log(bookIdTargetThree);
        submitIndividualBookEditForm(bookIdTargetThree);         
    });
}

function submitIndividualBookEditForm (id) {
    urlBook = 'https://infinite-river-85875.herokuapp.com/update/' + id;
        let form = {
        author: $('.individualBookAuthor').val(),
        title: $('.individualBookTitle').val(),
        readingLevel: $('.individualBookRL').val(),
        description: $('.individualBookDescription').val(),
        genre: $('.individualBookGenre').val()
        };
        console.log(form);
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
    urlBook = 'https://infinite-river-85875.herokuapp.com/getBooks/byID/' + id;
    $.getJSON(urlBook,  function (response) {
        individualBookCheckout = response.map((response) => renderIndividualBookCheckout(response));
        console.log(response);
        });
}

//added more specificity to checkout button

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
        console.log(bookIdTargetFour);
        handleBookCheckout(bookIdTargetFour);
        renderBookCheckoutPageHandler();
        drawCheckoutHeaders();
        //$('.bookBody').toggle();
    });
    //$('.exitRandom').click(function (event) {
        //event.preventDefault();
        //$('.bookBody').toggle();
        //$('.mainPage').toggle();
    //});
}
//worry that wont note that book is already checkedout
function handleBookCheckout (id) {
    urlBook = 'https://infinite-river-85875.herokuapp.com/checkout/' + id;
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

function renderBookCheckoutPageHandler () {
    checkoutUrl = 'https://infinite-river-85875.herokuapp.com/getbooks/checkedout';
    console.log(checkoutUrl);
    
    $.getJSON(checkoutUrl,  function (response) {
        checkedBooks = response.map((item, response) => drawCheckoutRow(item));
        console.log(checkedBooks);
    });
}

/*
.searchRowTable td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}


.searchRowTable tr {
    background-color: #ffffff;
}
*/

function drawCheckoutHeaders () {
    let searchHeader = 
    ` <div class="checkoutListPage">
        <div class="exitBookCheckoutSheet">
            <a href=""><button class="exitCheckOutListButton">&#10006;</button></a>
        </div>
        <div class="bookCheckoutListImage">
            <img src='https://i.imgur.com/oiibN6F.png'>
        </div>
        <table class="libraryBooksCheckedOut">
            <th class="bookID">ID</th>
            <th>Title</th>
            <div class="hide">
                <th class="hide">Student</th>
                <th class="hide">Checkout Date</th>
            </div>
            <th>&nbsp;</th>
        </table>
    `
    $('.bookBody').html(searchHeader);
    //$('.exitRandom').click(function (event) {
        //event.preventDefault();
        //$('.bookBody').toggle();
        //$('.mainPage').toggle();
    //});
}



function drawCheckoutRow(rowData) {
 let readableCheckout = rowData.checkoutDate.split('-');
 let checkoutSplicing = readableCheckout[2].split('T')[0];
 let prettyDate = readableCheckout[1] +'/'+ checkoutSplicing +'/'+ readableCheckout[0]; 
 console.log(prettyDate);
 console.log(readableCheckout);

 let row = 
    `<tr class="bookRow">
        <td class="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <div class="hide">
            <td class="studentName hide">${rowData.studentName}</td>
            <td class="bookcheckoutDate hide">${prettyDate}</td>
        </div>
        <td class="bookView"> 
            <button class="bookCheckInButton">Check In</button>
        </td> 
    </tr>
    `;
    //console.log(row);

    $(".libraryBooksCheckedOut").append(row);
    $('.bookCheckInButton').click(function (event) {
        event.preventDefault();
        let bookIdTargetFive = $(this).parent().siblings(":first").text();
        console.log(bookIdTargetFive);
        handleBookCheckin(bookIdTargetFive);
        //drawCheckoutHeaders();
        });
}

function handleBookCheckin (id) {
    urlBookin = 'https://infinite-river-85875.herokuapp.com/checkout/' + id;
    console.log(urlBookin);
    const checkinBookDate = {
        checkoutDate: null,
        studentName: null,
    }
    //console.log(checkoutBookDate);
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

function renderBookCheckinPage () {
    $('.checkedoutList').on('click', function(event) {
        event.preventDefault();
        $('.mainPage').toggle();
        renderBookCheckoutPageHandler();
        drawCheckoutHeaders();
        //$('.bookBody').toggle(); 
    });
}


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
    //$('.exitRandom').click(function (event) {
        //event.preventDefault();
        //$('.bookBody').toggle();
        //$('.mainPage').toggle();
    //});
}
/*
function retrieveSearchBook() {
    $('.searchLibrary').on('click', function(event) {
        event.preventDefault();
        renderLibraryBookSearchForm();
        submitBooksByTitle();
        //renderIndividualBookListener()
        //$('.mainPage').toggle();      
    });
}
*/

//need to format like librarybookssearch
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
    encodedSearchTerm = encodeURIComponent(searchTerm);
    let searchUrl = 'https://infinite-river-85875.herokuapp.com/getbooks/byTitle/' + encodedSearchTerm;  
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
    `
        <table class="libraryBooksSearch">
            <th>Click to view</th>
            <th class="bookID">ID</th>
            <th>Title</th>
            <th>Author</th>
            <div class="hide">
                <th class="hide">Genre</th>
                <th class="hide">Reading Level</th>
            </div>
        </table>
        <div>
            <button class="exitSearch">&#9650;</button>
        </div>
    `
    $('.searchRowTable').html(header);
    $('.exitSearch').click(function (event) {
        event.preventDefault();
        $('.libraryBooksSearch').toggle();
        //$('.mainPage').toggle();
    });

}


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
        console.log(bookIdTarget)
        searchId = bookIdTarget;
        individualUrl = 'https://infinite-river-85875.herokuapp.com/getbooks/byID/' + searchId;
        $.getJSON(individualUrl,  function (response) {
            individualBookInLibrary = response.map((response) => renderIndividualBook(response));
            console.log(individualBookInLibrary);
            console.log(response);
            //console.log(item);
            });
    });
        renderIndividualBookListener();
}

$(document).ready(function () {
        //populateRandomGenre();
        //submitBooksByTitle();
        //submitRandomGenre();
        //drawTable();
        allBooks();
        retrieveRandomBook();
        listenerNewBook();
        //retrieveSearchBook();
        renderIndividualBookListener();
        renderBookCheckinPage();
        //postNewBook();
        //watchCheckoutBook();
        //populateRandomGenre();
        //watchDeleteBook();
        //compileRandomArray();
        //randomGenreBooks();
        });