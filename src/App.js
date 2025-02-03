import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Button,
  Container,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Cloud,
  Menu,
  Refresh,
  Dashboard,
  Settings,
  BarChart,
  FiberManualRecord,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const drawerWidth = 240;

// Tema customizado
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f7f9fc",
      paper: "#fff",
    },
  },
  typography: {
    fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif",
    h4: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "transform 0.3s ease, boxShadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  },
});

function App() {
  const [machineStatuses, setMachineStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);
  const [offlineAlertOpen, setOfflineAlertOpen] = useState(false);

  // Fecha o Snackbar
  const handleCloseOfflineAlert = () => {
    setOfflineAlertOpen(false);
  };

  // Função para buscar status das máquinas
  const fetchMachineStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://monitoramento-servidor-1.onrender.com/machine-status"
      );
      setMachineStatuses(response.data);
      setServerOnline(true);
    } catch (error) {
      console.error("Erro ao buscar status das máquinas:", error);
      setServerOnline(false);
      setOfflineAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Busca status ao montar o componente
  useEffect(() => {
    fetchMachineStatuses();
  }, []);

  // Alterna o menu mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List sx={{ px: 1 }}>
        <ListItem button>
          <ListItemIcon>
            <Dashboard sx={{ color: "#fff" }} />
          </ListItemIcon>
          {/* Forçar a cor do texto em branco */}
          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{ sx: { color: "#fff" } }}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <BarChart sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText
            primary="Relatórios"
            primaryTypographyProps={{ sx: { color: "#fff" } }}
          />
        </ListItem>
        <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.2)" }} />
        <ListItem button>
          <ListItemIcon>
            <Settings sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText
            primary="Configurações"
            primaryTypographyProps={{ sx: { color: "#fff" } }}
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        {/* Barra superior (AppBar) */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo e Título */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: "none" } }}
              >
                <Menu />
              </IconButton>
              <Cloud sx={{ mr: 1 }} />
              <Typography variant="h6" noWrap>
                Monitoramento de Máquinas
              </Typography>
            </Box>

            {/* Indicador de conexão e botão Atualizar */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
                <FiberManualRecord
                  sx={{
                    color: serverOnline ? "green" : "red",
                    fontSize: 14,
                    mr: 0.5,
                  }}
                />
                <Typography variant="body2">
                  {serverOnline ? "Online" : "Offline"}
                </Typography>
              </Box>
              <Button
                color="inherit"
                onClick={fetchMachineStatuses}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Refresh />
                  )
                }
              >
                Atualizar
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Menu lateral (Drawer) */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="menu lateral"
        >
          {/* Drawer para dispositivos móveis */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Drawer permanente (desktop) */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Conteúdo principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            minHeight: "100vh",
          }}
        >
          {/* Para espaçar abaixo do AppBar */}
          <Toolbar />

          {/* Container principal do conteúdo */}
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Status das Máquinas
            </Typography>

            {machineStatuses.length === 0 ? (
              <Typography color="text.secondary">
                Nenhum status disponível.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {machineStatuses.map((status) => (
                  <Grid item xs={12} sm={6} md={4} key={status._id}>
                    <Card
                      sx={{
                        borderLeft: `5px solid ${
                          status.status.toLowerCase() === "online"
                            ? "green"
                            : "red"
                        }`,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {status.machine}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Status:</strong>{" "}
                          <Box
                            component="span"
                            sx={{
                              color:
                                status.status.toLowerCase() === "online"
                                  ? "green"
                                  : "red",
                              fontWeight: "bold",
                            }}
                          >
                            {status.status}
                          </Box>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Última Atualização:{" "}
                          {new Date(status.timestamp).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      </Box>

      {/* Snackbar para notificar quando Offline */}
      <Snackbar
        open={offlineAlertOpen}
        autoHideDuration={6000}
        onClose={handleCloseOfflineAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseOfflineAlert} severity="error">
          Servidor está offline! Verifique sua conexão ou tente novamente.
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
