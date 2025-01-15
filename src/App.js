import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
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
} from "@mui/material";
import {
  Refresh,
  Cloud,
  Dashboard,
  BarChart,
  Settings,
  Menu,
  Add,
  Delete,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";

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
  // Estado para a lista de servidores
  const [servers, setServers] = useState([]);
  // Estados para os inputs do formulário de novo servidor
  const [newServerName, setNewServerName] = useState("");
  const [newServerEndpoint, setNewServerEndpoint] = useState("");
  // Estados para armazenar os status e históricos de cada servidor (por nome)
  const [statusData, setStatusData] = useState({});
  const [historyData, setHistoryData] = useState({});
  // Estado para controle de loading individual (utilizando o nome do servidor como chave)
  const [loading, setLoading] = useState({});
  // Controle de atualização automática (global)
  const [autoUpdate, setAutoUpdate] = useState(true);
  // Estado para menu mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  // Adiciona novo servidor à lista
  const addServer = () => {
    if (!newServerName.trim() || !newServerEndpoint.trim()) {
      alert("Preencha o nome e o endpoint do servidor.");
      return;
    }
    // Evita duplicação (pelo nome)
    if (servers.find((sv) => sv.name === newServerName.trim())) {
      alert("Servidor com este nome já existe.");
      return;
    }
    setServers((prev) => [
      ...prev,
      { name: newServerName.trim(), endpoint: newServerEndpoint.trim() },
    ]);
    setNewServerName("");
    setNewServerEndpoint("");
  };

  // Remove um servidor da lista
  const removeServer = (serverName) => {
    setServers((prev) => prev.filter((s) => s.name !== serverName));
    // Remove status e histórico, se houver
    setStatusData((prev) => {
      const copy = { ...prev };
      delete copy[serverName];
      return copy;
    });
    setHistoryData((prev) => {
      const copy = { ...prev };
      delete copy[serverName];
      return copy;
    });
  };

  // Busca o status de um servidor
  const fetchServerStatus = async (server) => {
    // Se não houver nome, aborta
    if (!server.name) return;

    // Atualiza estado de loading
    setLoading((prev) => ({ ...prev, [server.name]: true }));

    try {
      const response = await axios.post(server.endpoint, {
        server: server.name,
      });
      // Exemplo de resposta:
      // {
      //   "server": "MeuServidorLocal",
      //   "cpuUsage": "53.27%",
      //   "memoryUsage": "89.10%",
      //   "status": "Online",
      //   "timestamp": "2025-01-13T12:00:00.000Z"
      // }
      const { cpuUsage, memoryUsage, ...rest } = response.data;
      const cpu = parseFloat(cpuUsage.replace("%", ""));
      const memory = parseFloat(memoryUsage.replace("%", ""));

      // Atualiza o status daquele servidor
      setStatusData((prev) => ({
        ...prev,
        [server.name]: { ...rest, cpuUsage: cpu, memoryUsage: memory },
      }));

      // Atualiza o histórico (limite de 10 registros)
      setHistoryData((prev) => {
        const currentHistory = prev[server.name] || [];
        return {
          ...prev,
          [server.name]: [
            ...currentHistory.slice(-10),
            {
              timestamp: new Date().toLocaleTimeString(),
              cpu,
              memory,
            },
          ],
        };
      });
    } catch (error) {
      console.error(`Erro ao buscar status do servidor ${server.name}:`, error);
      alert(`Erro ao buscar o status do servidor ${server.name}. Verifique a conexão.`);
    } finally {
      setLoading((prev) => ({ ...prev, [server.name]: false }));
    }
  };

  // Atualiza status de todos os servidores se autoUpdate estiver ativado
  useEffect(() => {
    if (autoUpdate && servers.length > 0) {
      servers.forEach((server) => fetchServerStatus(server));
      const interval = setInterval(() => {
        servers.forEach((server) => fetchServerStatus(server));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [servers, autoUpdate]);

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
              Monitoramento de Servidores
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

          {/* Formulário para adicionar novo servidor */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Adicionar Novo Servidor</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
              <TextField
                label="Nome do Servidor"
                variant="outlined"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                size="small"
              />
              <TextField
                label="Endpoint"
                variant="outlined"
                value={newServerEndpoint}
                onChange={(e) => setNewServerEndpoint(e.target.value)}
                size="small"
              />
              <Button variant="contained" color="primary" onClick={addServer} startIcon={<Add />}>
                Adicionar
              </Button>
            </Box>
          </Box>

          {/* Botão para ativar/desativar auto update global */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              color={autoUpdate ? "secondary" : "primary"}
              onClick={() => setAutoUpdate(!autoUpdate)}
            >
              {autoUpdate ? "Pausar Atualização Automática" : "Reativar Atualização Automática"}
            </Button>
          </Box>

          {/* Listagem dos servidores cadastrados */}
          {servers.length === 0 && (
            <Typography color="text.secondary">Nenhum servidor cadastrado.</Typography>
          )}
          {servers.map((server) => (
            <Card key={server.name} sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="h6">
                    {server.name} -{" "}
                    {statusData[server.name] ? statusData[server.name].status : "Sem dados"}
                  </Typography>
                  <IconButton color="secondary" onClick={() => removeServer(server.name)}>
                    <Delete />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                  {/* Botão para atualizar manualmente o servidor */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => fetchServerStatus(server)}
                    startIcon={
                      loading[server.name] ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Refresh />
                      )
                    }
                    disabled={loading[server.name]}
                  >
                    Atualizar
                  </Button>
                  {statusData[server.name] && (
                    <>
                      <Typography variant="body1">
                        <strong>CPU:</strong> {statusData[server.name].cpuUsage}%
                      </Typography>
                      <Typography variant="body1">
                        <strong>Memória:</strong> {statusData[server.name].memoryUsage}%
                      </Typography>
                    </>
                  )}
                </Box>

                {/* Gráfico do histórico */}
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Histórico
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 250,
                    background: "#fff",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historyData[server.name] || []}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cpu"
                        stroke="#8884d8"
                        name="CPU (%)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="memory"
                        stroke="#82ca9d"
                        name="Memória (%)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
