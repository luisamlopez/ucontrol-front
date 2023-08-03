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
import {
  Device,
  DeviceValues,
  MetricAndUnit,
  UnitsConfig,
  accessControl,
  airDVT,
  getAllDevicesByUser,
  humidityUnits,
  lightDVT,
  movementDVT,
  temperatureAndHumDVT,
  temperatureUnits,
  vibrationsDVT,
  vibrationsUnits,
  waterFlowDVT,
  waterFlowUnits,
} from "../../api/Device";
import { Space } from "../../api/Space";
import { AddRounded, DeleteRounded } from "@mui/icons-material";
import { Field, FieldArray, Form, Formik } from "formik";
import * as yup from "yup";
import { Autocomplete, RadioGroup, TextField } from "formik-mui";
import TextAreaField from "../Fields/TextAreaField";
import RadioGroupField from "../Fields/RadioGroupField";
import { useUser } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar, useSnackbar } from "notistack";

interface DeviceFormProps {
  deviceID?: string;
}

interface FormValues {
  _id: string;
  name: string;
  description: string;
  dvt: ("line" | "bar" | "pie" | "gauge" | "scatter" | "table" | "value")[];
  createdBy: string;
  createdOn: Date;
  topic: string[];
}

const initialValues = {
  _id: "",
  name: "",
  description: "",
  dvt: ["value"],
  createdBy: "",
  createdOn: new Date(),
  topic: [""],
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Por favor, ingrese un nombre"),
  description: yup.string().required("Por favor, ingrese una descripción"),
  topic: yup.string().required("Por favor, ingrese un tópico/espacio"),
  dvt: yup
    .array()
    .required("Por favor, seleccione al menos un tipo de visualización"),
});

const DeviceForm = (props: DeviceFormProps): JSX.Element => {
  console.log("final devices:");
  const [allDevices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  //  const device = devices.find((device) => device._id === props.deviceID);

  const { user } = useUser();

  // useEffect(() => {
  //   try {
  //     getAllDevicesByUser(user?._id!, (devices) => {
  //       setDevices(devices);
  //       console.log("devices from getAllDevicesByUser:");
  //       console.log(devices);
  //     });
  //     console.log("final devices:");
  //     console.log(allDevices);
  //     setDataLoaded(false);
  //   } catch (error) {
  //     alert(error);
  //   }
  // }, [allDevices, user?._id]);

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
      ) : allDevices.length === 0 ? (
        <Typography>
          No hay dispositivos registrados en tu cuenta, agrega uno.
        </Typography>
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
          {props.deviceID ? <> {props.deviceID} </> : <>add </>}
        </Box>
      )}
    </Box>
  );
};

export default DeviceForm;
