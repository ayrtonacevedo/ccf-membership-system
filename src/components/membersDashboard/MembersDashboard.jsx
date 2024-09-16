import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "date-fns"; // Importa la función de formateo de fechas
const MySwal = withReactContent(Swal);

const MembersDashboard = () => {
  // 1- configuramos los hooks
  const [members, setMembers] = useState([]);
  // 2- referenciamos a la DB firestore
  const membersCollection = collection(db, "socios");
  // 3- funcion para mostrar TODOS los documentos
  const getMembers = async () => {
    const data = await getDocs(membersCollection);
    setMembers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  // 4- Funcion para eleminar un documento
  const deleteMembers = async (id) => {
    const membersDoc = doc(db, "socios", id);
    await deleteDoc(membersDoc);
    getMembers();
  };
  // 5- Funcion de configuracion para Sweet Alert
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
  // 6- usamos useEffect
  useEffect(() => {
    getMembers();
    console.log(members);
  }, []);

  //formateo hora de firebase a js
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return format(timestamp.toDate(), "dd/MM/yyyy");
  };
  // comparo fecha actual con membershipEndDate
  // Función para comparar la fecha actual con membershipEndDate
  // Función para verificar si la membresía está activa, expirada o por vencer
  const getMembershipStatus = (membershipEndDate) => {
    if (!membershipEndDate) return "expired"; // Si no hay fecha, se considera expirada

    const currentDate = new Date(); // Fecha actual
    const endDate = membershipEndDate.toDate(); // Convertimos el Timestamp a Date

    // Calculamos la diferencia en milisegundos y la convertimos a días
    const diffTime = endDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "expired"; // La membresía ya expiró
    } else if (diffDays <= 3) {
      return "expiring"; // La membresía expira en los próximos 3 días
    } else {
      return "active"; // La membresía está activa
    }
  };

  // 7- devolvemos vista de nuestro componente
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-grid gap-2">
              <Link to="/createMember" className="btn btn-secondary mt-2 mb-2">
                Create
              </Link>
            </div>
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>Socio</th>
                  <th>Fecha vencimiento</th>
                  <th>Membresia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{formatDate(member.membershipEndDate)}</td>
                    <td>
                      {(() => {
                        const status = getMembershipStatus(
                          member.membershipEndDate
                        );
                        if (status === "active") {
                          return (
                            <span className="badge bg-success">Activa</span>
                          );
                        } else if (status === "expiring") {
                          return (
                            <span className="badge bg-warning">
                              Por vencer en 3 días
                            </span>
                          );
                        } else {
                          return (
                            <span className="badge bg-danger">Expirada</span>
                          );
                        }
                      })()}
                    </td>
                    <td>
                      <Link to={`/edit/${member.id}`} className="btn btn-light">
                        <i className="fa-solid fa-user-pen"></i>
                      </Link>
                      <button
                        className="btn btn-danger"
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
          </div>
        </div>
      </div>
    </>
  );
};

export default MembersDashboard;
