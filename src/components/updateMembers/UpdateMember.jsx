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
    const memberDoc = await getDoc(doc(db, "socios", id));
    if (memberDoc.exists()) {
      const data = memberDoc.data();
      setMember({
        ...data,
        membershipStartDate: data.membershipStartDate
          .toDate()
          .toISOString()
          .substring(0, 10), // Obtener fecha
        membershipEndDate: data.membershipEndDate
          .toDate()
          .toISOString()
          .substring(0, 10), // Obtener fecha
      });
    }
  };

  useEffect(() => {
    getMemberById();
  }, []);

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  // Función para actualizar los datos del socio en Firestore
  const handleUpdate = async (e) => {
    e.preventDefault();
    const memberDoc = doc(db, "socios", id);

    // Convertir la fecha seleccionada a las 00:00:00 UTC para evitar desfases de horas
    const startDate = new Date(member.membershipStartDate);
    startDate.setUTCHours(0, 0, 0, 0); // Ajustar la hora a medianoche UTC

    const endDate = new Date(member.membershipEndDate);
    endDate.setUTCHours(0, 0, 0, 0); // Ajustar la hora a medianoche UTC

    // Actualizamos el documento con los datos ingresados y convertimos las fechas a Timestamp
    await updateDoc(memberDoc, {
      name: member.name,
      dni: Number(member.dni),
      phone: Number(member.phone),
      observaciones: member.observaciones,
      membershipStartDate: Timestamp.fromDate(startDate), // Guardar sin horas
      membershipEndDate: Timestamp.fromDate(endDate), // Guardar sin horas
    });

    navigate("/"); // Redirigir a la lista de miembros después de la actualización
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
