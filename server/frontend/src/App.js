import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";

import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";

import { Routes, Route } from "react-router-dom";


function App() {

  return (

    <Routes>

      {/* ====================================================
          Login
      ==================================================== */}

      <Route
        path="/login"
        element={<LoginPanel />}
      />


      {/* ====================================================
          Register
      ==================================================== */}

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ====================================================
          Dealers
      ==================================================== */}

      <Route
        path="/dealers"
        element={<Dealers />}
      />


      {/* ====================================================
          Dealer Details / Reviews
      ==================================================== */}

      <Route
        path="/dealer/:id"
        element={<Dealer />}
      />


      {/* ====================================================
          Post Review
      ==================================================== */}

      <Route
        path="/postreview/:id"
        element={<PostReview />}
      />

    </Routes>

  );
}


export default App;