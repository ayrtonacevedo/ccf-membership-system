import React from "react";
import { saveMembersToFirebase } from "../../data/members.seeder";

const Home = () => {
  const handleSaveMembers = () => {
    saveMembersToFirebase();
  };
  return (
    <div>
      {/* <button className="btn btn-primary" onClick={handleSaveMembers}>
        La magia
      </button> */}
      home
    </div>
  );
};

export default Home;
