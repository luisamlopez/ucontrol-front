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
  parentSpace?: Space;
  subSpaces?: Space[];
  createdBy: string;
  createdOn: string;
}

const initialValues = {
  id: "",
  name: "",
  description: "",
  subSpaces: [],
  createdBy: "",
  createdOn: "",
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Por favor, ingrese un nombre"),
  description: yup.string().required("Por favor, ingrese una descripción"),
  parentSpace: yup.string().required("Por favor, ingrese un tópico/espacio"),
});

const SpaceForm = (props: SpaceFormProps): JSX.Element => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //const space = spaces.find((space) => space.id === props.spaceID);

  useEffect(() => {
    try {
      getSpaces((allSpaces) => {
        setSpaces(allSpaces);
      });
      console.log(spaces);
      setLoading(false);
    } catch (error) {
      alert(error);
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
  const [spaceType, setSpaceType] = useState(false);
  const [subSpaces, setSubSpaces] = useState<Space[]>([]);
  const [selectedParentSpace, setSelectedParentSpace] = useState<Space | null>(
    null
  );
  const [selectedSubSpace, setSelectedSubSpace] = useState<Space | null>(null);
  const [options, setOptions] = useState<Space[]>(spaces.spaces);

  const handleParentSpaceChange = (selectedSpace: Space | null) => {
    setSelectedParentSpace(selectedSpace);
    setSelectedSubSpace(null);
    if (selectedSpace && selectedSpace.subSpaces) {
      setOptions(selectedSpace.subSpaces);
      setSubSpaces(selectedSpace.subSpaces);
    } else {
      setOptions(spaces.spaces);
      setSubSpaces([]);
    }
  };

  const handleSubSpaceDelete = () => {
    if (selectedSubSpace) {
      setSubSpaces((prevSubSpaces) =>
        prevSubSpaces.filter((subSpace) => subSpace.id !== selectedSubSpace.id)
      );
      setSelectedSubSpace(null);
    }
  };

  useEffect(() => {
    if (selectedParentSpace) {
      setSubSpaces(selectedParentSpace.subSpaces || []);
    } else {
      setSubSpaces([]);
    }
  }, [selectedParentSpace]);

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

          <Field
            component={RadioGroup}
            name="spaceType"
            label="Tipo de dispositivo"
            required
          >
            <FormLabel
              sx={{
                color: "primary.main",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              ¿Este espacio pertenece a otro espacio?
            </FormLabel>
            <Typography>
              Ejemplo: <br />
              Laboratorio pertenece a edificio
              <br /> Salón pertenece a Piso <br />
              Piso pertenece a módulo
            </Typography>
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Si"
              onChange={() => {
                setSpaceType(true);
              }}
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="No"
              onChange={() => {
                setSpaceType(false);
              }}
            />
          </Field>

          {spaceType && (
            <FieldArray name="spaces">
              {({ push, remove, form }: any) => (
                <>
                  <Typography gutterBottom>
                    Ingrese el tópico/espacio al que pertenece el dispositivo
                  </Typography>

                  <Field
                    component={Autocomplete}
                    name="parentSpace"
                    options={spaces.spaces}
                    getOptionLabel={(option: Space) => option.name || ""}
                    value={selectedParentSpace}
                    onChange={(event: any, newValue: Space | null) => {
                      handleParentSpaceChange(newValue);
                    }}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <TextFieldMUI
                        {...params}
                        name="parentSpace"
                        label="Tópico/Espacio"
                        required
                        variant="outlined"
                        fullWidth
                        id="textfieldmui"
                      />
                    )}
                  ></Field>

                  {selectedParentSpace &&
                    selectedParentSpace.subSpaces &&
                    subSpaces.length > 0 && (
                      <Field
                        component={Autocomplete}
                        name="subSpace"
                        options={
                          selectedParentSpace
                            ? selectedParentSpace.subSpaces
                            : subSpaces
                        }
                        //      getOptionLabel={(option: Space) => option.id || ""}
                        value={selectedSubSpace}
                        onChange={(event: any, newValue: Space | null) => {
                          setSelectedSubSpace(newValue);
                        }}
                        renderInput={(
                          params: AutocompleteRenderInputParams
                        ) => (
                          <TextFieldMUI
                            {...params}
                            name="subSpace"
                            label="Subespacio"
                            variant="outlined"
                            fullWidth
                            id="textfieldmui"
                          />
                        )}
                      ></Field>
                    )}

                  {subSpaces.length === 0 && (
                    <Typography gutterBottom>No hay subespacios</Typography>
                  )}
                </>
              )}
            </FieldArray>
          )}
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

// {/* <FieldArray name="space">
//   {({ push, remove, form }: any) => (
//     <>
//       <Typography gutterBottom>
//         Ingrese el tópico/espacio al que pertenece el dispositivo
//       </Typography>

//       {/* {form.values.space.map((_: String, index: number) => (
//                   <Stack
//                     key={index}
//                     direction={"row"}
//                     spacing={1}
//                     alignItems={"center"}
//                   >
//                     <Field
//                       name={`space.${index}`}
//                       component={Autocomplete}
//                       options={spaces}
//                       getOptionLabel={(option: SpaceRoute) =>
//                         option.label || ""
//                       }
//                       renderInput={(params: AutocompleteRenderInputParams) => (
//                         <TextFieldMUI
//                           {...params}
//                           name={`space.${index}`}
//                           label="Tópico/Espacio"
//                           required
//                           variant="outlined"
//                           fullWidth
//                           id="textfieldmui"
//                           // error={
//                           // 	touched.currentSpace && Boolean(errors.currentSpace)
//                           // }
//                           // helperText={
//                           // 	touched.currentSpace && errors.currentSpace
//                           // }
//                         />
//                       )}
//                       style={{ width: "100%" }}
//                     />
//                     {form.values.space.length > 1 && (
//                       <Tooltip title="Eliminar" arrow>
//                         <IconButton
//                           size="large"
//                           onClick={() => {
//                             remove(index);
//                           }}
//                         >
//                           <DeleteRounded />
//                         </IconButton>
//                       </Tooltip>
//                     )}
//                     {form.values.space.length === 1 && index === 0 && (
//                       <Tooltip title="Agregar" arrow>
//                         <IconButton
//                           size="large"
//                           onClick={() => {
//                             if (
//                               form.values.space[0] !== "" &&
//                               form.values.space[0] !== undefined &&
//                               form.values.space[0] !== null
//                             ) {
//                               handleSpaceChange(form.values.space[0]);
//                               push(new String());
//                             }
//                           }}
//                         >
//                           <AddRounded />
//                         </IconButton>
//                       </Tooltip>
//                     )}
//                   </Stack>
//                 ))} */}
//     </>
//   )}
// </FieldArray>; */}
