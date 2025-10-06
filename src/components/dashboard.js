import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import UndoIcon from '@mui/icons-material/Undo';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Tes composants internes
import Utilisateurs from './utilisateurs';
import UsersContent from './UsersContent';
import DepositForm from './depot';
import TableAnnuler from './annuler';
import TableHistorique from './historique';
import CreationCompte from './compte/creationCompte'
import PersonAddIcon from '@mui/icons-material/PersonAdd'; 

const drawerWidth = 200;

export default function PrimarySearchAppBar({ user, setUser, onLogout }) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeContent, setActiveContent] = React.useState('users');

  // États pour gestion du profil
  const [openProfile, setOpenProfile] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState(user);

  React.useEffect(() => {
    setEditedUser(user); // Met à jour quand user change
  }, [user]);

  // Toggle Drawer
  const toggleDrawer = () => setOpen(!open);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Voir profil
  const handleViewProfile = () => {
    setEditMode(false);
    setEditedUser(user);
    setOpenProfile(true);
    handleClose();
  };

  // Modifier profil
  const handleEditProfile = () => {
    setEditMode(true);
    setEditedUser(user);
    setOpenProfile(true);
    handleClose();
  };

  // Sauvegarder modification
  const handleSaveProfile = async () => {
  try {
    // Construire l'objet avec les champs à mettre à jour
    const updateData = {
      prenom: editedUser.prenom,
      nom: editedUser.nom,
      email: editedUser.email,
      numero_telephone: editedUser.numero_telephone,
    };

    if (editedUser.newPassword) {
      updateData.mot_de_passe = editedUser.newPassword;
    }

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/utilisateurs/${editedUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Erreur lors de la mise à jour");
    
    alert("Profil mis à jour avec succès");

    setOpenProfile(false);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};



  // Déconnexion
  const handleLogout = () => {
    onLogout(); // Met à null le user dans App.jsx
    localStorage.removeItem("token"); // Supprime token
  };

  // Déconnexion automatique après 3 minutes d'inactivité
  React.useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, 2 * 60 * 1000); // 2 minutes
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // démarre le timer au montage

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'blueviolet',
          transition: 'margin 0.3s ease, width 0.3s ease',
          width: `calc(100% - ${open ? drawerWidth : 60}px)`,
          ml: `${open ? drawerWidth : 60}px`,
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mini Bank
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <div>
            <IconButton size="large" edge="end" color="inherit" onClick={handleMenu}>
              <Avatar
                alt={user.prenom}
                src={
                  user.photo 
                    ? `http://localhost:5000/${user.photo.replace(/\\/g, "/")}` 
                    : undefined
                }
              >
                {!user.photo && `${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}`}
              </Avatar>



            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleViewProfile}>Voir profil</MenuItem>
            <MenuItem onClick={handleEditProfile}>Modifier profil</MenuItem>
            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
          </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            transition: 'width 0.3s ease',
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'hidden' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveContent('users')} selected={activeContent === 'users'}        >
        <ListItemIcon><PersonIcon /></ListItemIcon>
        {open && <ListItemText primary="Utilisateur" />}
              </ListItemButton>
            </ListItem>
              
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveContent('addUser')} selected={activeContent ===         'addUser'}>
                <ListItemIcon><PersonAddIcon /></ListItemIcon>
                {open && <ListItemText primary="Ajouter utilisateur" />}
              </ListItemButton>
            </ListItem>
              
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveContent('deposit')} selected={activeContent ===         'deposit'}>
                <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
                {open && <ListItemText primary="Dépôt" />}
              </ListItemButton>
            </ListItem>
              
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveContent('cancel')} selected={activeContent ===        'cancel'}>
                <ListItemIcon><UndoIcon /></ListItemIcon>
                {open && <ListItemText primary="Annuler" />}
              </ListItemButton>
            </ListItem>
              
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveContent('history')} selected={activeContent ===         'history'}>
                <ListItemIcon><HistoryIcon /></ListItemIcon>
                {open && <ListItemText primary="Historique" />}
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Contenu dynamique */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'margin 0.3s ease',
          ml: `${open ? drawerWidth : 60}px`,
        }}
      >
        <Toolbar />
        <Typography paragraph>
          <Utilisateurs />
          {activeContent === 'users' && <UsersContent />}
          {activeContent === 'addUser' && <CreationCompte />}
          {activeContent === 'deposit' && <DepositForm />}
          {activeContent === 'cancel' && <TableAnnuler />}
          {activeContent === 'history' && <TableHistorique />}
        </Typography>
      </Box>

      {/* Dialog Profil */}
      <Dialog open={openProfile} onClose={() => setOpenProfile(false)} fullWidth maxWidth="sm">
  <DialogTitle>{editMode ? 'Modifier le profil' : 'Profil utilisateur'}</DialogTitle>
  <DialogContent dividers>
    <Box display="flex" flexDirection="column" gap={2} mt={1}>
      {/* Avatar */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
  {/* Avatar avec possibilité de changer la photo */}
  <Avatar
    src={
      editedUser.newPhoto
        ? URL.createObjectURL(editedUser.newPhoto)
        : editedUser.photo
        ? `http://localhost:5000/${editedUser.photo.replace(/\\/g, "/")}`
        : undefined
    }
    alt={editedUser.prenom}
    sx={{ width: 80, height: 80 }}
  >
    {!editedUser.photo && !editedUser.newPhoto &&
      `${editedUser.prenom?.charAt(0)}${editedUser.nom?.charAt(0)}`}
  </Avatar>

  <Button variant="outlined" component="label" disabled={!editMode}>
    Changer photo
    <input
      type="file"
      hidden
      accept="image/*"
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          setEditedUser({ ...editedUser, newPhoto: e.target.files[0] });
        }
      }}
    />
  </Button>
</Box>


      {/* Champs classiques */}
      <TextField
        label="Prénom"
        value={editedUser.prenom}
        onChange={(e) => setEditedUser({ ...editedUser, prenom: e.target.value })}
        InputProps={{ readOnly: !editMode }}
      />
      <TextField
        label="Nom"
        value={editedUser.nom}
        onChange={(e) => setEditedUser({ ...editedUser, nom: e.target.value })}
        InputProps={{ readOnly: !editMode }}
      />
      <TextField
        label="Email"
        value={editedUser.email}
        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
        InputProps={{ readOnly: !editMode }}
      />
      <TextField
        label="Téléphone"
        value={editedUser.numero_telephone}
        onChange={(e) => setEditedUser({ ...editedUser, numero_telephone: e.target.value })}
        InputProps={{ readOnly: !editMode }}
      />
      <TextField
        label="Numéro de compte"
        value={editedUser.numero_compte}
      />
      <TextField
        label="Nouveau mot de passe"
        type="password"
        value={editedUser.newPassword || ""}
        onChange={(e) => setEditedUser({ ...editedUser, newPassword: e.target.value })}
        InputProps={{ readOnly: !editMode }}
      />

    </Box>
  </DialogContent>
  <DialogActions>
    {editMode && (
      <Button onClick={handleSaveProfile} variant="contained">Sauvegarder</Button>
    )}
    <Button onClick={() => setOpenProfile(false)} color="error">Fermer</Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}
