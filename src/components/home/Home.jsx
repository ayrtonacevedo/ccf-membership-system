import React from "react";
import imgAddMember from "../../resources/addMember.webp";
import imgAllMember from "../../resources/allMember.webp";
import imgControlIngreso from "../../resources/controlIngreso.webp";
import { Link } from "react-router-dom";
import "./home.css";
const Home = () => {
  const items = [
    {
      id: 1,
      name: "Control Ingreso",
      img: imgControlIngreso,
      url: "/findMember",
    },
    {
      id: 2,
      name: "Agregar Socio",
      img: imgAddMember,
      url: "/createMember",
    },
    {
      id: 3,
      name: "Lista Socios",
      img: imgAllMember,
      url: "/dashboard",
    },
  ];
  return (
    <div className="home container mt-4">
      <div className="row">
        {items.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <Link to={item.url} className="card-link">
              <figure className="card">
                <img src={item.img} alt={item.name} className="card_image" />
                <figcaption className="card_body">
                  <h2 className="card_title">{item.name}</h2>
                </figcaption>
              </figure>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
