import React, { useState } from "react";
import "./CreationCompte.css";

function CreationCompte() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    dateNaissance: "",
    email: "",
    numero_identite: "",
    adresse: "",
    numero_telephone: "",
    type: "client",
    photo: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dateNaissance) {
      setErrorMessage("La date de naissance est requise");
      setSuccessMessage("");
      return;
    }

    const birthDate = new Date(formData.dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age < 18) {
      setErrorMessage("Vous devez avoir au moins 18 ans");
      setSuccessMessage("");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    data.append("mot_de_passe", "123456");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erreur serveur");

      setErrorMessage("");
      setSuccessMessage("Inscription réussie !");
      setFormData({
        prenom: "",
        nom: "",
        dateNaissance: "",
        email: "",
        numero_identite: "",
        adresse: "",
        numero_telephone: "",
        type: "client",
        photo: null,
      });
    } catch (err) {
      setErrorMessage(err.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="form-container">
      <h1>Créer un compte</h1>
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-row">
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="date"
          name="dateNaissance"
          value={formData.dateNaissance}
          onChange={handleChange}
          required
        />

        <div className="form-row">
          <input
            type="email"
            name="email"
            placeholder="Adresse e-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="numero_identite"
            placeholder="Numéro CNI"
            value={formData.numero_identite}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="adresse"
            placeholder="Adresse"
            value={formData.adresse}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="numero_telephone"
            placeholder="Numéro de téléphone"
            value={formData.numero_telephone}
            onChange={handleChange}
            required
          />
        </div>

        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="distributeur">Distributeur</option>
          <option value="client">Client</option>
          <option value="agent">Agent</option>
        </select>

        <label className="file-upload">
          Choisir une photo
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <button type="submit" className="btn-submit">
          S'inscrire
        </button>

        {errorMessage && <p className="error-msg">{errorMessage}</p>}
        {successMessage && <p className="success-msg">{successMessage}</p>}
      </form>
    </div>
  );
}

export default CreationCompte;
