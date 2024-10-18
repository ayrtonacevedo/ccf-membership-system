import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMember } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { convertDateToTimestamp } from "../../utils/helpers";
import "./createMembers.css";

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
  const dispatch = useDispatch();

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  // Validación adicional para DNI y teléfono
  const isValidDni = (dni) => dni.length >= 7 && dni.length <= 8;
  const isValidPhone = (phone) => phone.length >= 10;

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
      const memberData = {
        name: formData.name,
        dni: Number(formData.dni),
        phone: Number(formData.phone),
        observaciones: formData.observaciones,
        membershipStartDate: convertDateToTimestamp(
          formData.membershipStartDate
        ),
        membershipEndDate: convertDateToTimestamp(formData.membershipEndDate),
      };
      dispatch(addMember(memberData));
      navigate("/dashboard"); // Redireccionar al dashboard o lista de socios después de crear
    } catch (error) {
      console.error("Error al crear socio: ", error);
      alert("Hubo un problema al crear el socio.");
    }
  };

  return (
    <div className="container-createMembers">
      <div className="row">
        <div className="col">
          <h1 className="h1-agregarSocio">Agregar Socio</h1>
          <form onSubmit={createMember}>
            <div className="d-flex justify-content-between">
              <div className="mb-2 me-2 " style={{ flex: 1 }}>
                <label className="form-label label-agregarSocio">Nombre</label>
                <input
                  type="text"
                  name="name"
                  className="form-control input-agregarSocio"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2 me-2" style={{ flex: 1 }}>
                <label className="form-label label-agregarSocio">DNI</label>
                <input
                  type="number"
                  name="dni"
                  className="form-control input-agregarSocio"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2 me-2" style={{ flex: 1 }}>
                <label className="form-label label-agregarSocio">
                  Teléfono
                </label>
                <input
                  type="number"
                  name="phone"
                  className="form-control input-agregarSocio"
                  value={formData.phone}
                  onChange={handleChange}
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
                value={formData.observaciones}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex justify-content-between">
              <div className="mb-2 me-2" style={{ flex: 1 }}>
                <label className="form-label label-agregarSocio">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  name="membershipStartDate"
                  className="form-control input-agregarSocio"
                  value={formData.membershipStartDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2" style={{ flex: 1 }}>
                <label className="form-label label-agregarSocio">
                  Fecha vencimiento
                </label>
                <input
                  type="date"
                  name="membershipEndDate"
                  className="form-control input-agregarSocio"
                  value={formData.membershipEndDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-agregar">
              Agregar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMembers;
