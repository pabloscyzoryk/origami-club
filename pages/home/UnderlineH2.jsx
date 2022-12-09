// imports

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {Heading} from "@chakra-ui/react";
import { useEffect } from "react";

export default function UnderlineH2({ prefix, text, end }) {
  const h2Variant = {
    visible: {
      opacity: 1,
      scale: 1,
      color: "#FFCC5C",
      transition: { duration: 1.5 },
      textDecoration: "underline",
    },
    hidden: { opacity: 0, scale: 0, color: "black" },
  };

  const H2Element = ({ text }) => {
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
        className="h2-underline-animation"
        ref={ref}
        variants={h2Variant}
        initial="hidden"
        animate={control}
        style={{ display: "inline" }}
      >
        <p style={{ display: "inline" }}>{text}</p>
      </motion.div>
    );
  };

  return (
    <Heading style={{ display: "inline" }}>
      {prefix}
      <H2Element text={text} />
      {end}
    </Heading>
  );
}
