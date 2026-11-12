import "../styles/Library.css";

import { useEffect, useState } from "react";

import AddBookModal from "../components/AddBookModal";
import BookCard from "../components/BookCard";
import { apiFetch } from "../lib/api";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [showAddBook, setShowAddBook] = useState(false);

  function closeAddBook() {
    setShowAddBook(false);
  }

  function handleBookAdded(book) {
    setBooks((prev) =>
      prev.some((existing) => existing.id === book.id)
        ? prev
        : [...prev, book]
    );
    setShowAddBook(false);
  }

  useEffect(() => {
    async function fetchBooks() {
      const data = await apiFetch("/books");
      setBooks(data);
    }

    fetchBooks();
  }, []);

  return (
    <div className="library-page">
      <header className="library-header">
        <div>
          <h1>My Library</h1>
          <p>{books.length} books on your shelf</p>
        </div>
        <button className="button" type="button" onClick={() => setShowAddBook(true)}>
          <span aria-hidden="true">+</span>
          Add book
        </button>
      </header>
      {showAddBook && (
        <AddBookModal
          onClose={closeAddBook}
          onBookAdded={handleBookAdded}
        />
      )}
      <div className="book-grid">
        {[...books]
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
      </div>
    </div>
  );
}