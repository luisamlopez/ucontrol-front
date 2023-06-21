import { Box, Typography, Stack, TextField as Text } from "@mui/material";
import logo from "../assets/Logo.svg";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import PasswordField from "../components/PasswordField";
import { useUser } from "../contexts/authContext";

interface FormValues {
	email: string;
	password: string;
}

const initialValues = {
	email: "",
	password: "",
};

const validationSchema = yup.object().shape({
	email: yup
		.string()
		.required("Ingrese su correo, por favor")
		.email("Ingrese un correo válido, por favor"),
	password: yup
		.string()
		.required("Ingrese su contraseña, por favor")
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const Login = (): JSX.Element => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const { login } = useUser();

	const onSubmit = async (
		values: FormValues,
		actions: FormikHelpers<FormValues>
	) => {
		try {
			actions.setSubmitting(true);
			console.log(login);
			login(values);
			enqueueSnackbar("Inicio de sesión exitoso", { variant: "success" });
			navigate("/dashboard");
		} catch (error) {
			enqueueSnackbar(
				"Hubo un error al iniciar sesión, por favor intente de nuevo.",
				{ variant: "error" }
			);
		} finally {
			actions.setSubmitting(false);
		}
	};
	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			sx={{
				background: "linear-gradient(180deg, #042F3E 0%, #40B4E5 100%);",
				height: "100vh",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					background: "white",
					borderRadius: "8px",
					width: {
						xs: "80%",
						lg: "730px",
					},
					padding: "2rem",
				}}
			>
				<Box
					component="img"
					src={logo}
					alt="logo"
					sx={{
						width: 330,
						m: 0,
					}}
				/>
				<Typography
					variant="h1"
					fontWeight={600}
					color="primary.main"
					fontSize={{ lg: "3rem", xs: "2rem" }}
					textAlign={"center"}
				>
					Inicio de sesión
				</Typography>

				<Typography
					color="primary.main"
					fontWeight={500}
					fontSize={{ lg: "1.5rem", xs: "1rem" }}
					mb={2}
					textAlign={"center"}
				>
					Ingrese sus datos para continuar
				</Typography>

				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={onSubmit}
				>
					{({ isSubmitting }) => (
						<Stack component={Form} spacing={2}>
							<Field
								component={TextField}
								name="email"
								label="Correo UCAB"
								required
							/>

							<Field
								component={PasswordField}
								name="password"
								label="Contraseña"
								required
							/>

							<LoadingButton
								type="submit"
								loading={isSubmitting}
								loadingIndicator="Procesando..."
								variant="contained"
								color="primary"
							>
								Ingresar
							</LoadingButton>

							<Typography align="center">
								<Link to="/forgot-password" style={{ textDecoration: "none" }}>
									<Typography fontWeight="600" color="primary.main">
										Recupere su contraseña
									</Typography>
								</Link>
							</Typography>

							<Typography align="center">
								¿No ha generado su clave de acceso?
								<Link to="/signup" style={{ textDecoration: "none" }}>
									<Typography fontWeight="600" color="primary.main">
										Hágalo aquí
									</Typography>
								</Link>
							</Typography>
						</Stack>
					)}
				</Formik>
			</Box>
		</Box>
	);
};

export default Login;
