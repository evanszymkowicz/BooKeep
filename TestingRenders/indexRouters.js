libraryOfBooks = [];

function allBooks() { 
    url = 'https://infinite-river-85875.herokuapp.com/getbooks';
    $.getJSON(url,  function (response) {
        booksInLibrary = $.map(response, function (k) {
            return k;
        });
        libraryOfBooks.push(allTheBooks);
        renderLibraryBooksHeaders();
        renderLibraryBooksList()
         });
    
}