import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "date-fns"; // Importa la función de formateo de fechas
import { Timestamp } from "firebase/firestore";

const MySwal = withReactContent(Swal);

const MembersDashboard = () => {
  const [members, setMembers] = useState([]);
  const [loanding, setLoanding] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;
  const membersCollection = collection(db, "socios");
  // funcion para mostrar TODOS los documentos
  const getMembers = async () => {
    setLoanding(true); // inicia la carga
    const data = await getDocs(membersCollection);
    setMembers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoanding(false);
  };

  // Funcion para eleminar un documento
  const deleteMembers = async (id) => {
    const membersDoc = doc(db, "socios", id);
    await deleteDoc(membersDoc);
    setMembers(members.filter((member) => member.id !== id));
  };
  // Funcion de configuracion para Sweet Alert
  const confirmDelete = (id) => {
    MySwal.fire({
      title: "Eliminar Socio?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminarlo!",
    }).then((result) => {
      if (result.isConfirmed) {
        //llamada a la funciono delete
        deleteMembers(id);
        Swal.fire("¡Eliminado!", "Su archivo ha sido eliminado", "success");
      }
    });
  };
  useEffect(() => {
    getMembers();
    console.log("hola");
  }, []);

  //formateo hora de firebase a js
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return format(timestamp.toDate(), "dd/MM/yyyy");
  };

  // Función para comparar la fecha actual con membershipEndDate
  // Función para verificar si la membresía está activa, expirada o por vencer
  const getMembershipStatus = (membershipEndDate) => {
    if (!membershipEndDate) return { status: "expired", daysRemaining: 0 }; // Si no hay fecha, se considera expirada

    if (!(membershipEndDate instanceof Timestamp)) {
      throw new Error("Invalid membership end date"); // Verificar si es un Timestamp válido
    }

    const currentDate = new Date(); // Fecha actual
    const endDate = membershipEndDate.toDate(); // Convertimos el Timestamp a Date

    // Calculamos la diferencia en milisegundos y la convertimos a días
    const diffTime = endDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "expired", daysRemaining: 0 }; // La membresía ya expiró
    } else if (diffDays <= 3) {
      return { status: "expiring", daysRemaining: diffDays }; // La membresía expira en los próximos días
    } else {
      return { status: "active", daysRemaining: diffDays }; // La membresía está activa
    }
  };
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
  // Calcular los indices de inicio y fin para la paginacion
  const indexOfLastMember = currentPage * membersPerPage; //Ultimo indice del miembro en la pagina actual
  const indexOfFirstMember = indexOfLastMember - membersPerPage; // Primer indice del miembro en la pagina actual
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember); // Miemtros a mostrar en la pagina actual

  return (
    <>
      {loanding ? (
        <p>Cargando...</p>
      ) : (
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
                                  {" "}
                                  {/* Verde intenso */}
                                  Activa
                                </span>
                              );
                            case "expiring":
                              return (
                                <span
                                  className="badge"
                                  style={{ backgroundColor: "#0F5929" }}
                                >
                                  {" "}
                                  {/* Verde oscuro */}
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
                                  {" "}
                                  {/* Color rojo por expirada */}
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
                          onClick={() => {
                            confirmDelete(member.id);
                          }}
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
      )}
    </>
  );
};

export default MembersDashboard;
