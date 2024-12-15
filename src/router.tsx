import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/Auth";
import AppLayout from "./layouts/AppLayout";
import LinkTree from "./views/LinkTree";
import Profile from "./views/Profile";
import Login from "./views/Login";
import Register from "./views/Register";
import Handle from "./views/Handle";
import NotFound from "./views/NotFound";
import Home from "./views/Home";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* View Auth */}
        <Route element={<AuthLayout />}>
          <Route path="auth/register" element={<Register />} />
          <Route path="auth/login" element={<Login />} />
        </Route>
        {/* View config user profile */}
        <Route path="/admin" element={<AppLayout />}>
          <Route index={true} element={<LinkTree />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* View user profile */}
        <Route path="/:handle" element={<AuthLayout />}>
          <Route index={true} element={<Handle />} />
        </Route>
        {/* Page Not Found */}
        <Route path="/" element={<Home />} />
        <Route path="/404" element={<AuthLayout />}>
          <Route index={true} element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
