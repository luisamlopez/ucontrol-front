import {
	Box,
	Typography,
	CircularProgress,
	Button,
	IconButton,
	Stack,
	TextField as TextFieldMUI,
	AutocompleteRenderInputParams,
	Tooltip,
	FormControlLabel,
	Radio,
	FormLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Space, SpaceRoute, getSpaces } from "../../api/Space";
import { AddRounded, DeleteRounded } from "@mui/icons-material";
import { Field, FieldArray, Form, Formik } from "formik";
import * as yup from "yup";
import { Autocomplete, RadioGroup, TextField } from "formik-mui";
import TextAreaField from "../Fields/TextAreaField";
import RadioGroupField from "../Fields/RadioGroupField";
import { Device } from "../../api/Device";
import { get } from "http";

interface SpaceFormProps {
	spaceID?: string;
}

interface FormValues {
	id: string;
	name: string;
	description: string;
	currentRoute?: SpaceRoute[];
	createdBy: string;
	createdOn: string;
}

const initialValues = {
	id: "",
	name: "",
	description: "",
	currentRoute: [],
	createdBy: "",
	createdOn: "",
};

const validationSchema = yup.object().shape({
	name: yup.string().required("Por favor, ingrese un nombre"),
	description: yup.string().required("Por favor, ingrese una descripción"),
	currentRoute: yup.string().required("Por favor, ingrese un tópico/espacio"),
});

const SpaceForm = (props: SpaceFormProps): JSX.Element => {
	const [devices, setDevices] = useState<Device[]>([]);
	const [spaces, setSpaces] = useState<Space[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [dataLoaded, setDataLoaded] = useState<boolean>(false);

	const space = spaces.find((space) => space.id === props.spaceID);

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
		<Box display="flex" justifyContent="left" flexDirection="column">
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
				<Typography>Error: no se pudo cargar el espacio.</Typography>
			) : (
				<Box
					sx={{
						display: "flex",
						justifyContent: "left",
						flexDirection: "column",
						ml: {
							lg: 0,
							md: 5,
							sm: 5,
							xs: 5,
						},
					}}
				>
					{props.spaceID ? <> {props.spaceID} </> : <Add spaces={spaces} />}
				</Box>
			)}
		</Box>
	);
};

export default SpaceForm;

function Add(spaces: { spaces: Space[] }) {
	useEffect(() => {}, []);

	const handleTopicChange = (selectedTopic: SpaceRoute) => {
		const newTopics: SpaceRoute[] = [];
		for (let i = 0; i < spaces.spaces.length; i++) {
			if (spaces.spaces[i].id === selectedTopic.id) {
				for (let j = 0; j < spaces.spaces[i].currentRoute.length; j++) {
					newTopics.push(spaces.spaces[i].currentRoute[j]);
				}
			}
		}
		setTopics(newTopics);
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{({ isSubmitting, touched, errors }) => (
				<Stack component={Form} spacing={2}>
					<Field
						component={TextField}
						name="name"
						type="text"
						label="Nombre"
						variant="outlined"
						fullWidth
					/>
					<Field
						component={TextAreaField}
						name="description"
						type="text"
						label="Descripción"
						variant="outlined"
						fullWidth
					/>

					<FieldArray name="topic">
						{({ push, remove, form }: any) => (
							<>
								<Typography gutterBottom>
									Ingrese el tópico/espacio al que pertenece el dispositivo
								</Typography>

								{form.values.topic.map((_: String, index: number) => (
									<Stack
										key={index}
										direction={"row"}
										spacing={1}
										alignItems={"center"}
									>
										<Field
											name={`topic.${index}`}
											component={Autocomplete}
											options={spaces}
											getOptionLabel={(option: SpaceRoute) =>
												option.label || ""
											}
											renderInput={(params: AutocompleteRenderInputParams) => (
												<TextFieldMUI
													{...params}
													name={`topic.${index}`}
													label="Tópico/Espacio"
													required
													variant="outlined"
													fullWidth
													id="textfieldmui"
													error={
														touched.currentTopic && Boolean(errors.currentTopic)
													}
													helperText={
														touched.currentTopic && errors.currentTopic
													}
												/>
											)}
											style={{ width: "100%" }}
										/>
										{form.values.topic.length > 1 && (
											<Tooltip title="Eliminar" arrow>
												<IconButton
													size="large"
													onClick={() => {
														remove(index);
													}}
												>
													<DeleteRounded />
												</IconButton>
											</Tooltip>
										)}
										{form.values.topic.length === 1 && index === 0 && (
											<Tooltip title="Agregar" arrow>
												<IconButton
													size="large"
													onClick={() => {
														if (
															form.values.topic[0] !== "" &&
															form.values.topic[0] !== undefined &&
															form.values.topic[0] !== null
														) {
															handleTopicChange(form.values.topic[0]);
															push(new String());
														}
													}}
												>
													<AddRounded />
												</IconButton>
											</Tooltip>
										)}
									</Stack>
								))}
							</>
						)}
					</FieldArray>

					<Field
						component={RadioGroup}
						name="spaceType"
						label="Tipo de dispositivo"
					>
						<FormLabel>¿Este espacio pertenece a otro?</FormLabel>
						<Typography>
							Ejemplo:
							<ul>
								<li>Laboratorio pertenece a edificio</li>
								<li>Salón pertenece a piso</li>
								<li>Piso pertenece a módulo</li>
							</ul>
						</Typography>
						<FormControlLabel
							value="tempHum"
							control={<Radio />}
							label="Si"
							onSelect={() => {}}
						/>
						<FormControlLabel
							value="movimiento"
							control={<Radio />}
							label="No"
							onSelect={() => {}}
						/>
					</Field>
				</Stack>
			)}
		</Formik>
	);
}

function Edit(space: { space: Space }) {}

const onSubmit = async (values: Space, { setSubmitting }: any) => {
	await Save(false, values);
	setSubmitting(false);
};

const Save = async (isAdd: boolean, values: Space) => {
	if (isAdd) {
		//  create
	} else {
		// update
	}
};
