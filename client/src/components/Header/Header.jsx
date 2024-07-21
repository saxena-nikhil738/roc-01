import React from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useAuth } from "../context/auth";
import * as Cookies from "es-cookie";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("data");
    navigate("/");
  };

  function getFirstName(fullName) {
    if (!fullName.trim()) {
      return "";
    }

    // Split the full name by one or more spaces
    const nameParts = fullName.trim().split(/\s+/);
    return nameParts[0];
  }
  if (auth?.name) {
    var name = getFirstName(auth.name);
  } else {
    var name = "";
  }

  return (
    <div>
      <div className="head">
        <div className="help">
          <ul className="help">
            <li>Help</li>
            <li>Order & returns</li>
            {auth?.token ? <li>Hi, {name}</li> : ""}
            <li>
              {auth?.token ? (
                <Link onClick={handleLogout}>Logout</Link>
              ) : (
                <Link to={"/login"}>Login</Link>
                // <a href="/login">Login</a>
              )}
            </li>
          </ul>
        </div>
        <div className="nav">
          <div className="logo">ECOMMERCE</div>
          <div className="middle">
            <ul>
              <li>
                <Link to={"/categories"} style={{ textDecoration: "none" }}>
                  Categories
                </Link>
              </li>
              <li>
                <a style={{ textDecoration: "none", color: "black" }}>Sales</a>
              </li>
              <li>
                <a style={{ textDecoration: "none", color: "black" }}>
                  Clearance
                </a>
              </li>
              <li>
                <a style={{ textDecoration: "none", color: "black" }}>
                  New stock
                </a>
              </li>
              <li>
                <a style={{ textDecoration: "none", color: "black" }}>
                  Trending
                </a>
              </li>
            </ul>
          </div>
          <div className="cart">
            <ul className="cart">
              <li>
                <SearchIcon />
              </li>
              <li>
                <AddShoppingCartIcon />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
