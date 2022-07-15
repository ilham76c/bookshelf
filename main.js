window.addEventListener('DOMContentLoaded', () => {
  // books local storage key
  const STORAGE_KEY = 'BOOKSHELF';

  // list books
  let books = [];

  // listen form submit event
  document.getElementById('inputBook').addEventListener('submit', (event) => {
    event.preventDefault();

    if (!isStorageExist) return;

    const book = {
      id: +new Date(),
      title: document.getElementById('inputBookTitle').value,
      author: document.getElementById('inputBookAuthor').value,
      year: document.getElementById('inputBookYear').valueAsNumber,
      isComplete: document.getElementById('inputBookIsComplete').checked
    };

    books.push(book);
    setDataToStorage();
  });

  // search book listener
  document.getElementById('searchSubmit').addEventListener('click', (event) => {
    event.preventDefault();

    const searchText = document.getElementById('searchBookTitle').value.toLocaleLowerCase();

    const findBook = books.filter(obj => {
      const authorTitleYear = `${obj.author} ${obj.title} ${obj.year}`.toLocaleLowerCase();
      return authorTitleYear.includes(searchText);
    });

    renderTemplateBook(findBook);
  });

  // button delete
  function buttonDelete() {
    document.querySelectorAll('button[name="delete"]').forEach(item => {
      item.addEventListener('click', event => {
        if (confirm("Delete book?")) {
          books = books.filter(obj => obj.id !== parseInt(event.target.dataset.id))

          setDataToStorage();
        }
      });
    });
  }

  // button done or undone
  function buttonMove() {
    document.querySelectorAll('button[name="move"]').forEach(item => {
      item.addEventListener('click', event => {
        books = books.map(obj => {
          if (obj.id === parseInt(event.target.dataset.id)) {
            obj.isComplete = !obj.isComplete;
          }
          return obj;
        });

        setDataToStorage();
      })
    });
  }

  // render books element
  function renderTemplateBook(data) {
    let bookReaded = '';
    let bookUnreaded = '';

    data.forEach(book => {
      const element = `
        <article class="book_item">
          <h3>${book.title}</h3>
          <p>Penulis: ${book.author}</p>
          <p>Tahun: ${book.year}</p>
          <div class="action">
            <button class="green" name="move" data-id="${book.id}">${ book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca' }</button>
            <button class="yellow" name="edit" data-id="${book.id}">Edit buku</button>
            <button class="red" name="delete" data-id="${book.id}">Hapus buku</button>
          </div>
        </article>`;
      
      if (book.isComplete) {
        bookReaded += element;
      } else {
        bookUnreaded += element;
      }
    });

    document.getElementById('completeBookshelfList').innerHTML = bookReaded;
    document.getElementById('incompleteBookshelfList').innerHTML = bookUnreaded;

    buttonDelete();
    buttonMove();
  }

  // save data to local storage
  function setDataToStorage() {
    if (isStorageExist()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      renderTemplateBook(books);
    }
  }

  // get data from local storage
  function getDataFromStorage() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
    if (data !== null && Array.isArray(data)) {
      books = data;
      renderTemplateBook(books);
    }
  }

  // check local storage is exist or not
  function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  if (isStorageExist()) {
    getDataFromStorage();
  }
});
