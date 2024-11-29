import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { uploadImage } from "../../redux/actions";
import imgProfile from "../../resources/profile.png";

function UploadImage() {
  const dispatch = useDispatch();
  const imageUrl = useSelector((state) => state.imageUrl);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const [preview, setPreview] = useState(imgProfile);

  // Esta función maneja el cambio en el input de archivo
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Guardamos el archivo de imagen seleccionado
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };
  const handleUpload = () => {
    if (!image) {
      alert("Por favor, selecciona una imagen primero");
      return;
    }
    setUploading(true);
    dispatch(uploadImage(image));
    setImage(null);
    setUploading(false);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-4 text-center">
          <div className="card p-4">
            {preview && (
              <img
                src={preview} // Usa la URL de la imagen desde el estado
                alt="Uploaded Preview"
                className="img-thumbnail mb-3"
                style={{ width: "150px", height: "auto" }}
              />
            )}

            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>

            {/* {image && (
              <p className="text-secondary">
                Imagen seleccionada: {image.name}
              </p>
            )} */}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn btn-primary"
            >
              {uploading ? "Subiendo..." : "Subir Imagen"}
            </button>

            {uploading && (
              <p className="text-info mt-3">
                Subiendo imagen, por favor espera...
              </p>
            )}
            {error && <p className="text-danger mt-3">{error}</p>}
            {imageUrl && (
              <p className="text-success mt-3">URL de la imagen: {imageUrl}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;
