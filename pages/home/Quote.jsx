// imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

// components
import QuoteAnimation from "./QuoteAnimation";

// styles
import "./Quote.css";

export default function Quote({ quote, author }) {
  return (
    <div className="quote-box">
      <blockquote>
        <div>
          <hr />
          <div className="quote-body">
            <FontAwesomeIcon icon={faQuoteLeft} />
            <div className="quote">
              <QuoteAnimation text={quote} />
            </div>
            <p className="quote-author">{author}</p>
          </div>
        </div>
      </blockquote>
    </div>
  );
}
