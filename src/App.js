import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Event } from "./Components//Events/Event";
import { Form_Consumer } from "./Components/FormPage/Form- Consumer/Form_Consumer";
import { Form_Modifier_Producer } from "./Components/FormPage/Form- Modifier_Producer/Form_Modifier_Producer";
import { Evaluations } from "./Components/EvaluationPage/Evaluations";
import { Suggestions } from "./Components/SuggestionsPage/Suggestions";
import MapContainer from "./Components/MapPage/Map";
import { Login } from "./Components/LoginPage/Login";
import { Login_Facebook } from "./oauth/Login";
import { Dashboard } from "./Components/DashboardPage/Dashboard";
import BialikMap from "./Try2/BialikMap";
import MapContainer1 from "./Try3/Ar";
import Form from "./Try2/form";
import Form2 from "./Try2/ProducerForm";
import Print from "./Try2/print";
import ProducerMap from "./Try2/ProducerMap";
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
        <Route path="/a" element={<Form />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Event />} />
        <Route path="/form_consumer" element={<Form_Consumer />} />
        <Route
          path="/form_modifier_producer"
          element={<Form_Modifier_Producer />}
        />
        <Route path="/evaluations" element={<Evaluations />} />
        <Route path="/suggestions" element={<Suggestions />} />
        {/* <Route path="/map" element={<MapContainer />} /> */}
        <Route path="/" element={<BialikMap />} />
        {/* <Route path="/amap" element={<MapContainer1 />} /> */}
        <Route path="/form" element={<Form />} />
        <Route path="/form2" element={<Form2 />} />
        <Route path="/print" element={<Print />} />
        {/* <Route path="/producer" element={<ProducerMap />} /> */}
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
