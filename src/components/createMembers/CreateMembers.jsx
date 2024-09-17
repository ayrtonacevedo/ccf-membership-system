import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Timestamp } from "firebase/firestore";

const CreateMembers = () => {
  const [formData, setFormData] = useState({
    name: "",
    dni: "",
    phone: "",
    observaciones: "",
    membershipStartDate: "",
    membershipEndDate: "",
  });

  const navigate = useNavigate();
  const membersCollection = collection(db, "socios");

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  // Validación adicional para DNI y teléfono
  const isValidDni = (dni) => dni.length >= 7 && dni.length <= 8;
  const isValidPhone = (phone) => phone.length >= 10;

  // Convertir fecha a Timestamp

  const convertir = (d) => {
    const date = new Date(d + "T00:00:00"); // Agrega la hora a medianoche
    return Timestamp.fromDate(date);
  };

  // Función para agregar un nuevo socio
  const createMember = async (e) => {
    e.preventDefault();
    if (!isValidDni(formData.dni)) {
      alert("El DNI debe tener entre 7 y 8 dígitos.");
      return;
    }
    if (!isValidPhone(formData.phone)) {
      alert("El teléfono debe tener al menos 10 dígitos.");
      return;
    }

    try {
      await addDoc(membersCollection, {
        name: formData.name,
        dni: Number(formData.dni),
        phone: Number(formData.phone),
        observaciones: formData.observaciones,
        membershipStartDate: convertir(formData.membershipStartDate),
        membershipEndDate: convertir(formData.membershipEndDate),
      });
      navigate("/"); // Redireccionar al dashboard o lista de socios después de crear
    } catch (error) {
      console.error("Error al crear socio: ", error);
      alert("Hubo un problema al crear el socio.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Crear Socio</h1>
          <form onSubmit={createMember}>
            <div className="mb-2">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">DNI</label>
              <input
                type="number"
                name="dni"
                className="form-control"
                value={formData.dni}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Teléfono</label>
              <input
                type="number"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Observaciones</label>
              <textarea
                name="observaciones"
                className="form-control"
                value={formData.observaciones}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Fecha de Inicio de Membresía</label>
              <input
                type="date"
                name="membershipStartDate"
                className="form-control"
                value={formData.membershipStartDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Fecha de Fin de Membresía</label>
              <input
                type="date"
                name="membershipEndDate"
                className="form-control"
                value={formData.membershipEndDate}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Crear Socio
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMembers;
