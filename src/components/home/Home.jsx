import React from "react";
import UploadImage from "../uploadImage/UploadImage";
// import { saveMembersToFirebase } from "../../data/members.seeder";

const Home = () => {
  // const handleSaveMembers = () => {
  //   saveMembersToFirebase();
  // };
  return (
    <div>
      <UploadImage />
    </div>
  );
};

export default Home;
