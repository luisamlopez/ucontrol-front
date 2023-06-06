import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import logo from "../assets/Logo.svg";
import {
  ApartmentRounded,
  HelpOutlineRounded,
  HistoryRounded,
  HomeRounded,
  DeviceHubRounded,
  LogoutRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export const Sidebar = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClickHome = () => {
    navigate("/");
  };

  const handleClickDevices = () => {
    navigate("/devices");
  };

  const handleClickSpaces = () => {
    navigate("/spaces");
  };

  const handleClickHistory = () => {
    navigate("/history");
  };

  const handleClickSettings = () => {
    navigate("/settings");
  };

  const handleClickHelp = () => {
    navigate("/help");
  };

  const handleClickLogout = () => {
    alert("/logout");
    navigate("/login");
  };

  const drawer = (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        component={Link}
        to="/"
      >
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{
            width: { xs: 220 },
            m: 0,
            display: {
              lg: "flex",
              xl: "flex",
              md: "flex",
              sm: "flex",
              xs: "none",
            },
          }}
        />
      </Box>
      <List>
        {/* On active change color  */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleClickHome}>
            <ListItemIcon>
              <HomeRounded htmlColor="#fff" fontSize="large" />
            </ListItemIcon>
            <Typography variant="h6" color="#fff">
              Inicio
            </Typography>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={handleClickDevices}>
            <ListItemIcon>
              <DeviceHubRounded htmlColor="#fff" fontSize="large" />
            </ListItemIcon>
            <Typography variant="h6" color="#fff">
              Administrar dispositivos
            </Typography>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={handleClickSpaces}>
            <ListItemIcon>
              <ApartmentRounded htmlColor="#fff" fontSize="large" />
            </ListItemIcon>
            <Typography variant="h6" color="#fff">
              Administrar espacios
            </Typography>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={handleClickHistory}>
            <ListItemIcon>
              <HistoryRounded htmlColor="#fff" fontSize="large" />
            </ListItemIcon>
            <Typography variant="h6" color="#fff">
              Historial
            </Typography>
          </ListItemButton>
        </ListItem>
      </List>

      {/* Bottom of sidebar */}
      <List
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <ListItem disablePadding>
          <ListItemButton onClick={handleClickSettings}>
            <ListItemIcon>
              <SettingsRounded htmlColor="#fff" fontSize="large" />
            </ListItemIcon>
            <Typography variant="h6" color="#fff">
              Configuración
            </Typography>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={handleClickHelp}>
            <ListItemIcon>
              <HelpOutlineRounded htmlColor="#fff" fontSize="large" />
            </ListItemIcon>
            <Typography variant="h6" color="#fff">
              Ayuda
            </Typography>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={handleClickLogout}>
            <ListItemIcon>
              <LogoutRounded htmlColor="#fff" fontSize="large" />
            </ListItemIcon>
            <Typography variant="h6" color="#fff">
              Cerrar sesión
            </Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {/* On desktop hide toolbar */}
        <Toolbar
          sx={{ display: { lg: "none", xl: "none", md: "none", sm: "none" } }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{ display: { lg: "none", xl: "none", md: "none", sm: "none" } }}
          >
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{
                width: { xs: 150 },
                m: 0,
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "primary.main",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "primary.main",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      ></Box>
    </Box>
  );
};
