import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Event } from "./Components/Events/Event";
import { Form_Consumer } from "./Components/FormPage/Form- Consumer/Form_Consumer";
import { Form_Modifier_Producer } from "./Components/FormPage/Form- Modifier_Producer/Form_Modifier_Producer";
import { Evaluations } from "./Components/EvaluationPage/Evaluations";
import { Suggestions } from "./Components/SuggestionsPage/Suggestions";
import MapContainer from "./Components/MapPage/Map";
import { Login } from "./Components/LoginPage/Login";
import { Login_Facebook } from "./oauth/Login";
import { Dashboard } from "./Components/DashboardPage/Dashboard";

function App() {
  const [login, setLogin] = useState(false);
  // const navigate = useNavigate();

  // const handleLogin = () => {
  //   setLogin(true);
  //   navigate("/dashboard"); // navigate to dashboard when the user logs in
  // };
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/" element={<Login_Facebook onLogin={handleLogin} />} /> */}
        <Route path="/" element={<Login_Facebook />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event" element={<Event />} />
        <Route path="/form_consumer" element={<Form_Consumer />} />
        <Route
          path="/form_modifier_producer"
          element={<Form_Modifier_Producer />}
        />
        <Route path="/evaluations" element={<Evaluations />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/map" element={<MapContainer />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
