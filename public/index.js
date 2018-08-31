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
function allBooks() { 
    url = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(url,  function (response) {
        booksInLibrary = response.map((item, response) => drawRow(item));

        //const results = LibraryBookTableMaker();
        //drawRow(results);
        //deleteThisBook(item);
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
    let row = 
    `<tr class="bookRow" />
        <td class="bookID">  ${rowData.id} </td>
        <td class="bookTitle"> ${rowData.title} </td>
        <td class="bookAuthor"> ${rowData.author} </td>
        <td class="bookRL"> ${rowData.readingLevel} </td>
        <td class="bookGenre"> ${rowData.genre} </td>
        <td class="bookDesc"> ${rowData.description} </td>
        <td class="bookDelete"> 
            <button class="deleteBook">Delete Book</button>
        </td>
    </tr>
    `;
    //console.log(row);
    $(".libraryBooksDisplayed").append(row);
    watchDeleteBook();
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
                //maybe not necessary
                newBookinLibrary = result.map((item, results) => drawRow(item))
                
                console.log(result);
            })
            
    });
}

function watchDeleteBook() {
    $('.deleteBook').click(function (event) {
        event.preventDefault();
        closestBookID = $(this).closest("tr").find(".BookID").text();
        $(this).closest("tr").html('');
        //console.log(closestBookID)
        deleteBook(closestbookID)
    })  
}
function deleteBook(item) {
    url = 'https://infinite-river-85875.herokuapp.com/delete/' + item;
    $.ajax({
            url: url,
            type: 'DELETE',
            dataType: 'json',
            contentType: 'application/json'
        });
}


/*
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
    let url = 'https://infinite-river-85875.herokuapp.com/getbooks/byTitle/' + searchTerm;  
    console.log(url);
    $.getJSON(url, function (response) {
         searchedBooksInLibrary = response.map((item, response) => drawSearchRow(item))
         //$('#flickrResults').html(results)
         console.log(response);
         //});
});
}

/*function drawSearchRow(searchRowData) {
    var row = $("<tr class"BookRow" />")
    $(".libraryBooksSearch").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
    row.append($("<td class="bookID">" + searchRowData.id + "</td>"));
    row.append($("<td class="bookTitle">" + searchRowData.title + "</td>"));
    row.append($("<td class="bookAuthor">" + searchRowData.author + "</td>"));
    row.append($("<td class="bookRL">" + searchRowData.readingLevel + "</td>"));
    row.append($("<td class="bookGenre">" + searchRowData.genre + "</td>"));
    row.append($("<td class="bookDesc">" + searchRowData.description + "</td>"));
    row.append($("<td>" + '<button class="checkoutBook">Checkout</button>' + "</td>"));
    row.append($("<td  class="bookDelete">" + '<button class="deleteBook">Delete Book</button>' + "</td>"));
}*/

/*function checkoutPopUp() {
    return
        `
        <div>
                <div class="popUpHeader">
        <div class="clossButton">
            <button type="button" class="close">
              <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>
    <div>
        <form>
            Student First Name:
            <input type="text" name="bookTitle" class="addTitle">
            Student Last Name:
            <input type="text" name="bookAuthor" class="addAuthor">
        </form>
    </div>
</div>
        `

}

function checkoutPopUpListener() {
    $('#checkoutBook').submit(function (event) {
        event.preventDefault();

        $("#datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
            minDate: 0,
            maxDate: "+1Y"
        });
    });

}*/
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
        submitBooksByTitle();
        //drawTable();
        allBooks();
        postNewBook();
        //populateRandomGenre();
        //watchDeleteBook();
        });