// imports

// styles
import "./Card.css";

export default function Card({
  index,
  title,
  innerText,
  left,
  top,
  bottom,
  right,
}) {
  return (
    <div className="card" style={{ left, top, bottom, right }}>
      <div className="card-index">{index}</div>
      <p className="card-title">{title}</p>
      <p className="card-text">{innerText}</p>
    </div>
  );
}
