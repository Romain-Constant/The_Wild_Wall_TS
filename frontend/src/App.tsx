import {Route, Routes} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import MainWall from "./pages/MainWall";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import RequireAuth from "./components/requireAuth/RequireAuth";
import WritePost from "./pages/WritePost";
import EditPost from "./pages/EditPost";

const ROLES = {
  admin: "2013",
  delegate: "4004",
  wilder: "5067",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="mainwall" element={<MainWall />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        {/* ROUTES WHICH NEEDS AUTHENT */}
        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.admin, ROLES.delegate, ROLES.wilder]}
            />
          }>
          <Route path="writepost" element={<WritePost />} />
          <Route path="editpost/:postId" element={<EditPost />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
