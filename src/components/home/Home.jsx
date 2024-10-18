import React, { useState } from "react";
import UploadImage from "../uploadImage/UploadImage";
// import { saveMembersToFirebase } from "../../data/members.seeder";

const Home = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    observaciones: "",
    fechaInicio: "",
    fechaVencimiento: "",
  });

  // Función para manejar el cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para manejar el cambio de los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías procesar el envío de datos, incluyendo la imagen
    console.log("Datos del formulario:", formData);
    console.log("Imagen:", image);
  };

  return (
    <div className="container-createMembers">
      <div className="row">
        <div className="col">
          <h1 className="h1-agregarSocio">Agregar Socio</h1>
          <form onSubmit={""}>
            <div className="row d-flex ">
              <div className="row col-md-3 d-flex justify-content-center align-items-center">
                {preview && (
                  <img
                    src={preview} // Usa la URL de la imagen desde el estado
                    alt="Uploaded Preview"
                    className="img-thumbnail mb-3"
                    style={{ width: "200px", height: "auto" }}
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="form-control-sm"
                  onChange={handleImageChange}
                />
              </div>

              <div className="col d-flex">
                <div className="mb-2 me-2">
                  <label className="form-label label-agregarSocio">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control input-agregarSocio"
                    value={formData.name}
                    onChange={""}
                    required
                  />
                </div>

                <div className="mb-2 me-2">
                  <label className="form-label label-agregarSocio">DNI</label>
                  <input
                    type="number"
                    name="dni"
                    className="form-control input-agregarSocio"
                    value={formData.dni}
                    onChange={""}
                    required
                  />
                </div>

                <div className="mb-2 me-2">
                  <label className="form-label label-agregarSocio">
                    Teléfono
                  </label>
                  <input
                    type="number"
                    name="phone"
                    className="form-control input-agregarSocio"
                    value={formData.phone}
                    onChange={""}
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
