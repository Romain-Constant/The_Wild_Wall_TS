import {Route, Routes} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import MainWall from "./pages/MainWall";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="mainwall" element={<MainWall />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
