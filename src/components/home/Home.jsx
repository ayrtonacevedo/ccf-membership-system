import React from "react";
import centerImg from "../../resources/centerImg.webp";
import rightImg from "../../resources/rightImg.webp";
import leftImg from "../../resources/leftImg.webp";
import { Link } from "react-router-dom";
import "./home.css";
const Home = () => {
  const items = [
    {
      id: 1,
      name: "Control Ingreso",
      img: leftImg,
      url: "/findMember",
    },
    {
      id: 2,
      name: "Agregar Socio",
      img: centerImg,
      url: "/createMember",
    },
    {
      id: 3,
      name: "Lista Socios",
      img: rightImg,
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
