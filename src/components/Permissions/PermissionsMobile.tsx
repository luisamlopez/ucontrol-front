import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { PermissionInfo, deletePermission } from "../../api/Permissions";
import {
  DeleteRounded,
  EditRounded,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Device } from "../../api/Device";

interface PermissionsMobileProps {
  data: PermissionInfo;
}

const PermissionsMobile = ({ data }: PermissionsMobileProps): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

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
    <>
      <Accordion
        expanded={expanded === data.id}
        onChange={handleChange(data.id!)}
        sx={{ mr: 1 }}
      >
        <AccordionSummary
          expandIcon={<KeyboardArrowDownRounded />}
          id={`${data.id}-header`}
        >
          <Typography
            sx={{
              width: "33%",
              flexShrink: 0,
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            Usuario: {data.userName}
          </Typography>

          <Typography
            sx={{
              width: "33%",
              flexShrink: 0,
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            Espacio: {data.spaceName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                width: "33%",
                flexShrink: 0,
                color: "primary.main",
                fontWeight: "bold",
              }}
            >
              Correo: {data.userEmail}
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "end",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <IconButton
                color="error"
                onClick={() => {
                  handleDelete(data.id);
                }}
              >
                <DeleteRounded />
              </IconButton>
              {/* <IconButton
              color="secondary"
              onClick={() => {
                handleEdit(data.id);
              }}
            >
              <EditRounded />
            </IconButton> */}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default PermissionsMobile;
