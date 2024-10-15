import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MembersDashboard from "./components/membersDashboard/MembersDashboard";
import CreateMembers from "./components/createMembers/CreateMembers";
import UpdateMember from "./components/updateMembers/UpdateMember";
import FindMember from "./components/findMember/FindMember";
import AdminLogin from "./components/adminLogin/AdminLogin";
import ProtectedRoute from "./components/privateRoute/ProtectedRoute"; // Asegúrate de que esta línea sea correcta
import Home from "./components/home/Home";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta pública para el login */}
            <Route path="/adminLogin" element={<AdminLogin />} />
            {/* Rutas protegidas */}
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<MembersDashboard />} />}
            />
            <Route
              path="/createMember"
              element={<ProtectedRoute element={<CreateMembers />} />}
            />
            <Route
              path="/edit/:id"
              element={<ProtectedRoute element={<UpdateMember />} />}
            />
            <Route path="/findMember" element={<FindMember />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
