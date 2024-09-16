import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MembersDashboard from "../src/components/membersDashboard/MembersDashboard";
import CreateMembers from "./components/createMembers/CreateMembers";
import UpdateMember from "./components/updateMembers/UpdateMember";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MembersDashboard />} />
          <Route path="/createMember" element={<CreateMembers />} />
          <Route path="/edit/:id" element={<UpdateMember />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
