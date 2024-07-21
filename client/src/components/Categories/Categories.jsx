import React, { useEffect, useState } from "react";
import "./Categories.css";
import Pagination from "../Pagination/Pagination";
import { faker } from "@faker-js/faker";
import BASE_URL from "../Config/Config";
import * as Cookies from "es-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const token = Cookies.get("token");
  console.log(token);
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getItems = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/getitems`, {
          headers: {
            Authorization: token,
          },
        });
        setCategory(res.data.data);
      } catch (error) {
        console.error("Error fetching items:", error);
        navigate("/login");
      }
    };

    getItems();
  }, [token]);

  useEffect(() => {
    console.log(category[0]);
  }, [category]); // Log category whenever it changes

  const numberOfRecords = 6;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="form-cat-parent">
        <div className="form-cat">
          <div className="heading">
            <p
              style={{ fontSize: "24px", fontWeight: "600", marginTop: "0px" }}
            >
              Place mark your interests!
            </p>
            <p style={{ fontSize: "14px" }}>We'll keep you notified</p>
          </div>

          <div className="marks">
            <p style={{ margin: "0px", fontWeight: "500" }}>
              My saved interests!
            </p>

            <Pagination e={{ category, numberOfRecords }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
