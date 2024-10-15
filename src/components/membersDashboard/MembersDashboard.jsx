import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMembers, deleteMember } from "../../redux/actions";
import { Link } from "react-router-dom";
import {
  formatDate,
  getMembershipStatus,
  confirmDelete,
} from "../../utils/helpers";

const MembersDashboard = () => {
  const dispatch = useDispatch();

  const members = useSelector((state) => state.members);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);

  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;

  // useEffect(() => {
  //   dispatch(fetchMembers());
  // }, [dispatch]);
  useEffect(() => {
    if (members.length === 0) {
      console.log("actions");
      dispatch(fetchMembers());
    }
  }, [dispatch, members.length]);

  //funciones para manejar la navegacion entre paginas
  const handleNextPage = () => {
    if (currentPage < Math.ceil(members.length / membersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  // Funcion para eliminar un documento
  const handleDeleteMember = (id) => {
    confirmDelete(() => dispatch(deleteMember(id))); // Usar deleteMember aquí
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex gap-2 mt-2">
              <Link
                to="/createMember"
                className="btn"
                style={{ backgroundColor: "#02732A", color: "#F2F2F2" }} // Verde intenso
              >
                Agregar Socio
              </Link>
              <Link
                to="/findMember"
                className="btn"
                style={{ backgroundColor: "#023059", color: "#F2F2F2" }} // Azul profundo
              >
                Control de Ingreso
              </Link>
            </div>

            {/* Botones de paginación arriba */}
            <div className="d-flex justify-content-between mb-2 mt-2">
              <button
                className="btn"
                style={{ backgroundColor: "#012840", color: "#F2F2F2" }} // Azul marino
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <button
                className="btn"
                style={{ backgroundColor: "#012840", color: "#F2F2F2" }} // Azul marino
                onClick={handleNextPage}
                disabled={
                  currentPage === Math.ceil(members.length / membersPerPage)
                }
              >
                Siguiente
              </button>
            </div>

            <table className="table table-dark table-hover mt-2">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha vencimiento</th>
                  <th>Membresía</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{formatDate(member.membershipEndDate)}</td>
                    <td>
                      {(() => {
                        const { status, daysRemaining } = getMembershipStatus(
                          member.membershipEndDate
                        );
                        switch (status) {
                          case "active":
                            return (
                              <span
                                className="badge"
                                style={{ backgroundColor: "#02732A" }}
                              >
                                Activa
                              </span>
                            );
                          case "expiring":
                            return (
                              <span
                                className="badge"
                                style={{ backgroundColor: "#0F5929" }}
                              >
                                Por vencer en {daysRemaining}{" "}
                                {daysRemaining === 1 ? "día" : "días"}
                              </span>
                            );
                          case "expired":
                            return (
                              <span
                                className="badge"
                                style={{ backgroundColor: "#C62828" }}
                              >
                                Expirada
                              </span>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </td>
                    <td>
                      <Link
                        to={`/edit/${member.id}`}
                        className="btn"
                        style={{
                          backgroundColor: "#F2F2F2",
                          color: "#023059",
                        }} // Blanco suculento con texto azul profundo
                      >
                        <i className="fa-solid fa-user-pen"></i>
                      </Link>
                      <button
                        className="btn"
                        style={{
                          backgroundColor: "#C62828",
                          color: "#F2F2F2",
                        }} // Rojo para eliminar
                        onClick={() => handleDeleteMember(member.id)} // Usar la nueva función
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Botones de paginación abajo */}
            <div className="d-flex justify-content-between mt-2 mb-2">
              <button
                className="btn"
                style={{ backgroundColor: "#012840", color: "#F2F2F2" }} // Azul marino
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <button
                className="btn"
                style={{ backgroundColor: "#012840", color: "#F2F2F2" }} // Azul marino
                onClick={handleNextPage}
                disabled={
                  currentPage === Math.ceil(members.length / membersPerPage)
                }
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembersDashboard;
