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
import { useState, useEffect, useRef } from "react";
import { Space, SpaceRoute, createSpace, getSpaces } from "../../api/Space";
import { AddRounded, DeleteRounded } from "@mui/icons-material";
import { Field, FieldArray, Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { Autocomplete, RadioGroup, TextField } from "formik-mui";
import TextAreaField from "../Fields/TextAreaField";
import RadioGroupField from "../Fields/RadioGroupField";
import { Device } from "../../api/Device";
import { get } from "http";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useUser } from "../../contexts/authContext";

interface SpaceFormProps {
  spaceID?: string;
}

interface FormValues {
  _id: string;
  name: string;
  description: string;
  parentSpace?: Space;
  subSpaces?: Space[];
  createdBy: string;
  createdOn: string;
}

const initialValues = {
  _id: "",
  name: "",
  description: "",
  subSpaces: [],
  createdBy: "",
  createdOn: "",
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Por favor, ingrese un nombre"),
  description: yup.string(),
  parentSpace: yup.string(),
});

const SpaceForm = (props: SpaceFormProps): JSX.Element => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [spaceType, setSpaceType] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | undefined>({
    _id: "",
    name: "",
    description: "",
    subSpaces: [],
    createdBy: "",
    createdOn: "",
  });
  const [spaceToEdit, setSpaceToEdit] = useState<Space | undefined>(undefined); // Space to edit, if any

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useUser();

  const routeRef = useRef<string>(""); // Create a ref to store the route value

  /**
   * @description Get the information of a space given its id
   * @param id
   * @returns Space
   */
  const getSpaceInfo = (_id: string) => {
    let space: Space | undefined;
    for (let i = 0; i < spaces.length; i++) {
      if (spaces[i]._id === _id) {
        space = spaces[i];

        break;
      }
    }
    return space;
  };

  /**
   * @description Recursive function to find the "route" of the space, i.e. the parent spaces that it belongs to, if any (e.g. a room belongs to a floor, which belongs to a building, etc.)
   * @param space The space to find the route of
   */
  const findRoute = (space: Space): Space[] => {
    let route: Space[] = [];
    let currentSpace: Space | undefined = space;

    while (currentSpace) {
      route.unshift(currentSpace); // Add current space to the beginning of the route array
      const parentSpaceId = currentSpace.parentSpace;

      if (parentSpaceId) {
        // Find the parent space based on its ID
        const parentSpace = getSpaceInfo(parentSpaceId);

        if (parentSpace) {
          currentSpace = parentSpace;
        } else {
          // If parent space is not found, stop the loop
          currentSpace = undefined;
          console.error(`Parent space with ID ${parentSpaceId} not found.`);
        }
      } else {
        // If there is no parent space, stop the loop
        currentSpace = undefined;
      }
    }

    return route;
  };

  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      const spaceData: Space = {
        name: values.name,
        description: values.description,
        parentSpace: selectedSpace?._id,
        createdBy: user?._id!,
        createdOn: new Date().toISOString(),
      };
      console.log(spaceData);

      if (await createSpace(spaceData)) {
        if (props.spaceID) {
          enqueueSnackbar("Espacio editado con éxito", { variant: "success" });
        } else {
          enqueueSnackbar("Espacio creado con éxito", { variant: "success" });
        }
      } else {
        enqueueSnackbar("Hubo un error", { variant: "error" });
      }

      actions.setSubmitting(true);
    } catch (error) {
      //enqueueSnackbar("Hubo un error", { variant: "error" });
    } finally {
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedSpace) {
      const route = findRoute(selectedSpace)
        .map((space) => space.name)
        .join(" / ");
      routeRef.current = route; // Update the ref with the new route value
    }
  }, [selectedSpace]);

  useEffect(() => {
    try {
      getSpaces((allSpaces) => {
        setSpaces(allSpaces);
      });
      // console.log(spaces);
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  }, []);

  useEffect(() => {
    if (props.spaceID) {
      setSpaceToEdit(getSpaceInfo(props.spaceID));
    }
  }, [spaces]);

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
          {/* {props.spaceID ? <> {props.spaceID} </> : <>
    
          </>} */}
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
                  {...(props.spaceID && { value: spaceToEdit?.name })}
                />
                <Field
                  component={TextAreaField}
                  name="description"
                  type="text"
                  label="Descripción"
                  variant="outlined"
                  fullWidth
                  {...(props.spaceID && {
                    value: spaceToEdit?.description
                      ? spaceToEdit?.description
                      : "",
                  })}
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
                    value={
                      !props.spaceID
                        ? true
                        : spaceToEdit?.parentSpace
                        ? true
                        : false
                    }
                    control={<Radio />}
                    label="Si"
                    onChange={() => {
                      setSpaceType(true);
                    }}
                  />
                  <FormControlLabel
                    value={
                      !props.spaceID
                        ? false
                        : !spaceToEdit?.parentSpace
                        ? false
                        : true
                    }
                    control={<Radio />}
                    label="No"
                    onChange={() => {
                      setSpaceType(false);
                    }}
                  />
                </Field>
                {spaceType && (
                  <>
                    <Typography gutterBottom>
                      Ingrese el tópico/espacio al que pertenece el dispositivo
                    </Typography>

                    <Field
                      component={Autocomplete}
                      name="parentSpace"
                      options={spaces}
                      getOptionLabel={(option: Space) => option.name || ""}
                      value={
                        props.spaceID
                          ? getSpaceInfo(
                              spaceToEdit?.parentSpace
                                ? spaceToEdit.parentSpace
                                : spaceToEdit?._id!
                            )
                          : selectedSpace
                      }
                      onChange={(event: any, newValue: Space) => {
                        setSelectedSpace(newValue);
                        console.log(findRoute(newValue));
                      }}
                      renderInput={(params: AutocompleteRenderInputParams) => (
                        <TextFieldMUI
                          {...params}
                          label="Espacio/Tópico"
                          variant="outlined"
                          fullWidth
                          autoComplete="on"
                          required
                          error={touched.parentSpace && !!errors.parentSpace}
                          helperText={
                            touched.parentSpace && errors.parentSpace
                              ? errors.parentSpace
                              : ""
                          }
                          sx={{
                            my: 2,
                          }}
                        />
                      )}
                    />
                    {routeRef && (
                      <>
                        <Typography
                          sx={{
                            fontStyle: "italic",
                            fontSize: "14px",
                          }}
                        >
                          Ruta del espacio seleccionado:
                        </Typography>
                        <Typography
                          sx={{
                            fontStyle: "italic",
                            fontSize: "14px",
                            my: 2,
                          }}
                        >
                          {routeRef.current}
                        </Typography>
                      </>
                    )}
                  </>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    placeSelf: "flex-end",
                    width: "50%",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/spaces");
                    }}
                    sx={{
                      mt: 2,
                      mr: 2,
                    }}
                  >
                    Cancelar
                  </Button>
                  <LoadingButton
                    sx={{
                      mt: 2,
                    }}
                    type="submit"
                    loading={isSubmitting}
                    loadingIndicator="Procesando..."
                    variant="contained"
                    color="primary"
                  >
                    Guardar
                  </LoadingButton>
                </Box>
              </Stack>
            )}
          </Formik>
        </Box>
      )}
    </Box>
  );
};

export default SpaceForm;
