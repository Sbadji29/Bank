import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import axios from "axios";

export default function LoginPage({ onLogin }) {
  const [identifiant, setIdentifiant] = useState(""); 
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");

  const API_BASE_URL = "https://bankbackend-4.onrender.com/";
  const handleLogin = async () => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { identifiant, mot_de_passe: motDePasse },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Réponse backend :", res.data);

    localStorage.setItem("userId", res.data.user.id || res.data.user._id);
    localStorage.setItem("token", res.data.token);

    console.log("ID AGENT STOCKÉ:", res.data.user.id || res.data.user._id);
    if (onLogin) onLogin(res.data.user);
    setError("");
  } catch (err) {
    console.error("Erreur login :", err.response || err);
    setError(err.response?.data?.message || "Erreur de connexion");
  }
};


  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Connexion
      </Typography>

      <TextField
        label="Numéro de compte ou Téléphone"
        fullWidth
        margin="normal"
        value={identifiant}
        onChange={(e) => setIdentifiant(e.target.value)}
      />

      <TextField
        label="Mot de passe"
        type="password"
        fullWidth
        margin="normal"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
      />

      {error && (
        <Typography color="error" variant="body2" align="center">
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleLogin}
      >
        Se connecter
      </Button>
    </Container>
  );
}
