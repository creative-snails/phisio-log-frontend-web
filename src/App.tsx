import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import HealthRecord from "./pages/HealthRecord";
import BodyMap from "./pages/BodyMap";
import Reports from "./pages/Reports";

function App() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  const handleSignIn = () => setUser({ name: "Emmet" });
  const handleSignOut = () => setUser(null);

  return (
    <Router>
      <Layout user={user} onSignIn={handleSignIn} onSignOut={handleSignOut}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health-record" element={<HealthRecord />} />
          <Route path="/body-map" element={<BodyMap />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
