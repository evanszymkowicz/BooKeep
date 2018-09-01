//byGenre 
var libraryOfBooks = [];
var libraryOfGenres = [];


function compileRandomArray () {
    booksUrl = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(booksUrl,  function (response) {
        var allTheRL = $.map(response, function (k) {
            return k.readingLevel;
        });
        var allTheGenres = $.map(response, function (j) {
            return j.genre;
        });
        var allTheBooks = $.map(response, function (l) {
            return l;
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
        console.log(allTheRL);
        populateRandomGenre(allTheGenres);
        populateRandomRL(allTheRL);
        libraryOfBooks.push(allTheBooks);
     });
    console.log(libraryOfBooks);
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
    var filtered2 = libraryOfBooks[0].filter(x => x.genre.toLowerCase().includes(genreType)); 
    //console.log(filtered2);
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
        returnRLBooks(libraryOfBooks, rLType);
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

function returnGenreBooks(libraryOfBooks, rLType) {
    var filtered3 = libraryOfBooks[0].filter(x => x.genre.toLowerCase().includes(rLType)); 
    //console.log(filtered2);
    shuffle(filtered3);
    var randomizedLibraryBooksByRL = filtered3.slice(0,3);
    randomizedLibraryBooksByRL.map((item, response) => drawRandomRLRow(item));
    
}

function drawRandomRLRow(rowData) {
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

$(document).ready(function () {
        compileRandomArray();
        });