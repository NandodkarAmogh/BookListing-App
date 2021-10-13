//Book Class => to represent a book
class Book{
  constructor(title,author,isbn){
      this.title=title;
      this.author=author;
      this.isbn=isbn;
  } 
}

// UI Class
class UI {
    static displayBooks(){
        // const StoredBooks = [
        //     {
        //         title: 'Immortals of Meluha',
        //         author: 'Amish Tripathi',
        //         isbn: '675132'
        //     },
        //     {
        //         title: 'Oath of the Vayuputras ',
        //         author: 'Amish Tripathi',
        //         isbn: '626365'
        //     },
        //     {
        //         title: 'Secret of the Nagas',
        //         author: 'Amish Tripathi',
        //         isbn: '546546'
        //     },
        //     {
        //         title: 'Scion of Ikshvaku',
        //         author: 'Amish Tripathi',
        //         isbn: '985656'
        //     }
        // ];
    
        const books = Store.getBooks();
     
        books.forEach((book) => UI.addBookToList(book));

    }

    static addBookToList(book){
        const list=document.querySelector('#book-list');
        
        const row = document.createElement('tr');
    
        row.innerHTML = `
        <td scope="row">${book.title}</td>
       <td>${book.author}</td>
       <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message,className){
        const div = document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);

        //vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(),2500);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// store the books using local storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book,index) =>{
            if(book.isbn=== isbn){
                books.splice(index,1);
            }
        });

        localStorage.setItem('books',JSON.stringify(books));
    }

}


//Event display books
document.addEventListener('DOMContentLoaded',UI.displayBooks);

//Event add book to list
document.querySelector('#book-form').addEventListener('submit', (e) =>{
    // prevent default submit
    e.preventDefault();
    
    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate
    if(title === '' || author ==='' || isbn ==='' ){
        UI.showAlert('Please fill in all fields','danger');
    }
    else{
        //instantiate book
        const book = new Book(title,author,isbn);
        console.log(book);

        //add book to UI
        UI.addBookToList(book);

        //add book to store
        Store.addBook(book);

        //show the success message
        UI.showAlert('Book added to list successfully','success')
        // Clear fields
        UI.clearFields();
    }

    

});


//Event remove a book
document.querySelector('#book-list').addEventListener('click', (e) =>
{
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Book removed from the list', 'success')
})