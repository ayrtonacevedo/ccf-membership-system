import { useState } from "react";
import { storage } from "../../firebaseConfig/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imgProfile from "../../resources/profile.png";

function UploadImage() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(imgProfile);

  // Esta función maneja el cambio en el input de archivo
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]); // Guardamos el archivo de imagen seleccionado
    }
  };
  const handleUpload = () => {
    if (!image) {
      alert("Por favor, selecciona una imagen primero");
      return;
    }
    // Crear una referencia en la carpeta imgProfile
    const storageRef = ref(storage, `imgProfile/${image.name}`);

    // Subir la imagen
    uploadBytes(storageRef, image)
      .then(() => {
        //Obtener la Url de descarga de la imagen
        return getDownloadURL(storageRef);
      })
      .then((url) => {
        console.log("imagen subida con exito.URL:", url);
        setImageUrl(url); //guarda la url en el estado si deseas usarla mas tarde
      })
      .catch((error) => {
        console.log("error al subir la imagen", error);
      });
  };

  return (
    <div>
      {image ? (
        <img
          src={image}
          alt="Uploaded Preview"
          style={{ width: "200px", height: "auto", marginBottom: "10px" }}
        />
      ) : (
        <img
          src={imageUrl}
          alt="Uploaded Preview"
          style={{ width: "200px", height: "auto", marginBottom: "10px" }}
        />
      )}

      <input type="file" onChange={handleImageChange} />

      {image && <p>Imagen seleccionada: {image.name}</p>}

      <button onClick={handleUpload}>Subir Imagen</button>

      {imageUrl && <p>URL de la imagen: {imageUrl}</p>}
    </div>
  );
}

export default UploadImage;
