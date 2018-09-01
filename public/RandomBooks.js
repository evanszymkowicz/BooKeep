var libraryOfGenreBooks = [];
var libraryOfRLBooks = [];
var libraryOfGenres = [];

function compileRandomArray () {
    genreUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    booksUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    rLUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(genreUrl,  function (response) {
        var allTheGenres = $.map(response, function (k) {
            return k.genre;
        });
        //function removeDuplicateUsingSet(arr){
            //let unique_array = Array.from(new Set(arr))
            //return unique_array
            //}
        libraryOfGenres.push(allTheGenres);       
        //removeDuplicateUsingSet(libraryOfGenres);
        //console.log(unique_array);
        //let unique_array = [...new Set(libraryOfGenres)];
        //console.log(unique_array);
        populateRandomGenre(allTheGenres);
    });
    $.getJSON(rLUrl,  function (response) {
        var allTheRL = $.map(response, function (k) {
            return k.readingLevel;
        });
        
        populateRandomRL(allTheRL);
    });
    $.getJSON(booksUrl,  function (response) {
        var allTheBooks = $.map(response, function (k) {
            return k;
        });
        libraryOfGenreBooks.push(allTheBooks);
        libraryOfRLBooks.push(allTheBooks);
     });
    console.log(libraryOfGenreBooks);
    console.log(libraryOfRLBooks);
}

function populateRandomGenre(entry) {
    $('#selectGenre').empty();
    var referenceForGenres = $.each(entry, function(i, p) {
        $('#selectGenre').append($('<option></option>').val(p).html(p));
                return p;
        });
    console.log(referenceForGenres);
    submitRandomGenre(referenceForGenres);
}

function submitRandomGenre() {
    $('.randomGenre').click(function (event) {
        event.preventDefault();
        var genreType = $('#selectGenre').find(':selected').text();
        console.log(genreType);
        returnGenreBooks(libraryOfGenreBooks, genreType);
    });
    
}

function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

          // While there remain elements to shuffle...
          while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
            }
              return array;
            };

function returnGenreBooks(libraryOfGenreBooks, genreType) {
    console.log(libraryOfGenreBooks);
    var filtered2 = libraryOfGenreBooks[0].filter(z => z.genre.toLowerCase().includes(genreType.toLowerCase())); 
    console.log(filtered2);
    shuffle(filtered2);
    var randomizedLibraryBooksByGenre = filtered2.slice(0,3);

    randomizedLibraryBooksByGenre.map((item, response) => drawRandomGenreRow(item));
    
}

function drawRandomGenreRow(rowData) {
    let row = 
    `<tr class="bookRow" />
        <td class="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <td class="bookAuthor">${rowData.author}</td>
        <td class="bookRL">${rowData.readingLevel}</td>
        <td class="bookGenre">${rowData.genre}</td>
        <td class="bookDesc"> ${rowData.description} </td>
    </tr>
    `;
    //console.log(row);
    $(".libraryBooksByGenreDisplayed").append(row);
    
}

//byReadingLevel
function populateRandomRL(entry) {
    $('#selectRL').empty();
    var referenceForRL = $.each(entry, function(i, p) {
        $('#selectRL').append($('<option></option>').val(p).html(p));
                return p;
        });
    console.log(referenceForRL);
    submitRandomRL(referenceForRL);
}

function submitRandomRL() {
    $('.randomReadingLevel').click(function (event) {
        event.preventDefault();
        var rLType = $('#selectRL').find(':selected').text();
        console.log(rLType);
        returnRLBooks(libraryOfRLBooks, rLType);
    });
    
}

function returnRLBooks(libraryOfBooks, rLType) {
    var filtered3 = libraryOfRLBooks[0].filter(x => x.readingLevel.toLowerCase().includes(rLType.toLowerCase())); 
    console.log(filtered3);
    shuffle(filtered3);
    var randomizedLibraryBooksByRL = filtered3.slice(0,3);
    randomizedLibraryBooksByRL.map((item, response) => drawRandomRLRow(item));
    //console.log(response);
}

function drawRandomRLRow(rowRLData) {
    let row = 
    `<tr class="bookRow" />
        <td class="bookID">${rowRLData.id}</td>
        <td class="bookTitle">${rowRLData.title}</td>
        <td class="bookAuthor">${rowRLData.author}</td>
        <td class="bookRL">${rowRLData.readingLevel}</td>
        <td class="bookGenre">${rowRLData.genre}</td>
        <td class="bookDesc"> ${rowRLData.description} </td>
    </tr>
    `;
    //console.log(row);
    $(".libraryBooksByRLDisplayed").append(row);
    
}


function submitBooksByTitle() {
    $('#searchTerm').submit(function (event) {
        event.preventDefault();
        var queryTarget = $(event.currentTarget).find('#query');
        searchTerm = queryTarget.val();
        booksByTitle(searchTerm);
    });
}


$(document).ready(function () {
        compileRandomArray();
        });