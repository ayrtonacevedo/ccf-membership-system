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
    <div className="container">
      <h2>Edit Member</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={member.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>DNI:</label>
          <input
            type="number"
            name="dni"
            className="form-control"
            value={member.dni}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="number"
            name="phone"
            className="form-control"
            value={member.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Observaciones:</label>
          <textarea
            name="observaciones"
            className="form-control"
            value={member.observaciones}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Membership Start Date:</label>
          <input
            type="date"
            name="membershipStartDate"
            className="form-control"
            value={member.membershipStartDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Membership End Date:</label>
          <input
            type="date"
            name="membershipEndDate"
            className="form-control"
            value={member.membershipEndDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Member
        </button>
      </form>
    </div>
  );
};

export default UpdateMember;
