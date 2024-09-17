import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MembersDashboard from "../src/components/membersDashboard/MembersDashboard";
import CreateMembers from "./components/createMembers/CreateMembers";
import UpdateMember from "./components/updateMembers/UpdateMember";
import FindMember from "./components/findMember/FindMember";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MembersDashboard />} />
          <Route path="/createMember" element={<CreateMembers />} />
          <Route path="/edit/:id" element={<UpdateMember />} />
          <Route path="/findMember" element={<FindMember />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
