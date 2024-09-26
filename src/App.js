import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MembersDashboard from "./components/membersDashboard/MembersDashboard";
import CreateMembers from "./components/createMembers/CreateMembers";
import UpdateMember from "./components/updateMembers/UpdateMember";
import FindMember from "./components/findMember/FindMember";
import AdminLogin from "./components/adminLogin/AdminLogin";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Layout from "./layout/Layout";
import Home from "./components/home/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Ruta pública para el login */}
          <Route path="/adminLogin" element={<AdminLogin />} />
          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <MembersDashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/createMember"
            element={
              <PrivateRoute>
                <Layout>
                  <CreateMembers />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <UpdateMember />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/findMember"
            element={
              <PrivateRoute>
                <Layout>
                  <FindMember />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
