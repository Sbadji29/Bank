import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { 
  getUsers, 
  deleteUser as deleteUserAPI, 
  switchMultipleUsers,
  deleteMultipleUsers
} from '../services/userService';

export default function DataTable({ filter = '' }) {
  const [rows, setRows] = React.useState([]);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [disabled, setDisabled] = React.useState(true);

React.useEffect(() => {
  const fetchData = async () => {
    try {
      const users = await getUsers();
      const formattedUsers = users.map(u => ({
        id: u._id,
        prenom: u.prenom,
        nom: u.nom,
        email: u.email,
        numero_telephone: u.numero_telephone,
        numero_compte: u.numero_compte,
        statut: u.statut,
        Status: u.statut === 0 ? 'Actif' : 'Bloqué',
      }));

      // 🧠 Récupérer l'utilisateur connecté
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const userId = currentUser?._id;

      // 🧹 Exclure le user connecté
      const filteredUsers = formattedUsers.filter(u => u.id !== userId);

      setRows(filteredUsers);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
    }
  };
  fetchData();
}, []);


  React.useEffect(() => {
    setDisabled(selectedUsers.length === 0);
  }, [selectedUsers]);

  const toggleStatus = async (id) => {
    try {
      await switchMultipleUsers([id]);
      setRows(prev =>
        prev.map(r => {
          if (r.id === id) {
            const newStatut = r.statut === 0 ? 1 : 0;
            return { ...r, statut: newStatut, Status: newStatut === 0 ? 'Actif' : 'Bloqué' };
          }
          return r;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserAPI(id);
      setRows(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMultiple = async () => {
    try {
      const tabUser= Array.from(selectedUsers.ids);
      const res = await deleteMultipleUsers(tabUser);
      alert(res.message);
      setRows(prev => prev.filter(row => !tabUser.includes(row.id)));
      setSelectedUsers([]);
    } catch (err) {
      console.error("Erreur suppression multiple :", err);
    }
  };
  const handleSwitchMultiple = async () => {
    try {
      const tabUser= Array.from(selectedUsers.ids);
      const res = await switchMultipleUsers(tabUser);
      console.log(res.message);
      setRows(prev =>
        prev.map(row => {
          if (tabUser.includes(row.id)) {
            const newStatut = row.statut === 0 ? 1 : 0;
            return { ...row, statut: newStatut, Status: newStatut === 0 ? 'Actif' : 'Bloqué' };
          }
          return row;
        })
      );
      setSelectedUsers([]);
    } catch (err) {
      console.error("Erreur blocage multiple :", err);
    }
  };

  const filteredRows = rows.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  const columns = [
    { field: 'prenom', headerName: 'Prénom', width: 130 },
    { field: 'nom', headerName: 'Nom', width: 130 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'numero_telephone', headerName: 'Téléphone', width: 130 },
    { field: 'numero_compte', headerName: 'Numéro de compte', width: 150 },
    { field: 'Status', headerName: 'Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            variant="contained"
            size="small"
            color={params.row.statut === 0 ? 'warning' : 'success'}
            onClick={() => toggleStatus(params.row.id)}
          >
            {params.row.statut === 0 ? 'Bloquer' : 'Débloquer'}
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => deleteUser(params.row.id)}
          >
            Supprimer
          </Button>
        </div>
      ),
    }
  ];
console.log("Selected IDs:", selectedUsers);
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <div style={{ padding: "10px" }}>
        <Button
          variant="contained"
          color="error"
          disabled={disabled}
          onClick={handleDeleteMultiple}
          style={{ marginRight: "10px" }}
        >
          Supprimer sélection
        </Button>
        <Button
          variant="contained"
          color="warning"
          disabled={disabled}
          onClick={handleSwitchMultiple}
        >
          Bloquer/Débloquer sélection
        </Button>
      </div>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(ids) => setSelectedUsers(ids)}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
