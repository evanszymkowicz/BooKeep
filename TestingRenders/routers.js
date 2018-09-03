function renderLibraryBooksHeaders () {
	const libraryBooksHeader = `
	<div class="main-page">
      <p>Welcome to your Library Page! Click on the book in the table below to find out more information and edit, delete, or checkout book. Click the "Search" button to search books by title or author. Click the "Random" button to find books randomly. Finally, Click "Checked out books" to see books that are checked out and check them in!</p>
      <button class="addABook" type="submit">Add Book</button>
      <button class="searchLibrary" type="submit">Search</button>
      <button class="libraryRandom" type="submit">Random</button>
      <button class="checkedoutList" type="submit">Checkedout Books</button>
    </div>

	<table class="libraryBooksSearch">
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Reading Level</th>
            <th>Description</th>
        </table>
    `
    $('.libraryBooksBody').html(libraryBooksHeader);
}

function renderLibraryBooksList () {
	const libraryList = libraryOfBooks.map(rowData =>
		`<tr class="bookRow" />
        <td class="bookID">${rowData.id}</td>
        <td class="bookTitle">${rowData.title}</td>
        <td class="bookAuthor">${rowData.author}</td>
        <td class="bookRL">${rowData.readingLevel}</td>
        <td class="bookGenre">${rowData.genre}</td>
        <td class="bookDesc"> ${rowData.description} </td>
    </tr>
    `);
    $('.libraryOfBooks').append(libraryList);
}











/*
	`
        <div class="editCouponModal">
            <div class="popUpHeader">
                <div class="clossButton">
                        <button type="button" class="close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
            </div>
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
        `*/