import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
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
  VpnKeyRounded,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../contexts/authContext";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

/**
 * @luisamlopez
 * @description The `interface Option` defines the structure of an option in the sidebar. It has three properties:
 * @property name: the name of the option
 * @property icon: the icon of the option
 * @property link: the link to the option
 *
 */
interface Option {
  name: string;
  icon: JSX.Element;
  link: string;
}

export const Sidebar = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [activeOption, setActiveOption] = useState("");
  const { logout } = useUser();
  const { user } = useUser();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /**
   * @description Array of options for sidebar
   */

  const options: Option[] = [
    {
      name: "Inicio",
      icon: <HomeRounded />,
      link: "/dashboard",
    },
    {
      name: "Administrador de dispositivos",
      icon: <DeviceHubRounded />,
      link: "/devices",
    },
    {
      name: "Administrador de espacios",
      icon: <ApartmentRounded />,
      link: "/spaces",
    },
    {
      name: "Historial",
      icon: <HistoryRounded />,
      link: "/history",
    },
    {
      name: "Control de Acceso",
      icon: <VpnKeyRounded />,
      link: "/controlAccess",
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
      <Typography
        sx={{
          textAlign: "center",
          mt: 2,
          color: "#fff",
        }}
      >
        Hola, {user?.name}
      </Typography>
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
                    location.pathname.includes(option.link) ||
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
                  location.pathname.includes(option.link) ||
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
                    location.pathname.includes(option.link) ||
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
                  location.pathname.includes(option.link) ||
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
        <ListItemButton onClick={logout}>
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
