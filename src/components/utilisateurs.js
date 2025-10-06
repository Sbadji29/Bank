import '../styles/utilisateurs.css';
import GroupIcon from '@mui/icons-material/Group';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import PersonIcon from '@mui/icons-material/Person';
import * as React from 'react';
import { getUserCounts } from '../services/userService'; // service à créer

function Utilisateurs() {
  const [counts, setCounts] = React.useState({
    agents: 0,
    distributeurs: 0,
    clients: 0,
  });

  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await getUserCounts();
        setCounts({
          agents: data.agents,
          distributeurs: data.distributeurs,
          clients: data.clients,
        });
      } catch (err) {
        console.error('Erreur lors de la récupération des comptes :', err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="container" style={{ display: 'flex', gap: '20px' }}>
      <div className="cart">
        <GroupIcon style={{ fontSize: 40, marginBottom: 10 }} />
        <div>Agents</div>
        <div className="number">{counts.agents}</div>
      </div>
      <div className="cart">
        <StoreMallDirectoryIcon style={{ fontSize: 40, marginBottom: 10 }} />
        <div>Distributeurs</div>
        <div className="number">{counts.distributeurs}</div>
      </div>
      <div className="cart">
        <PersonIcon style={{ fontSize: 40, marginBottom: 10 }} />
        <div>Clients</div>
        <div className="number">{counts.clients}</div>
      </div>
    </div>
  );
}

export default Utilisateurs;
