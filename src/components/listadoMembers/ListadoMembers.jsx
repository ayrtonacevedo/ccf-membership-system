import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteMember,
  getActiveMembers,
  getExpiredMembers,
  getExpiringSoonMembers,
  clearMember,
} from "../../redux/actions";
import {
  formatDate,
  getMembershipStatus,
  confirmDelete,
} from "../../utils/helpers";
import "./listadoMembers.css";
import { Link } from "react-router-dom";

const ListadoMembers = () => {
  const dispatch = useDispatch();

  const currentDate = new Date(); // fecha de hoy
  currentDate.setHours(0, 0, 0, 0); // ajusta a la última hora del día

  const [membersView, setMembersView] = useState([]);

  const activeMembers = useSelector((state) => state.activeMembers);
  const expiredMembers = useSelector((state) => state.expiredMembers);
  const expiringMembers = useSelector((state) => state.expiringMembers);

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;

  //useEffect
  useEffect(() => {
    // Elige el filtro correcto basado en el estado seleccionado

    if (selectedFilter === "activos") {
      setMembersView(activeMembers);
    } else if (selectedFilter === "por expirar") {
      setMembersView(expiringMembers);
    } else if (selectedFilter === "expirados") {
      setMembersView(expiredMembers);
    }
  }, [activeMembers, expiringMembers, expiredMembers, selectedFilter]);

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      dispatch(clearMember()); // Limpia Redux
      setMembersView([]);
      setSelectedFilter(null); // Limpia el estado local
    };
  }, [dispatch]);

  // function delete Member
  const handleDeleteMember = async (id) => {
    confirmDelete(async () => {
      await dispatch(deleteMember(id)); // borra el socio
      setLoading(true);
      // Vuelve a cargar lista basada en el filtro seleccionado
      switch (selectedFilter) {
        case "activos":
          await dispatch(getActiveMembers(currentDate));
          break;
        case "por expirar":
          await dispatch(getExpiringSoonMembers(currentDate));
          break;
        case "expirados":
          await dispatch(getExpiredMembers(currentDate));
          break;
        default:
          break;
      }
      setLoading(false);
    });
  };
  // function list members
  const activeMembersFilter = async () => {
    setCurrentPage(1);
    setSelectedFilter("activos");
    setLoading(true);
    if (activeMembers.length) {
      setMembersView(activeMembers);
      console.log("Actualizo ACTIVE");
    } else {
      await dispatch(getActiveMembers(currentDate));
      console.log("Consulta ACTIVE");
    }
    setLoading(false);
  };
  // por expirar
  const handleExpiringSoonMembers = async () => {
    setCurrentPage(1);
    setSelectedFilter("por expirar");
    setLoading(true);
    if (expiringMembers.length) {
      setMembersView(expiringMembers);
      console.log("Actualizo EXPIRING");
    } else {
      await dispatch(getExpiringSoonMembers(currentDate));
      console.log("Consulta EXPIRING");
    }
    setLoading(false);
  };
  //expirados
  const handleExpiredMembers = async () => {
    setCurrentPage(1);
    setSelectedFilter("expirados");
    setLoading(true);
    if (expiredMembers.length) {
      setMembersView(expiredMembers);
      console.log("Actualizo EXPIRED");
    } else {
      await dispatch(getExpiredMembers(currentDate));
      console.log("Consulta EXPIRED");
    }
    setLoading(false);
  };
  // funtions btn pagination
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = membersView.slice(
    indexOfFirstMember,
    indexOfLastMember
  );
  //pagina anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  //pagina siguiente
  const handleNextPage = () => {
    if (currentPage < Math.ceil(membersView.length / membersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mb-5">
      <h1 className="text-center">Listado de Socios</h1>
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-center gap-2 mb-2 mt-2">
            <button
              className={`btn ${
                selectedFilter === "activos"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={activeMembersFilter}
            >
              Activos
            </button>
            <button
              className={`btn ${
                selectedFilter === "expirados"
                  ? "btn-danger"
                  : "btn-outline-danger"
              }`}
              onClick={handleExpiredMembers}
            >
              Expirados
            </button>
            <button
              className={`btn ${
                selectedFilter === "por expirar"
                  ? "btn-warning text-white"
                  : "btn-outline-warning"
              }`}
              onClick={handleExpiringSoonMembers}
            >
              Por Expirar
            </button>
            {/* <button onClick={handle}>x</button> */}
          </div>
          <div className="table">
            <table className="table table-dark table-hover mt-2">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {!currentMembers.length && !loading && (
                  <tr>
                    <td colSpan="4">
                      <div className="alert alert-info cartel">
                        No se ha seleccionado ningún filtro aún. Usa los botones
                        para empezar.
                      </div>
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan="4">
                      <div className="text-center mt-3">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {currentMembers?.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{formatDate(m.membershipEndDate)}</td>
                    <td>
                      {(() => {
                        const { status, daysRemaining } = getMembershipStatus(
                          m.membershipEndDate
                        );
                        switch (status) {
                          case "active":
                            return (
                              <span
                                className="badge"
                                style={{ backgroundColor: "#02732A" }}
                              >
                                Activa!
                              </span>
                            );
                          case "expiring":
                            if (daysRemaining === 0) {
                              return (
                                <span
                                  className="badge"
                                  style={{ backgroundColor: "#BDAE00" }}
                                >
                                  Expira hoy!
                                </span>
                              );
                            }
                            return (
                              <span
                                className="badge"
                                style={{ backgroundColor: "#BDAE00" }}
                              >
                                Expira en {daysRemaining}
                                {daysRemaining === 1 ? " dia!" : " dias!"}
                              </span>
                            );
                          case "expired":
                            return (
                              <span
                                className="badge"
                                style={{ backgroundColor: "#C62828" }}
                              >
                                Expirada!
                              </span>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </td>
                    <td>
                      <Link
                        to={`/edit/${m.id}`}
                        className="btn"
                        style={{
                          backgroundColor: "#F2F2F2",
                          color: "#023059",
                        }}
                      >
                        <i className="fa-solid fa-user-pen"></i>
                      </Link>
                      <button
                        className="btn"
                        style={{
                          backgroundColor: "#C62828",
                          color: "#F2F2F2",
                        }} // Rojo para eliminar
                        onClick={() => handleDeleteMember(m.id)} // Usar la nueva función
                      >
                        {" "}
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-primary"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={handleNextPage}
              disabled={
                currentPage ===
                  Math.ceil(membersView.length / membersPerPage) ||
                selectedFilter === null
              }
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListadoMembers;
