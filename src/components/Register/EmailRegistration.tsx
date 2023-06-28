import {
	Box,
	Typography,
	Stack,
	TextField as Text,
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
import { useUser } from "../../contexts/authContext";
import { sendCode } from "../../api/User";

export interface Props {
	next: () => void;
	prev: () => void;
	handleEmail: (email: string) => void;
	handleCode: (code: string) => void;
}

interface FormValues {
	email: string;
}

const initialValues = {
	email: "",
};

const validationSchema = yup.object().shape({
	email: yup
		.string()
		.required("Ingrese su correo, por favor")
		.email("Ingrese un correo válido, por favor"),
});

const EmailRegistration = ({
	next,
	prev,
	handleEmail,
	handleCode,
}: Props): JSX.Element => {
	const { enqueueSnackbar } = useSnackbar();

	const onSubmit = async (
		values: FormValues,
		actions: FormikHelpers<FormValues>
	) => {
		try {
			//TODO revisar UX
			actions.setSubmitting(true);
			const { email } = values;
			handleEmail(email);
			const response = await sendCode(email);
			if (response.success) {
				handleCode(response.code);
				enqueueSnackbar(
					"Código de verificación enviado, revise su correo UCAB.",
					{ variant: "success" }
				);
				next();
			} else {
				enqueueSnackbar(response.message, { variant: "error" });
			}
		} catch (error) {
			enqueueSnackbar(
				"Hubo un error al enviar su código, por favor intente de nuevo o verifique que el correo sea el indicado.",
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
			<Typography
				variant="h1"
				fontWeight={600}
				color="primary.main"
				fontSize={{ lg: "3rem", xs: "2rem" }}
				textAlign={"center"}
			>
				Generación de contraseña
			</Typography>

			<Typography
				color="primary.main"
				fontWeight={500}
				fontSize={{ lg: "1.5rem", xs: "1rem" }}
				mb={2}
				textAlign={"center"}
			>
				Ingrese su correo UCAB para recibir el código de verificación y así
				poder crear su nueva contraseña.
			</Typography>

			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ isSubmitting }) => (
					<Stack component={Form} spacing={2} direction={"column"}>
						<Field
							component={TextField}
							name="email"
							label="Correo UCAB"
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
								Enviar código de acceso
							</LoadingButton>
						</Box>
					</Stack>
				)}
			</Formik>
		</Box>
	);
};

export default EmailRegistration;
