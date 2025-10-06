import * as React from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

const columns = [
  { id: "idTransaction", label: "ID Transaction", minWidth: 100 },
  { id: "CompteEnvoyeur", label: "Compte Envoyeur", minWidth: 120 },
  { id: "CompteRecepteur", label: "Compte Recepteur", minWidth: 120 },
  { id: "Somme", label: "Somme", minWidth: 100 },
  { id: "Heure", label: "Heure", minWidth: 150 },
  { id: "Statut", label: "Statut", minWidth: 100 },
  { id: "Actions", label: "Actions", minWidth: 150 },
];

export default function TableHistoriqueTransfert({ filter = "" }) {
  const [transactions, setTransactions] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchTransactions = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL;
       
      const res = await axios.get(`${API_BASE_URL}/auth/transactions`);
      const formatted = res.data.map((t) => ({
        idTransaction: t._id,
        CompteEnvoyeur: t.idEnvoyeur?.numero_compte || "N/A",
        CompteRecepteur: t.idRecepteur?.numero_compte || "N/A",
        Somme: t.montant,
        Heure: new Date(t.dateOperation).toLocaleString(),
        statut: t.statut,
        type_transaction: t.type_transaction,
      }));
      setTransactions(formatted);
    } catch (err) {
      console.error("Erreur récupération transactions :", err.response?.data || err.message);
    }
  };

  const handleAnnuler = async (idTransaction) => {
    if (window.confirm("Voulez-vous vraiment annuler cette transaction ?")) {
      try {
          const API_BASE_URL = process.env.REACT_APP_API_URL;
        await axios.patch(`${API_BASE_URL}/transactions/depot/annuler/${idTransaction}`);
        alert("Transaction annulée avec succès");
        fetchTransactions(); 
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert("Erreur lors de l'annulation de la transaction");
      }
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredTransactions = transactions.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  React.useEffect(() => {
    setPage(0);
  }, [filter]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="transactions table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{ fontWeight: "bold" }}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.idTransaction}>
                  {columns.map((column) => {
                    if (column.id === "Actions") {
                      return (
                        <TableCell key={column.id}>
                          {row.statut === "validee" ? (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleAnnuler(row.idTransaction)}
                            >
                              Annuler
                            </Button>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      );
                    } else if (column.id === "Statut") {
                      return (
                        <TableCell key={column.id} style={{ color: row.statut === "annulee" ? "red" : "green" }}>
                          {row.statut}
                        </TableCell>
                      );
                    } else {
                      return <TableCell key={column.id}>{row[column.id]}</TableCell>;
                    }
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
