import React, { useEffect } from "react";
import { seedMembersInBD } from "../../data/seedMembers.js";

const Home = () => {
  // useEffect(() => {
  //   const initializeDatabase = async () => {
  //     await seedMembersInBD();
  //   };
  //   initializeDatabase();
  // }, []);
  // El array vacío asegura que esto se ejecute solo una vez al montar el componente.
  return <div>Home</div>;
};

export default Home;
