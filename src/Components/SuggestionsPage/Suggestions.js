import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TourCarousel from "./TourCarousel";
import TourPage from "./TourPage";
import "./TourCard.css";

export const Suggestions = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TourCarousel />} />{" "}
        <Route path="/tour1" element={<TourPage tourId={1} />} />
        <Route path="/tour2" element={<TourPage tourId={2} />} />
        <Route path="/tour3" element={<TourPage tourId={3} />} />
        <Route path="/tour4" element={<TourPage tourId={4} />} />
        <Route path="/tour5" element={<TourPage tourId={5} />} />
      </Routes>{" "}
    </Router>
  );
};

export default Suggestions;
