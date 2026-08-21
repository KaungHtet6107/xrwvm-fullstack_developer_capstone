import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dealers from "./components/Dealers/Dealers";

import { Routes, Route } from "react-router-dom";


function App() {

  return (

    <Routes>

      {/* Login page */}
      <Route
        path="/login"
        element={<LoginPanel />}
      />

      {/* Register page */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Dealers page */}
      <Route
        path="/dealers"
        element={<Dealers />}
      />

    </Routes>

  );
}


export default App;