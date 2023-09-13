import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
  TextField as TextFieldMUI,
  AutocompleteRenderInputParams,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  Space,
  createSpace,
  createSubSpace,
  getSpaceById,
  getSpaces,
  updateSpace,
} from "../../api/Space";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { Autocomplete, RadioGroup, TextField } from "formik-mui";
import TextAreaField from "../Fields/TextAreaField";
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
  parentSpace?: string;
  subSpaces?: string[];
  createdBy: string;
  createdOn: Date;
}

const initialValues = {
  _id: "",
  name: "",
  description: "",
  subSpaces: [],
  createdBy: "",
  createdOn: new Date(),
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Por favor, ingrese un nombre"),
  description: yup.string(),
  parentSpace: yup.string(),
});

const SpaceForm = (props: SpaceFormProps): JSX.Element => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(true);

  const [spaceType, setSpaceType] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | undefined>({
    _id: "",
    name: "",
    description: "",
    subSpaces: [],
    createdBy: "",
    createdOn: new Date(),
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
      if (!spaceType) {
        const spaceData: Space = {
          name: values.name,
          description: values.description,
          createdBy: user?._id!,
        };
        console.log(spaceData);
        const response = await createSpace(spaceData, user?._id!);
        console.log(response);
        if (response) {
          if (props.spaceID) {
            enqueueSnackbar("Espacio editado con éxito", {
              variant: "success",
            });
            navigate("/spaces");
          } else {
            enqueueSnackbar("Espacio creado con éxito", { variant: "success" });
            navigate("/spaces");
          }
        } else {
          enqueueSnackbar("Hubo un error", { variant: "error" });
        }

        actions.setSubmitting(true);
      } else {
        const spaceData: Space = {
          name: values.name,
          description: values.description,
          parentSpace: values.parentSpace!,
          createdBy: user?._id!,
        };

        const response = await createSubSpace(spaceData, selectedSpace?._id!);

        if (response) {
          if (props.spaceID) {
            enqueueSnackbar("Espacio editado con éxito", {
              variant: "success",
            });
            navigate("/spaces");
          } else {
            enqueueSnackbar("Espacio creado con éxito", {
              variant: "success",
            });
            navigate("/spaces");
          }
        } else {
          enqueueSnackbar("Hubo un error", { variant: "error" });
        }

        actions.setSubmitting(true);
      }
    } catch (error) {
      enqueueSnackbar("Hubo un error", { variant: "error" });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const onEdit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const field: string[] = [];
    if (values.name !== spaceToEdit?.name) {
      field.push(
        "Cambio de nombre: " + spaceToEdit?.name + " -> " + values.name
      );
    }
    if (values.description !== spaceToEdit?.description) {
      field.push(
        "Cambio en la descripción: " +
          spaceToEdit?.description +
          " -> " +
          values.description
      );
    }
    const spaceUpdate: Space = {
      name: values.name,
      description: values.description,
      createdBy: values.createdBy,
    };
    try {
      const response = await updateSpace(
        field,
        props.spaceID!,
        user?.name!,
        spaceUpdate
      );
      if (response) {
        enqueueSnackbar("Espacio editado con éxito", {
          variant: "success",
        });
        navigate("/spaces");
      } else {
        enqueueSnackbar("Hubo un error", { variant: "error" });
      }

      actions.setSubmitting(true);
    } catch (error) {
      console.log(error);
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
  }, [findRoute, selectedSpace]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSpaces(user?._id!, (allSpaces) => {
          setSpaces(allSpaces);
          // console.log(allSpaces);
        });
        // console.log(spaces);
        setDataLoaded(false);
      } catch (error) {}
    };
    fetchData();

    if (props.spaceID && spaceToEdit) setDataLoaded(false);
  }, [props.spaceID, spaceToEdit, user?._id]);

  useEffect(() => {
    const fetchData = async () => {
      if (props.spaceID) {
        try {
          getSpaceById(props.spaceID, (space) => {
            setSpaceToEdit(space);
          });
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [props.spaceID]);

  const initialFormValues: FormValues = props.spaceID
    ? {
        _id: spaceToEdit?._id!,
        name: spaceToEdit?.name!,
        description: spaceToEdit?.description!,
        // parentSpace: spaceToEdit?.parentSpace ? spaceToEdit?.parentSpace : "",
        subSpaces: spaceToEdit?.subSpaces ? spaceToEdit?.subSpaces : [],
        createdBy: spaceToEdit?.createdBy!,
        createdOn: spaceToEdit?.createdOn!,
      }
    : initialValues;

  return (
    <Box display="flex" justifyContent="left" flexDirection="column">
      {dataLoaded ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
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
          {props.spaceID && !spaceToEdit ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              onSubmit={props.spaceID ? onEdit : onSubmit}
            >
              {({ isSubmitting, touched, errors, values }) => (
                <Stack component={Form} spacing={2}>
                  <Field
                    component={TextField}
                    name="name"
                    type="text"
                    label="Nombre"
                    variant="outlined"
                    fullWidth
                    value={values.name}
                  />
                  <Field
                    component={TextAreaField}
                    name="description"
                    type="text"
                    label="Descripción"
                    variant="outlined"
                    fullWidth
                    value={values.description}
                  />
                  {!props.spaceID && (
                    <Field
                      component={RadioGroup}
                      name="spaceType"
                      label="Tipo de espacio"
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
                  )}

                  {spaceType && (
                    <>
                      <Typography gutterBottom>
                        Ingrese el tópico/espacio al que pertenece el subespacio
                      </Typography>

                      <Field
                        component={Autocomplete}
                        name="parentSpace"
                        options={spaces}
                        getOptionLabel={(option: Space) => option.name || ""}
                        onChange={(event: any, newValue: Space) => {
                          setSelectedSpace(newValue);
                        }}
                        required
                        renderInput={(
                          params: AutocompleteRenderInputParams
                        ) => (
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
          )}
        </Box>
      )}
    </Box>
  );
};

export default SpaceForm;
