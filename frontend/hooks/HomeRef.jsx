import { useRef } from "react";
import { useInView } from "motion/react";

export const useSectionViews = () => {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const productsRef = useRef(null);
  const servicesRef = useRef(null);
  const feedbackRef = useRef(null);

  const homeInView = useInView(homeRef, { once: true });
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.5 });
  const productsInView = useInView(productsRef, { once: true, amount: 0.5});
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.7});
  const feedbackInView = useInView(feedbackRef, { once: true, amount: 0.5});

  return {
    sectionRefs: {
      home: homeRef,
      about: aboutRef,
      products: productsRef,
      services: servicesRef,
      feedback: feedbackRef,
    },
    inViews: {
      home: homeInView,
      about: aboutInView,
      products: productsInView,
      services: servicesInView,
      feedback: feedbackInView,
    },
  };
};
