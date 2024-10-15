import React from "react";
import PrivateRoute from "./PrivateRoute";
import Layout from "../../layout/Layout";

const ProtectedRoute = ({ element }) => (
  <PrivateRoute>
    <Layout>{element}</Layout>
  </PrivateRoute>
);

export default ProtectedRoute;
