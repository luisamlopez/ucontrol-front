import { Box, Container, Typography } from "@mui/material";
import { Sidebar } from "../components/Sidebar";

const History = (): JSX.Element => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Sidebar />
      <Container>
        <Box display={"flex"} flexDirection="column">
          <Typography
            color="primary"
            textAlign="left"
            fontSize={{ xs: 24, lg: 48 }}
            fontWeight={600}
            mt={{ xs: 10, sm: 0, lg: 0 }}
            mb={{ xs: 5, sm: 0, lg: 0 }}
            ml={{ xs: -10, sm: -10, lg: -10 }}
          >
            Historial
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default History;
