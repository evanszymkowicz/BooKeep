"use strict"

var libraryOfBooks = [];
var libraryOfGenres = [];

//compiles arrays by certain criteria for parsing
function compileRandomArray () {
    var genreUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    var booksUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    var rLUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(genreUrl,  function (response) {
        var allTheGenres = $.map(response, function (k) {
            return k.genre.toUpperCase();
        });
        libraryOfGenres.push(allTheGenres);       
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
        libraryOfBooks.push(allTheBooks);
     });
}

//populates random genre select box
function populateRandomGenre(entry) {
    var uniqueGenres = [];
    var uniqueGenresParser = $.each(entry, function(i, el){
        if($.inArray(el, uniqueGenres) === -1) {
            uniqueGenres.push(el);
        }
    });
    $('#selectGenre').empty();
    var referenceForGenres = $.each(uniqueGenres, function(i, p) {
        $('#selectGenre').append($('<option></option>').val(p).html(p));
                return p;
        });
    submitRandomGenre(referenceForGenres);
}

//listens for click of genre submit
function submitRandomGenre() {
    $('.randomGenre').click(function (event) {
        event.preventDefault();
        var genreType = $('#selectGenre').find(':selected').text();
        returnGenreBooks(libraryOfBooks, genreType);
    });
    
}

//shuffles arrays randomly
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
            }
        return array;
}

//filters array and returns all books with genre
function returnGenreBooks(libraryOfBooks, genreType) {
    let randomBooksArray = libraryOfBooks[0]
    let genreSearchFilter = genreType;
    var filtered2 = randomBooksArray.filter(function (el) {
        return genreSearchFilter.indexOf(el.genre) > -1; 
        });
    shuffle(filtered2);
    filtered2.map((item, response) => drawRandomGenreRow(item));
}

//draws random genre book
function drawRandomGenreRow(rowData) {
    let random = `
        <ul class="individualBookList">
            <li> <strong>Title:</strong> ${rowData.title}</li>
            <li> <strong>Author:</strong> ${rowData.author}</li>
            <li> <strong>Genre:</strong> ${rowData.genre}</li>
            <li> <strong>Reading Level:</strong> ${rowData.readingLevel}</li>
            <li> <strong>Description:</strong> ${rowData.description}</li>
        </ul>    
    `;
    $(".randomArrayCompiler").html(random);
    
}

//populates random reading level selector
function populateRandomRL(entry) {
    var uniqueRL = [];
    var uniqueRLParser = $.each(entry, function(i, el){
        if($.inArray(el, uniqueRL) === -1) {
            uniqueRL.push(el);
        }
    });
    $('#selectRL').empty();
    var referenceForRL = $.each(uniqueRL, function(i, p) {
        $('#selectRL').append($('<option></option>').val(p).html(p));
                return p;
        });
    submitRandomRL(referenceForRL);
}

//listens for reading level submit button
function submitRandomRL() {
    $('.randomReadingLevel').click(function (event) {
        event.preventDefault();
        var rLType = $('#selectRL').find(':selected').text();
        returnRLBooks(libraryOfBooks, rLType);
    });
}

//searches array for reading level selected
function returnRLBooks(libraryOfBooks, rLType) {
    let randomBooksArray = libraryOfBooks[0]
    let rLSearchFilter = rLType;
    var filtered3 = randomBooksArray.filter(function (el) {
        return rLSearchFilter.indexOf(el.readingLevel) >= 0; 
        });
    shuffle(filtered3);
    var randomizedLibraryBooksByRL = filtered3.slice(0,3);
    randomizedLibraryBooksByRL.map((item, response) => drawRandomRLRow(item));
}

//draws random reading level book
function drawRandomRLRow(rowRLData) {
    let row = `
        <ul class="inidividualBookList">
            <li> Title:</strong> ${rowRLData.title}</li>
            <li> Author:</strong> ${rowRLData.author}</li>
            <li> Genre:</strong> ${rowRLData.genre}</li>
            <li> Reading Level:</strong> ${rowRLData.readingLevel}</li>
            <li> Description:</strong> ${rowRLData.description}</li>
        </ul>    
    `;
    $(".randomArrayCompiler").html(row);
    
}
