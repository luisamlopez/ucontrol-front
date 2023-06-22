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
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../contexts/authContext";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

interface Option {
  name: string;
  icon: JSX.Element;
  link: string;
}

export const Sidebar = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeOption, setActiveOption] = useState("");
  const { logout } = useUser();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //Array of options for sidebar
  const options: Option[] = [
    {
      name: "Inicio",
      icon: <HomeRounded />,
      link: "/dashboard",
    },
    {
      name: "Administrar dispositivos",
      icon: <DeviceHubRounded />,
      link: "/devices",
    },
    {
      name: "Administrar espacios",
      icon: <ApartmentRounded />,
      link: "/spaces",
    },
    {
      name: "Historial",
      icon: <HistoryRounded />,
      link: "/history",
    },
  ];

  const userOptions = [
    {
      name: "Configuración",
      icon: <SettingsRounded />,
      link: "/settings",
    },
    {
      name: "Ayuda",
      icon: <HelpOutlineRounded />,
      link: "/help",
    },
  ];

  const drawer = (
    <div>
      {/* Desktop */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          m: 0,
          p: 0,
        }}
        component={Link}
        to="/dashboard"
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
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </Box>
      <List>
        {options.map((option, index) => (
          <ListItemButton key={index}>
            <Link
              to={option.link}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                size="large"
                sx={{
                  color:
                    option.link.includes(location.pathname) ||
                    option.link === activeOption
                      ? "secondary.main"
                      : "#fff",
                }}
              >
                {option.icon}
              </IconButton>
              <Typography
                variant="h6"
                color={
                  option.link.includes(location.pathname) ||
                  option.link === activeOption
                    ? "secondary.main"
                    : "#fff"
                }
                fontWeight={400}
              >
                {option.name}
              </Typography>
            </Link>
          </ListItemButton>
        ))}
      </List>

      {/* Bottom of sidebar */}
      <List
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        {userOptions.map((option, index) => (
          <ListItemButton key={index}>
            <Link
              to={option.link}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                size="large"
                sx={{
                  color:
                    option.link.includes(location.pathname) ||
                    option.link === activeOption
                      ? "secondary.main"
                      : "#fff",
                }}
              >
                {option.icon}
              </IconButton>
              <Typography
                variant="h6"
                color={
                  option.link.includes(location.pathname) ||
                  option.link === activeOption
                    ? "secondary.main"
                    : "#fff"
                }
                fontWeight={400}
              >
                {option.name}
              </Typography>
            </Link>
          </ListItemButton>
        ))}
        <ListItemButton>
          <IconButton size="large">
            <LogoutRounded htmlColor="white" />
          </IconButton>
          <Typography variant="h6" color={"#fff"} fontWeight={400}>
            Cerrar Sesion
          </Typography>
        </ListItemButton>
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
          sx={{
            display: { lg: "none", xl: "none", md: "none", sm: "none" },
          }}
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
            sx={{
              display: { lg: "none", xl: "none", md: "none", sm: "none" },
            }}
          >
            <Link to="/dashboard">
              <Box
                component="img"
                src={logo}
                alt="logo"
                sx={{
                  width: { xs: 150 },
                  m: 0,
                }}
              />
            </Link>
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
    </Box>
  );
};
