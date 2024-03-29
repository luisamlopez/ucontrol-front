import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Device, getDeviceById } from "../../api/Device";
import { Space } from "../../api/Space";
import { useEffect, useState } from "react";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";

export interface AccordionProps {
  spaces: Space[];
}

interface Data {
  spaceId: string;
  spaceName: string;
  devices: Device[];
}

function DevicesDetails({ devices }: { devices: Device[] }): JSX.Element {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          width: "100%",
          borderRadius: "4px",
          p: 1,
          mr: {
            lg: 2,
            md: 2,
          },
          mb: {
            lg: 0,
            md: 0,
            xs: 2,
            sm: 2,
          },
        }}
      >
        <Typography
          fontWeight={"bold"}
          textAlign={"left"}
          fontSize={{ xs: 14, sm: 18, lg: 18 }}
          color={"primary.main"}
        >
          Dispositivos conectados
        </Typography>

        <ul>
          {devices.map((device, i) => (
            <li key={i}>
              <Typography textAlign={"left"}>{device.name}</Typography>
            </li>
          ))}
        </ul>
      </Box>
    </>
  );
}

const DashboardAccordion = ({ spaces }: AccordionProps): JSX.Element => {
  const [data, setData] = useState<Data[]>([]);
  console.log(spaces);

  useEffect(() => {
    const fetchData = async () => {
      const newData: Data[] = [];

      for (let space of spaces) {
        const devices: Device[] = [];
        for (let deviceId of space.devices!) {
          try {
            await getDeviceById(deviceId!, (device) => {
              devices.push(device);
            });
          } catch (error) {
            console.log("error");
          }
        }
        newData.push({
          spaceId: space._id!,
          spaceName: space.name,
          devices: devices,
        });
      }

      setData(newData);
    };

    fetchData();
  }, [spaces]);

  return (
    <>
      {data.map((space, i) => (
        <Accordion
          sx={{
            backgroundColor: "#ECEEEF",
            borderRadius: "8px",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "2",
          }}
          key={i}
        >
          <AccordionSummary expandIcon={<KeyboardArrowDownRounded />}>
            <Typography
              fontWeight={"bold"}
              textAlign={"left"}
              fontSize={{ xs: 14, sm: 18, lg: 18 }}
            >
              {space.spaceName}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {space.devices && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  borderRadius: "4px",
                  p: 1,
                  justifyContent: "space-between",
                  alignItems: "left",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      lg: "row",
                      md: "row",
                      xs: "column",
                      sm: "column",
                    },
                    width: "100%",
                    borderRadius: "4px",
                    p: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <DevicesDetails devices={space.devices} />
                </Box>

                <Button
                  variant="text"
                  sx={{
                    alignSelf: "end",
                  }}
                >
                  <Link
                    to={`/dashboard/${space.spaceId}`}
                    style={{
                      textDecoration: "none",
                      color: "#042F3E",
                    }}
                  >
                    Ver espacio
                  </Link>
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default DashboardAccordion;
