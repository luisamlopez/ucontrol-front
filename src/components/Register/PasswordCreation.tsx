import {
	Box,
	Typography,
	Stack,
	TextField as Text,
	IconButton,
	Button,
} from "@mui/material";
import logo from "../assets/Logo.svg";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import PasswordField from "../Fields/PasswordField";
import { signUp } from "../../api/User";
import { KeyboardArrowLeftRounded } from "@mui/icons-material";

export interface RecoverValue {
	recover: boolean;
	email: string;
	next: () => void;
	prev: () => void;
}

interface FormValues {
	password: string;
	passwordRepeat: string;
}

const initialValues = {
	password: "",
	passwordRepeat: "",
};

const validationSchema = yup.object().shape({
	password: yup
		.string()
		.required("Ingrese su contraseña, por favor")
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
	passwordRepeat: yup
		.string()
		.required("Ingrese su contraseña, por favor")
		.test("passwordRepeated", "Las contraseñas no coinciden", function (value) {
			return value === this.parent.password;
		}),
});

const PasswordCreation = ({
	recover,
	next,
	email,
	prev,
}: RecoverValue): JSX.Element => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const onSubmit = async (
		values: FormValues,
		actions: FormikHelpers<FormValues>
	) => {
		try {
			//TODO revisar UX
			actions.setSubmitting(true);
			const { password, passwordRepeat } = values;

			if (password === passwordRepeat) {
				const response = await signUp({ email, password });
				if (response.success) {
					enqueueSnackbar(
						"Contraseña creada exitosamente, ya puede ingresar sesión.",
						{
							variant: "success",
						}
					);
					navigate("/login");
				} else {
					enqueueSnackbar(
						"Hubo un problema al crear su contraseña intentelo de nuevo",
						{
							variant: "error",
						}
					);
				}
			} else {
				enqueueSnackbar("Las contraseñas deben coincidir", {
					variant: "error",
				});
			}
		} catch (error) {
			enqueueSnackbar(
				"Hubo un error al procesar su contraseña, por favor intente de nuevo.",
				{ variant: "error" }
			);
		} finally {
			actions.setSubmitting(false);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			{recover ? (
				<Typography
					variant="h1"
					fontWeight={600}
					color="primary.main"
					fontSize={{ lg: "3rem", xs: "2rem" }}
					textAlign={"center"}
				>
					Recuperación de contraseña
				</Typography>
			) : (
				<Typography
					variant="h1"
					fontWeight={600}
					color="primary.main"
					fontSize={{ lg: "3rem", xs: "2rem" }}
					textAlign={"center"}
				>
					Generación de contraseña
				</Typography>
			)}

			<Typography
				color="primary.main"
				fontWeight={500}
				fontSize={{ lg: "1.5rem", xs: "1rem" }}
				mb={2}
				textAlign={"center"}
			>
				Ingrese su contraseña.
			</Typography>

			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ isSubmitting }) => (
					<Stack component={Form} spacing={2} direction={"column"}>
						<Field
							component={PasswordField}
							name="password"
							label="Contraseña"
							required
						/>

						<Field
							component={PasswordField}
							name="passwordRepeat"
							label="Repetir contraseña"
							required
						/>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignContent: "center",
								gap: "1rem",
							}}
						>
							<Button onClick={prev}>Regresar</Button>
							<LoadingButton
								type="submit"
								loading={isSubmitting}
								loadingIndicator="Procesando..."
								variant="contained"
								color="primary"
							>
								Continuar
							</LoadingButton>
						</Box>
					</Stack>
				)}
			</Formik>
		</Box>
	);
};

export default PasswordCreation;
