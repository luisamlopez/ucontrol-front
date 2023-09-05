import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import DashboardAccordion from "../components/Dashboard/DashboardAccordion";
import { Space, getSpaces } from "../api/Space";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/authContext";

const Home = (): JSX.Element => {
	const { user } = useUser();
	const [spaces, setSpaces] = useState<Space[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [dataLoaded, setDataLoaded] = useState<boolean>(false);

	/**
	 * Get spaces from API but only save spaces with devices
	 */
	useEffect(() => {
		const fetch = async () => {
			try {
				await getSpaces(user?._id!, (allSpaces) => {
					//Get spaces with devices only
					allSpaces = allSpaces.filter(
						(space) => space.devices && space.devices.length > 0
					);

					setSpaces(allSpaces);
					setDataLoaded(true);
				});
				//  console.log(spaces);
			} catch (error) {
				alert(error);
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, []);

	return (
		<>
			<Box display="flex" alignItems="center" justifyContent="left">
				<Sidebar />
				<Container sx={{ m: 0, p: 0 }}>
					<Box
						display={"flex"}
						flexDirection="column"
						sx={{
							p: 2,
						}}
					>
						<Typography
							color="primary"
							textAlign="left"
							fontSize={{ xs: 24, sm: 48, lg: 48 }}
							fontWeight={600}
							p={0}
							mt={{ xs: 6, sm: 0, lg: 0 }}
							mb={2}
						>
							Dashboard
						</Typography>
						{loading ? (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<CircularProgress />
							</Box>
						) : !dataLoaded ? (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<CircularProgress />
							</Box>
						) : spaces.length === 0 ? (
							<Typography
								color="primary"
								textAlign="left"
								fontSize={{ xs: 16, sm: 24, lg: 24 }}
								fontWeight={600}
								p={0}
								mt={{ xs: 6, sm: 0, lg: 0 }}
								mb={2}
							>
								No hay ningún espacio cargado. Por favor, cree uno.
							</Typography>
						) : (
							<DashboardAccordion spaces={spaces} />
						)}
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default Home;
