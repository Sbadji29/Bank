import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { getUsers, createDepot } from '../services/userService';

export default function DepositForm() {
  const [distributeurs, setDistributeurs] = React.useState([]);
  const [selectedDistributeur, setSelectedDistributeur] = React.useState(null);
  const [amount, setAmount] = React.useState('');

  React.useEffect(() => {
    const fetchDistributeurs = async () => {
      const users = await getUsers();
      setDistributeurs(users.filter(u => u.type === "distributeur"));
    };
    fetchDistributeurs();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const idAgent = localStorage.getItem("userId"); 
  console.log("ID AGENT LU:", idAgent);

  if (!idAgent) {
    alert("Erreur: aucun agent connecté !");
    return;
  }

  if (!selectedDistributeur) {
    alert('Veuillez sélectionner un distributeur.');
    return;
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    alert('Veuillez entrer un montant valide.');
    return;
  }

  try {
    await createDepot({
      idEnvoyeur: idAgent,
      idRecepteur: selectedDistributeur._id,
      type_transaction: "depot",
      montant: Number(amount),
    });

    alert(`Dépôt de ${amount} effectué vers ${selectedDistributeur.nom} ${selectedDistributeur.prenom}`);
    setSelectedDistributeur(null);
    setAmount('');
  } catch (err) {
    console.error("ERREUR DEPOT:", err.response?.data || err.message);
    alert("Erreur lors du dépôt.");
  }
};



  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
      <Autocomplete
        options={distributeurs}
        getOptionLabel={(option) => `${option.numero_compte} - ${option.prenom} ${option.nom}`}
        value={selectedDistributeur}
        onChange={(event, newValue) => setSelectedDistributeur(newValue)}
        renderInput={(params) => <TextField {...params} label="Distributeur" variant="outlined" />}
        sx={{ width: 300 }}
      />
      <TextField
        label="Montant"
        variant="outlined"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        sx={{ width: 150 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Envoyer
      </Button>
    </form>
  );
}
