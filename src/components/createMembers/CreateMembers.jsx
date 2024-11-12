import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMember, uploadImage } from "../../redux/actions";
import { useDispatch } from "react-redux";
import {
  convertDateToTimestamp,
  isValidDni,
  isValidPhone,
} from "../../utils/helpers";
import img from "../../resources/profileCCf.png";
import "./createMembers.css";

const CreateMembers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    dni: "",
    phone: "",
    observaciones: "",
    membershipStartDate: "",
    membershipEndDate: "",
    img: "",
  });

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("Seleccionar imagen");
  const [preview, setPreview] = useState(img);

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar el cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para agregar un nuevo socio
  const createMember = async (e) => {
    e.preventDefault();
    //Validaciones
    if (!isValidDni(formData.dni)) {
      setError("El DNI debe tener entre 7 y 8 digitos");
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setError("El teléfono debe tener al menos 10 dígitos.");
      return;
    }
    setLoading(true);
    setError(""); // Limpiar cualquier error previo
    try {
      // si se ha se seleccionado una imagen, se sube. Si no, asignamos un valor null
      let imageUrl = null;
      if (image) {
        imageUrl = await handleImageUpload();
      }
      // Datos del nuevo socio
      const memberData = {
        name: formData.name,
        dni: Number(formData.dni),
        phone: Number(formData.phone),
        observaciones: formData.observaciones,
        membershipStartDate: convertDateToTimestamp(
          formData.membershipStartDate
        ),
        membershipEndDate: convertDateToTimestamp(formData.membershipEndDate),
        img: imageUrl || null, // Asigna null si no se cargó una imagen
      };
      //agrega al socio
      await dispatch(addMember(memberData));
      //redirecciona al home
    } catch (error) {
      console.error("Error al crear socio:", error);
      setError("Hubo un problema al crear el socio");
    } finally {
      setLoading(false);
      navigate("/");
    }
  };
  // subir img y obtener URL
  const handleImageUpload = async () => {
    if (!image) return null;
    try {
      return await dispatch(uploadImage(image));
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setError("Hubo un problema al subir la imagen");
      return null;
    }
  };

  return (
    <div className="container-createMembers position-relative">
      <button
        // Usa navigate para volver al home
        className="btn btn-link"
        style={{
          fontSize: "1.5rem",
          color: "#1E8880",
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
        onClick={() => navigate("/")}
        aria-label="Volver al Home"
      >
        <i className="bi bi-x-circle"></i>
      </button>
      <div className="row">
        <div className="col">
          <h1 className="h1-agregarSocio">Agregar Socio</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={createMember}>
            <div className="row d-flex">
              <div className="row col-md-3 d-flex justify-content-center align-items-center">
                {preview && (
                  <img src={preview} alt="Img Perfil" className="imgProfile" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="icon-label">
                  {" "}
                  <i
                    className="bi bi-cloud-arrow-up fs-1"
                    style={{ color: "#1E8880" }}
                  ></i>
                  {fileName}
                </label>
              </div>
              <div className="col">
                <div className="col d-flex justify-content-between">
                  <div className="mb-2 me-2" style={{ flex: 1 }}>
                    <label className="form-label label-agregarSocio">
                      Nombre
                    </label>
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
                      Telefono
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
                    id=""
                    className="form-control input-agregarSocio"
                    value={formData.observaciones}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <div className="mb-2 me-2" style={{ flex: 1 }}>
                    <label className="form-label label-agregarSocio">
                      Fecha Inicio
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
                      Fecha Vencimiento
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
                <button
                  type="submit"
                  className="mt-5  btn btn-primary
                btn-agregar"
                  disabled={loading}
                >
                  {loading ? "Agregando socio..." : "Agregar socio"}
                </button>
                {loading && <p>Cargando, por favor espera...</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMembers;
