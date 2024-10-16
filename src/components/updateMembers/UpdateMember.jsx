import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Timestamp } from "firebase/firestore";

const UpdateMember = () => {
  const [member, setMember] = useState({
    name: "",
    dni: "",
    phone: "",
    observaciones: "",
    membershipStartDate: "",
    membershipEndDate: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // Obtener datos del socio por id
  const getMemberById = async () => {
    try {
      const memberDoc = await getDoc(doc(db, "socios", id));
      if (memberDoc.exists()) {
        const data = memberDoc.data();
        setMember({
          ...data,
          membershipStartDate: data.membershipStartDate
            .toDate()
            .toISOString()
            .substring(0, 10),
          membershipEndDate: data.membershipEndDate
            .toDate()
            .toISOString()
            .substring(0, 10),
        });
      } else {
        alert("Socio no encontrado.");
      }
    } catch (error) {
      alert("Hubo un problema al obtener los datos del socio.");
    }
  };

  useEffect(() => {
    getMemberById();
  }, [id]);

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  // Función para actualizar los datos del socio en Firestore
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (member.dni.length < 7 || member.dni.length > 8) {
      alert("El DNI debe tener entre 7 y 8 dígitos.");
      return;
    }

    if (member.phone.length < 10) {
      alert("El teléfono debe tener al menos 10 dígitos.");
      return;
    }

    try {
      const memberDoc = doc(db, "socios", id);

      // Convertir la fecha seleccionada
      const convertir = (d) => {
        const date = new Date(d + "T00:00:00"); // Agrega la hora a medianoche
        return Timestamp.fromDate(date);
      };

      // Actualizar el documento en Firestore
      await updateDoc(memberDoc, {
        name: member.name,
        dni: Number(member.dni),
        phone: Number(member.phone),
        observaciones: member.observaciones,
        membershipStartDate: convertir(member.membershipStartDate),
        membershipEndDate: convertir(member.membershipEndDate),
      });

      navigate("/dashboard"); // Redirigir a la lista de miembros después de la actualización
    } catch (error) {
      alert("Hubo un problema al actualizar el socio.");
    }
  };

  return (
    <div className="container-createMembers">
      <div className="row">
        <div className="col">
          <h1 className="h1-agregarSocio">Editar Socio</h1>
          <form onSubmit={handleUpdate}>
            <div className="d-flex justify-content-between">
              <div className="mb-2 me-2 " style={{ flex: 1 }}>
                <label className="form-label label-agregarSocio">Nombre</label>
                <input
                  type="text"
                  name="name"
                  className="form-control input-agregarSocio"
                  value={member.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-2 me-2" style={{ flex: 1 }}>
                <label className="form-label label-agregarSocio">DNI</label>
                <input
                  type="number"
                  name="dni"
                  className="form-control input-agregarSocio"
                  value={member.dni}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-2 me-2" style={{ flex: 1 }}>
                <label className="form-label label-agregarSocio">
                  Telefono
                </label>
                <input
                  type="number"
                  name="phone"
                  className="form-control input-agregarSocio"
                  value={member.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label label-agregarSocio">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                className="form-control input-agregarSocio"
                value={member.observaciones}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="d-flex justify-content-between">
              <div className="mb-2 me-2" style={{ flex: 1 }}>
                <label className="form-label label-agregarSocio">
                  Fecha de Inicio de Membresía
                </label>
                <input
                  type="date"
                  name="membershipStartDate"
                  className="form-control input-agregarSocio"
                  value={member.membershipStartDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-2" style={{ flex: 1 }}>
                <label className="form-label label-agregarSocio">
                  Fecha de Fin de Membresía
                </label>
                <input
                  type="date"
                  name="membershipEndDate"
                  className="form-control input-agregarSocio"
                  value={member.membershipEndDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-agregar">
              Actualizar Socio
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMember;
