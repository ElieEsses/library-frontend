import { ScanBarcode } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "../lib/api";
import BarcodeScanner from "./BarcodeScanner";

export default function AddBookModal({ onClose, onBookAdded }) {
  const [isbn, setIsbn] = useState("");
  const [foundBook, setFoundBook] = useState(null);
  const [editingCover, setEditingCover] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState(null);
  const [addBookError, setAddBookError] = useState(null);

  async function handleAddBook() {
    setAddBookError(null);
    try {
      const book = await apiFetch("/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(foundBook),
      });

      onBookAdded(book);
    } catch (err) {
      setAddBookError(err.message);
    }
  }

  const handleBookLookup = useCallback(async (isbnToSearch) => {
    setError(null);

    if (!isbnToSearch.trim()) return;

    try {
      const book = await apiFetch(`/books/lookup/${isbnToSearch.trim()}`);

      if (!book) {
        setError("Book not found");
        return;
      }

      setFoundBook(book);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  function updateBook(field, value) {
    setFoundBook((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
    
  const handleBarcodeScan = useCallback(
    (scannedIsbn) => {
      setIsbn(scannedIsbn);
      handleBookLookup(scannedIsbn);
      setShowScanner(false);
    },
    [handleBookLookup]
  );


  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
            <h2>Add a book</h2>
            <button
            type="button"
            className="modal-close"
            onClick={() => {
                onClose();
            }}
            aria-label="Close"
            >
            ×
            </button>
        </div>
        <div className="search">
            <input
            placeholder="Enter ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            />
            <button className="button" onClick={() => handleBookLookup(isbn)}>Search</button>
            <button
            type="button"
            className="scan-button"
            onClick={() => setShowScanner((prev) => !prev)}
            aria-label={showScanner ? "Close scanner" : "Scan barcode"}
            title={showScanner ? "Close scanner" : "Scan barcode"}
            >
            <ScanBarcode size={19} strokeWidth={1.8} />
            </button>
        </div>
        {showScanner && (
          <BarcodeScanner onScan={handleBarcodeScan} />
        )}
        {error && <p className="error">{error}</p>}

        {foundBook && (
            <>
            <div className="book-details">
                <div className="cover-column">
                <div className="cover-editor">
                    <img
                    className="preview-cover"
                    src={foundBook.cover_url}
                    alt={foundBook.title}
                    />

                    <button
                    type="button"
                    className="cover-edit-button"
                    onClick={() => setEditingCover((prev) => !prev)}
                    aria-label="Edit cover URL"
                    >
                    ✎
                    </button>
                </div>
                {editingCover && (
                    <input
                    type="url"
                    className="cover-url-input"
                    placeholder="Paste cover image URL"
                    value={foundBook.cover_url ?? ""}
                    onChange={(e) => updateBook("cover_url", e.target.value)}
                    />
                )}
                </div>
                <div className="book-info">
                <div className="book-info-row">
                    <span>Title: </span>
                    <input
                    type="text"
                    value={foundBook.title}
                    onChange={(e) => updateBook("title", e.target.value)}
                    />
                </div>

                <div className="book-info-row">
                    <span>Authors: </span>
                    <input
                    type="text"
                    value={foundBook.authors.join(", ")}
                    onChange={(e) =>
                        updateBook("authors", e.target.value.split(","))
                    }
                    />
                </div>

                <div className="book-info-row">
                    <span>First Published: </span>
                    <input
                    type="number"
                    placeholder="First published"
                    value={foundBook.first_publish_year ?? ""}
                    onChange={(e) =>
                        updateBook(
                        "first_publish_year",
                        e.target.value === "" ? null : Number(e.target.value)
                        )
                    }
                    />
                </div>
                <div className="book-info-row">
                    <span>Number of Pages: </span>
                    <input
                    type="number"
                    min="1"
                    placeholder="Pages"
                    value={foundBook.num_pages ?? ""}
                    onChange={(e) =>
                        updateBook(
                        "num_pages",
                        e.target.value === "" ? null : Number(e.target.value)
                        )
                    }
                    />
                </div>
                </div>
            </div>
            {addBookError && <p className="error">{addBookError}</p>}
            <div className="modal-actions">
                <button className="button" type="button" onClick={handleAddBook}>
                Add to library
                </button>
            </div>
            </>
        )}
      </div>
    </div>
  );
}