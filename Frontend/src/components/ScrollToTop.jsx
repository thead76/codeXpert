import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Yeh component sunishchit karta hai ki user har baar naye route par navigate karne par
// page ke top par scroll ho jaye.
const ScrollToTop = () => {
  // 'useLocation' hook se current location object se 'pathname' nikalta hai.
  const { pathname } = useLocation();

  // Yeh effect har baar 'pathname' badalne par chalta hai.
  useEffect(() => {
    // Window ko turant top-left corner (0, 0) par scroll karta hai.
    window.scrollTo(0, 0);
  }, [pathname]); // Dependency array yeh sunishchit karta hai ki yeh effect sirf navigation par chale.

  // Yeh component koi UI render nahi karta hai.
  return null;
};

export default ScrollToTop;
