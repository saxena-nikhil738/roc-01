import React from "react";
import Header from "../Header/Header";
import Form from "../Form/Form";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <div className="container">
        <Header />
        <div className="offer">
          <span>&lt; </span> Get 10% off on business sign up <span> &gt;</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
