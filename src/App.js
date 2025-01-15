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
} from "@mui/material";
import { Cloud, Menu, Refresh, Dashboard, Settings, BarChart } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Configuração do tema
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f4f6f8",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
    },
  },
});

const drawerWidth = 240;

function App() {
  const [machineStatuses, setMachineStatuses] = useState([]); // Estado para armazenar o status das máquinas
  const [loading, setLoading] = useState(false); // Estado de loading para feedback visual
  const [mobileOpen, setMobileOpen] = useState(false); // Estado para controle do menu mobile

  // Função para buscar os status das máquinas do backend
  const fetchMachineStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3003/machine-status"); // Endpoint do backend
      setMachineStatuses(response.data); // Atualiza o estado com os dados recebidos
    } catch (error) {
      console.error("Erro ao buscar status das máquinas:", error);
      alert("Erro ao carregar status das máquinas.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega os status das máquinas ao montar o componente
  useEffect(() => {
    fetchMachineStatuses();
  }, []);

  // Alterna o menu mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar com itens de navegação (opcional)
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <Dashboard style={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <BarChart style={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Relatórios" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <Settings style={{ color: "#fff" }} />
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
          <Toolbar>
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
                background: "linear-gradient(45deg, #3f51b5, #5c6bc0)",
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
                background: "linear-gradient(45deg, #3f51b5, #5c6bc0)",
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
            width: { md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />

          {/* Título */}
          <Typography variant="h6" sx={{ mb: 3 }}>
            Status das Máquinas
          </Typography>

          {/* Botão para atualizar os dados */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchMachineStatuses}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
              disabled={loading}
            >
              Atualizar Dados
            </Button>
          </Box>

          {/* Lista de status das máquinas */}
          {machineStatuses.length === 0 ? (
            <Typography color="text.secondary">Nenhum status disponível.</Typography>
          ) : (
            machineStatuses.map((status) => (
              <Card key={status._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{status.machine}</Typography>
                  <Typography>
                    <strong>Status:</strong> {status.status}
                  </Typography>
                  <Typography>
                    <strong>Última Atualização:</strong>{" "}
                    {new Date(status.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
