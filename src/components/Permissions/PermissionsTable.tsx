import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { PermissionInfo, deletePermission } from "../../api/Permissions";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { useSnackbar } from "notistack";

interface PermissionsTableProps {
  data: PermissionInfo[];
}

const PermissionsTable = ({ data }: PermissionsTableProps): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async (id: string) => {
    try {
      const response = await deletePermission(id);

      if (response) {
        enqueueSnackbar("Permiso eliminado", { variant: "success" });
        window.location.reload();
      } else {
        enqueueSnackbar("Error al eliminar el permiso ", { variant: "error" });
      }
    } catch (error) {}
  };

  const handleEdit = async (id: string) => {};
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Espacio</TableCell>
            <TableCell>Permiso</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.userName}</TableCell>
              <TableCell>{row.userEmail}</TableCell>
              <TableCell>{row.spaceName}</TableCell>
              <TableCell>
                {row.type === "readWrite" ? "Lectura y Escritura" : "Escritura"}
              </TableCell>
              <TableCell>
                <IconButton
                  color="error"
                  onClick={() => {
                    handleDelete(row.id);
                  }}
                >
                  <DeleteRounded />
                </IconButton>

                {/* <IconButton
                  color="secondary"
                  onClick={() => {
                    handleEdit(row.id);
                  }}
                >
                  <EditRounded />
                </IconButton> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PermissionsTable;
