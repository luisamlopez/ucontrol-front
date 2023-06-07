import { Box, Container, Typography } from "@mui/material";
import { Sidebar } from "../components/Sidebar";

const Home = (): JSX.Element => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="left"
      bgcolor={"#F5F5F5"}
    >
      <Sidebar />
      <Container sx={{ m: 0, p: 0 }}>
        <Box display={"flex"} flexDirection="column">
          <Typography
            color="primary"
            textAlign="left"
            fontSize={{ xs: 24, sm: 48, lg: 48 }}
            fontWeight={600}
            p={0}
            mt={{ xs: 10, sm: 0, lg: 0 }}
            mb={5}
          >
            Dashboard
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
