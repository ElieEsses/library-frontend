import { Link } from "react-router";


export default function BookCard({ book }) {
  return (
    <Link to={`/library/${book.id}`} className="book-card">
      <img
        className="book-cover"
        src={book.cover_url}
        alt={`Cover of ${book.title}`}
      />
      <h3>{book.title}</h3>
      <p>{book.authors.join(", ")}</p>
    </Link>
  );
}