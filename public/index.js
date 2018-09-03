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

libraryOfBooks = []
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
         });
    
}

function drawRow(rowData) {
    let row = 
    `<tr class="bookRow" />
        <td class="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <td class="bookAuthor">${rowData.author}</td>
        <td class="bookRL">${rowData.readingLevel}</td>
        <td class="bookGenre">${rowData.genre}</td>
        <td class="bookDesc"> ${rowData.description} </td>
        <td class="bookDelete"> 
            <button class="deleteBook">Delete Book</button>
        </td>
    </tr>
    `;
    //console.log(row);
    $(".libraryBooksDisplayed").append(row);
    
}

function listenerNewBook() {
    $('.addABook').on('click', function (event) {
        event.preventDefault();
        $('.mainPage').toggle();
        renderLibraryBookNew()
    });
    submitNewBook()
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
         $('.mainPage').toggle();
         //const author = req.user.id;
        
        const newPost = {
            title: newTitle,
            author: newAuthor,
            genre: genreSelected,
            readingLevel: readingLevelSelected,
            description: newDescription
        };
        //console.log(url);
        /*$.post("https://infinite-river-85875.herokuapp.com/add", newPost) 
            .done(function (newbook) {
            //let newBookInLibrary = newBook.map(item, response) //=> drawRow(item));
            console.log(newbook);
        });*/
    

        $.ajax({
                method: "POST",
                url: "https://infinite-river-85875.herokuapp.com/add",
                data: JSON.stringify(newPost),
                dataType: "json",
                contentType: 'application/json',
                
            })
            .done(function (result) {
               
                
            })
            
    });
}

function renderLibraryBookNew () {
    const libraryBooksNew = `
    <div class="addNewBookForm">
        <button class="addBook">Add a book</button>
        <form class="addABook">
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
    `
    $('.BookBody').html(libraryBooksNew);
}
/*
function watchDeleteBook() {
    $('.deleteBook').click(function (event) {
        event.preventDefault();
        var bookIdTarget = $(this).closest('tr').find(".BookID");
        searchId = bookIdTarget.children().
        console.log(bookIdTarget);
        //var closestBookID = $(this).first().text();
        console.log(searchId);
        //deleteBook(closestBookID)
        //$(this).closest("tr").html('');
        
        
    })  
}
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

function submitBooksByTitle() {
    $('#searchTerm').submit(function (event) {
        event.preventDefault();
        var queryTarget = $(event.currentTarget).find('#query');
        searchTerm = queryTarget.val();
        drawSearchHeaders();
        booksByTitle(searchTerm);
    });
}


function booksByTitle(searchTerm) { 
    let searchUrl = 'https://infinite-river-85875.herokuapp.com/getbooks/byTitle/' + searchTerm;  
    console.log(searchUrl);
    $.getJSON(searchUrl, function (response) {
         searchedBooksInLibrary = response.map((item, response) => drawSearchRow(item))
         //$('#flickrResults').html(results)
         console.log(searchedBooksInLibrary);
         //});
});
}

function drawSearchHeaders () {
    let header = 
    `<table class="libraryBooksSearch">
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Reading Level</th>
            <th>Description</th>
            <th>Checkout</th>
            <th>Delete Book</th>
        </table>
    `
    $('.searchRowTable').html(header);
}


function drawSearchRow(rowData) {
 let row = 
    `<tr class="bookRow" />
        <td class="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <td class="bookAuthor">${rowData.author}</td>
        <td class="bookRL">${rowData.readingLevel}</td>
        <td class="bookGenre">${rowData.genre}</td>
        <td class="bookDesc"> ${rowData.description} </td>
        <td class="bookCheckout"> 
            <button class="checkoutBook">Checkout Book</button>
        </td>
        <td class="bookDelete"> 
            <button class="deleteBook">Delete Book</button>
        </td>
    </tr>
    `;
    //console.log(row);
    $(".libraryBooksDisplayed").append(row);
}

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
        //submitRandomGenre();
        //drawTable();
        allBooks();
        listenerNewBook();
        //postNewBook();
        //watchCheckoutBook();
        //populateRandomGenre();
        //watchDeleteBook();
        //compileRandomArray();
        //randomGenreBooks();
        });