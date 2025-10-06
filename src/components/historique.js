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

const columns = [
  { id: "idTransaction", label: "ID Transaction", minWidth: 100 },
  { id: "CompteEnvoyeur", label: "Compte Envoyeur", minWidth: 120 },
  { id: "CompteRecepteur", label: "Compte Recepteur", minWidth: 120 },
  { id: "Somme", label: "Somme", minWidth: 100 },
  { id: "Heure", label: "Heure", minWidth: 150 },
  { id: "Statut", label: "Statut", minWidth: 120 },
];

export default function TableHistorique({ filter = "" }) {
  const [history, setHistory] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions");
      const formatted = res.data.map((t) => ({
        idTransaction: t._id,
        CompteEnvoyeur: t.idEnvoyeur?.numero_compte || "N/A",
        CompteRecepteur: t.idRecepteur?.numero_compte || "N/A",
        Somme: t.montant,
        Heure: new Date(t.dateOperation).toLocaleString(),
        Statut: t.statut === "validee" ? "Validée" : "Annulée",
      }));
      setHistory(formatted);
    } catch (err) {
      console.error("Erreur récupération transactions :", err.response?.data || err.message);
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

  const filteredHistory = history.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  React.useEffect(() => setPage(0), [filter]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="historique table">
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
            {filteredHistory
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.idTransaction}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ color: column.id === "Statut" && row.Statut === "Annulée" ? "red" : column.id === "Statut" ? "green" : "inherit" }}
                    >
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20]}
        component="div"
        count={filteredHistory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
