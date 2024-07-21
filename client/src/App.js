import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home/Home";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OTPVarification from "./components/OTPPage/OTPVarification";
import { Route, Routes } from "react-router-dom";
import Form from "./components/Form/Form";
import Categories from "./components/Categories/Categories";

function App() {
  return (
    <div className="App">
      <Home />
      <ToastContainer />
      <Routes>
        <Route path="/verifyOTP" element={<OTPVarification />}></Route>
        <Route path="/login" element={<Form />}></Route>
        <Route path="/categories" element={<Categories />}></Route>
      </Routes>
    </div>
  );
}

export default App;
