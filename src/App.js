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
} from "@mui/material";
import {
  Cloud,
  Menu,
  Refresh,
  Dashboard,
  Settings,
  BarChart,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Configuração atualizada do tema
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // tom de azul moderno
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
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

const drawerWidth = 240;

function App() {
  const [machineStatuses, setMachineStatuses] = useState([]); // Armazena o status das máquinas
  const [loading, setLoading] = useState(false);               // Estado de loading
  const [mobileOpen, setMobileOpen] = useState(false);           // Controle do menu mobile

  // Função para buscar os status das máquinas do backend
  const fetchMachineStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://monitoramento-servidor-1.onrender.com/machine-status");
      setMachineStatuses(response.data);
    } catch (error) {
      console.error("Erro ao buscar status das máquinas:", error);
      alert("Erro ao carregar status das máquinas.");
    } finally {
      setLoading(false);
    }
  };

  // Busca os status ao montar o componente
  useEffect(() => {
    fetchMachineStatuses();
  }, []);

  // Alterna o menu mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar com itens de navegação
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <Dashboard sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <BarChart sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Relatórios" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <Settings sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        {/* AppBar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
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
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="menu"
        >
          {/* Menu para dispositivos móveis */}
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
                color: "#fff",
              },
            }}
          >
            {drawer}
          </Drawer>
          {/* Menu permanente para desktop */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                color: "#fff",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Conteúdo Principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            backgroundColor: theme.palette.background.default,
            minHeight: "100vh",
          }}
        >
          <Container maxWidth="lg">
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
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {status.machine}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Status:</strong> {status.status}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Última Atualização: {new Date(status.timestamp).toLocaleString()}
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
    </ThemeProvider>
  );
}

export default App;
