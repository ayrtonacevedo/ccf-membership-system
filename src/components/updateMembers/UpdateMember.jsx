import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMemberById,
  updateMember,
  uploadImage,
  clearMember,
} from "../../redux/actions";
import img from "../../resources/profileCCf.png";
import { Spinners } from "../spinners/Spinners";

const UpdateMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const member = useSelector((state) => state.member);
  const [loading, setLoading] = useState(false);
  const error = useSelector((state) => state.error);
  const [updating, setUpdating] = useState(false);

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("Seleccionar imagen");
  const [preview, setPreview] = useState(img);

  const [formData, setFormData] = useState({
    name: "",
    dni: "",
    phone: "",
    observaciones: "",
    membershipStartDate: "",
    membershipEndDate: "",
    img: "",
  });

  // Obtener datos del socio por id
  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(fetchMemberById(id))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
    return () => {
      dispatch(clearMember());
    };
  }, [dispatch, id]);
  useEffect(() => {
    if (member) {
      setFormData((prev) => ({
        ...prev,
        ...member,
      }));
    }
  }, [member]);

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
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

  const validateForm = () => {
    if (formData.dni.length < 7 || formData.dni.length > 8)
      return "DNI debe tener entre 7 y 8 dígitos.";
    if (formData.phone.length < 10)
      return "Teléfono debe tener al menos 10 dígitos.";
    if (!image && !member.img) return "Por favor, selecciona una imagen.";
    return null;
  };
  // Función para actualizar los datos del socio en Firestore
  const handleUpdate = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return alert(error);
    setUpdating(true);
    // comprobar si se necesita subir imagen
    let updatedFormData = { ...formData }; // Copia de formData
    if (!member.img) {
      if (!image) {
        alert("Por favor, selecciona una imagen primero");
        setUpdating(false);
        return;
      }
      try {
        // sube img y obtiene url
        const imageUrl = await dispatch(uploadImage(image));
        if (imageUrl) {
          updatedFormData.img = imageUrl;
        } else {
          throw new Error("No se pudo obtener la URL de la imagen");
        }
      } catch (error) {
        console.error("Error al subir la imagen: ", error);
        alert("Hubo un problema al subir la imagen.");
        setUpdating(false);
        return; // Detener la ejecución si hay un error
      }
    }
    try {
      const success = await dispatch(updateMember(id, updatedFormData));
      if (success) {
        dispatch(clearMember());
        navigate("/");
      }
    } catch (error) {
      console.error("Error al actualizar el socio: ", error);
      alert("Hubo un problema al actualizar el socio.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinners />;
  if (error) return <div>Error: {error.message || "Ocurrió un problema."}</div>; // Mostrar un mensaje más claro

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
        <div className="col ">
          <h1 className="h1-agregarSocio">Editar socio</h1>

          <form onSubmit={handleUpdate}>
            <div className="row d-flex">
              <div className="row col-md-3 d-flex justify-content-center align-items-center">
                <img
                  src={formData.img ? formData.img : preview}
                  alt="Imagen Perfil"
                  className="imgProfile"
                />

                {!member?.img && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      id="fileInput"
                      name="img"
                    />
                    <label
                      htmlFor="fileInput"
                      className="icon-label"
                      name="img"
                    >
                      <i
                        className="bi bi-cloud-arrow-up fs-1"
                        style={{ color: "#1E8880" }}
                      ></i>
                      {fileName}
                    </label>
                  </>
                )}
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
                      onChange={handleInputChange}
                      required
                      id="nameInput"
                    />
                  </div>
                  <div className="mb-2 me-2" style={{ flex: 1 }}>
                    <label className="form-label label-agregarSocio">DNI</label>
                    <input
                      type="number"
                      name="dni"
                      className="form-control input-agregarSocio"
                      value={formData.dni}
                      onChange={handleInputChange}
                      required
                      id="dniInput"
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
                      onChange={handleInputChange}
                      required
                      id="phoneInput"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label label-agregarSocio">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    id="observacionesInput"
                    className="form-control input-agregarSocio"
                    value={formData.observaciones}
                    onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      required
                      id="membershipStartDateInput"
                    />
                  </div>
                  <div className="mb-2 me-2" style={{ flex: 1 }}>
                    <label className="form-label label-agregarSocio">
                      Fecha vencimiento
                    </label>
                    <input
                      type="date"
                      name="membershipEndDate"
                      className="form-control input-agregarSocio"
                      value={formData.membershipEndDate}
                      onChange={handleInputChange}
                      required
                      id="membershipEndDateInput"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className=" mt-5 btn btn-primary btn-agregar"
                  disabled={updating}
                >
                  {updating ? "Actualizando..." : "Actualizar Socio"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMember;
