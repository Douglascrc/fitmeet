import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import { Toaster } from "sonner";
import Profile from "./pages/profile";
import { PrivateRoutes } from "./utils/privateRoutes";
import { AuthProvider } from "./context/AuthContext";
import EditProfile from "./pages/editProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/register" index element={<Register />} />
          <Route path="/login" index element={<Login />} />

          <Route path="/" index element={<Home />} />

          <Route path="" element={<PrivateRoutes />}>
            <Route path="/perfil" element={<Profile />} />
            <Route path="/editar" element={<EditProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
