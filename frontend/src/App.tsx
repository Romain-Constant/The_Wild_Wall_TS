import {Route, Routes} from "react-router-dom";
import Layout from "./components/layout/Layout";
import RequireAuth from "./components/requireAuth/RequireAuth";
import ArchivedPosts from "./pages/ArchivedPosts";
import EditPost from "./pages/EditPost";
import Login from "./pages/Login";
import MainWall from "./pages/MainWall";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import WritePost from "./pages/WritePost";
import Admin from "./pages/Admin";

// Define role codes
const ROLES = {
  admin: "2013",
  delegate: "4004",
  wilder: "5067",
};

function App() {
  return (
    <Routes>
      {/* Base route with layout */}
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="mainwall" element={<MainWall />} />
        <Route path="archives" element={<ArchivedPosts />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* Routes requiring authentication */}
        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.admin, ROLES.delegate, ROLES.wilder]}
            />
          }>
          {/* Authenticated user routes */}
          <Route path="writepost" element={<WritePost />} />
          <Route path="editpost/:postId" element={<EditPost />} />
        </Route>

        {/* Routes accessible only to admins */}
        <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
