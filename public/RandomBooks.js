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
    `
        <ul class="individualBookList">
            <li> <strong>Title:</strong> ${rowData.title}</li>
            <li> <strong>Author:</strong> ${rowData.author}</li>
            <li> <strong>Genre:</strong> ${rowData.genre}</li>
            <li> <strong>Reading Level:</strong> ${rowData.readingLevel}</li>
            <li> <strong>Description:</strong> ${rowData.description}</li>
        </ul>    
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
    $('#selectRL').empty();
    var referenceForRL = $.each(uniqueRL, function(i, p) {
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
    let row = `
        <ul class="inidividualBookList">
            <li> Title:</strong> ${rowRLData.title}</li>
            <li> Author:</strong> ${rowRLData.author}</li>
            <li> Genre:</strong> ${rowRLData.genre}</li>
            <li> Reading Level:</strong> ${rowRLData.readingLevel}</li>
            <li> Description:</strong> ${rowRLData.description}</li>
        </ul>    
    `;
    //console.log(row);
    $(".randomArrayCompiler").html(row);
    
}
