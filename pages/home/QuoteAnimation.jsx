// imports
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function QuoteAnimation({ prefix, text, end }) {
  const PVariant = {
    visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
    hidden: { opacity: 0, scale: 0, color: "black" },
  };

  const PElement = ({ text }) => {
    const control = useAnimation();
    const [ref, inView] = useInView();

    useEffect(() => {
      if (inView) {
        control.start("visible");
      } else {
        control.start("hidden");
      }
    }, [control, inView]);

    return (
      <motion.div
        className="quote-animation"
        ref={ref}
        variants={PVariant}
        initial="hidden"
        animate={control}
        style={{ display: "inline" }}
      >
        <div style={{ display: "inline" }}>{text}</div>
      </motion.div>
    );
  };

  return (
    <div style={{ display: "inline" }}>
      {prefix}
      <PElement text={text} />
      {end}
    </div>
  );
}
