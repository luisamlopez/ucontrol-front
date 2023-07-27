import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Device } from "../api/Device";
import { Space, getSpaces } from "../api/Space";
import { Sidebar } from "../components/Sidebar";
import { useParams } from "react-router-dom";
import SpaceDeviceDetails from "../components/Dashboard/SpaceDeviceDetails";

const SpacePage = (): JSX.Element => {
	const [devices, setDevices] = useState<Device[]>([]);
	const [spaces, setSpaces] = useState<Space[]>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [dataLoaded, setDataLoaded] = useState<boolean>(false);

	const { spaceID } = useParams<{ spaceID: string }>();

	useEffect(() => {
		try {
			getSpaces((allSpaces) => {
				setSpaces(allSpaces);
			});
			console.log(spaces);
		} catch (error) {
			alert(error);
		} finally {
			setLoading(false);
		}
	}, []);

	return (
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
						Dispositivos del espacio {spaceID} (buscar en BD)
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
					) : devices.length === 0 ? (
						<Typography>
							Error: no se pudieron cargar los dispositivos.
						</Typography>
					) : (
						<SpaceDeviceDetails devices={devices} />
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default SpacePage;
