var libraryOfBooks = [];
var libraryOfGenres = [];

function compileRandomArray () {
    genreUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    booksUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    rLUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    bothURL = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(genreUrl,  function (response) {
        var allTheGenres = $.map(response, function (k) {
            return k.genre.toUpperCase();
        });
        //function removeDuplicateUsingSet(arr){
            //let unique_array = Array.from(new Set(arr))
            //return unique_array
            //}
        console.log(allTheGenres);
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
        libraryOfBooks.push(allTheBooks);
        
     });
    $.getJSON(bothURL,  function (response) {
        var allTheRLBoth = $.map(response, function (k) {
            return k.readingLevel;

        });
        var allTheGenreBoth = $.map(response, function (k) {
            return k.genre;
        });
        populateRandomBoth(allTheGenreBoth, allTheRLBoth);
    });
    //console.log(libraryOfBooks);
}

//need to remove duplicates
function populateRandomGenre(entry) {
    var uniqueGenres = [];
    var uniqueGenresParser = $.each(entry, function(i, el){
        if($.inArray(el, uniqueGenres) === -1) {
            uniqueGenres.push(el);
        }
    });

    $('#selectGenre').empty();
    var referenceForGenres = $.each(uniqueGenres, function(i, p) {
        $('#selectRL').append($('<option></option>').val(p).html(p));
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
        returnGenreBooks(libraryOfBooks, genreType);
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

function returnGenreBooks(libraryOfBooks, genreType) {
    console.log(libraryOfBooks[0]);
    randomBooksArray = libraryOfBooks[0]
    let genreSearchFilter = genreType;
    //var filtered2 = libraryOfBooks.filter(z => z.genre.toLowerCase().includes(genreType.toLowerCase())); 
    //var filtered2 = libraryOfBooks.filter(function(genre) {
        //return genre.val === genreSearchFilter
        //});
    var filtered2 = randomBooksArray.filter(function (el) {
        return genreSearchFilter.indexOf(el.genre) > -1; 
        });
    console.log(filtered2);
    shuffle(filtered2);
    //var randomizedLibraryBooksByGenre = filtered2.slice(0,3);

    filtered2.map((item, response) => drawRandomGenreRow(item));
    
}

function drawRandomGenreRow(rowData) {
    let random = 
    `<div class="randomBookPage"
        <img src=''>
        <ul class="inidividualBookList">
            <li> Title: ${rowData.title}</li>
            <li> Author: ${rowData.author}</li>
            <li> Genre: ${rowData.genre}</li>
            <li> Reading Level: ${rowData.readingLevel}</li>
            <li> Description: ${rowData.description}</li>
    </div>
    
    `;
    //console.log(row);
    $(".randomArrayCompiler").html(random);
    
}

//byReadingLevel
function populateRandomRL(entry) {
    var uniqueRL = [];
    var uniqueRLParser = $.each(entry, function(i, el){
        if($.inArray(el, uniqueRL) === -1) {
            uniqueRL.push(el);
        }
    });
    $('#selectGenre').empty();
    var referenceForRL = $.each(uniqueRL, function(i, p) {
        $('#selectGenre').append($('<option></option>').val(p).html(p));
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
        returnRLBooks(libraryOfBooks, rLType);
    });
    
}

function returnRLBooks(libraryOfBooks, rLType) {
    console.log(libraryOfBooks[0]);
    randomBooksArray = libraryOfBooks[0]
    let rLSearchFilter = rLType;
    var filtered3 = randomBooksArray.filter(function (el) {
        return rLSearchFilter.indexOf(el.readingLevel) >= 0; 
        });
    console.log(filtered3);
    shuffle(filtered3);
    var randomizedLibraryBooksByRL = filtered3.slice(0,3);
    randomizedLibraryBooksByRL.map((item, response) => drawRandomRLRow(item));
    //console.log(response);
}

//Needs Work
function drawRandomRLRow(rowRLData) {
    let row = 
    `<div class="randomBookPage"
        <img src=''>
        <ul class="inidividualBookList">
            <li> Title: ${rowRLData.title}</li>
            <li> Author: ${rowRLData.author}</li>
            <li> Genre: ${rowRLData.genre}</li>
            <li> Reading Level: ${rowRLData.readingLevel}</li>
            <li> Description: ${rowRLData.description}</li>
    </div>
    
    `;
    //console.log(row);
    $(".randomArrayCompiler").html(row);
    
}

function populateRandomBoth(entry, entry2) {
    $('#selectRLBoth').empty();
    $('#selectGenreBoth').empty();
    var referenceForGenresBoth = $.each(entry, function(i, p) {
        $('#selectGenreBoth').append($('<option></option>').val(p).html(p));
                return p;
        });
    var referenceForRLBoth = $.each(entry2, function(i, k) {
        $('#selectRLBoth').append($('<option></option>').val(k).html(k));
                return k;
        });
    //console.log(referenceForGenres);
    submitRandomBoth(referenceForGenresBoth, referenceForRLBoth);
}

function submitRandomBoth() {
    $('.randomBoth').click(function (event) {
        event.preventDefault();
        var genreBothType = $('#selectGenreBoth').find(':selected').text();
        var rLBothType = $('#selectRLBoth').find(':selected').text();
        console.log(genreBothType);
        console.log(rLBothType);
        returnBothBooks(libraryOfBooks, genreBothType, rLBothType);
    });
}

function returnBothBooks(libraryOfBooks, genreBothType, rLBothType) {
    console.log(libraryOfBooks);
    let genreSearchFilter = genreBothType;
    let rLSearchFilter = rLBothType;
    var filtered4 = libraryOfBooks.filter(function (el) {
        return genreSearchFilter.indexOf(el.genre) && rLSearchFilter.indexOf(el.readingLevel)  >= 0; 
        });
    //var filtered4 = libraryOfBooks[0].filter(z => z.genre.toLowerCase().includes(genreBothType.toLowerCase()) && z.readingLevel.toLowerCase().includes(rLBothType.toLowerCase())); 
    console.log(filtered4);
    shuffle(filtered4);
    var randomizedLibraryBooksByBoth = filtered4.slice(0,3);

    randomizedLibraryBooksByBoth.map((item, response) => drawRandomBothRow(item));
}
function drawRandomBothRow(rowRLData) {
    let row = 
    `<div class="randomBookPage"
        <img src=''>
        <ul class="inidividualBookList">
            <li> Title: ${rowRLData.title}</li>
            <li> Author: ${rowRLData.author}</li>
            <li> Genre: ${rowRLData.genre}</li>
            <li> Reading Level: ${rowRLData.readingLevel}</li>
            <li> Description: ${rowRLData.description}</li>
    </div>
    
    `;
    //console.log(row);
    $(".randomArrayCompiler").html(row);
    
}
/*
$(document).ready(function () {
        //compileRandomArray();
        });*/