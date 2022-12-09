// imports
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

// styles
import "./ScrollupBtn.css";

export default function ScrollupBtn({ distance }) {
  const scrollupBtn = useRef();

  useEffect(() => {
    if (window.scrollY === 0) {
      scrollupBtn.current.style.opacity = "0";
    }
  });

  const handleScroll = () => {
    const position = window.scrollY;
    if (position > distance) {
      scrollupBtn.current.style.opacity = "1";
    } else {
      scrollupBtn.current.style.opacity = "0";
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div
      className="scroll-up-btn"
      ref={scrollupBtn}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </div>
  );
}
