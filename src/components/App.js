import React, { useState, useEffect } from "react";
import axios from "axios";
import PrimarySearchAppBar from "./dashboard";
import LoginPage from "./LoginPage";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // récupérer les infos de l'utilisateur connecté
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCurrentUser(res.data.user))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  return (
    <>
      {currentUser ? (
        <PrimarySearchAppBar
          user={currentUser}
          setUser={setCurrentUser}
          onLogout={() => {
            localStorage.removeItem("token");
            setCurrentUser(null);
          }}
        />
      ) : (
        <LoginPage onLogin={(u) => setCurrentUser(u)} />
      )}
    </>
  );
}
