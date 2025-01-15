import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Container,
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
  const [serverName, setServerName] = useState("MeuServidorLocal");
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Função para buscar o status do servidor
  const fetchServerStatus = async () => {
    if (!serverName.trim()) {
      alert("O nome do servidor não pode estar vazio.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://monitoramento-servidor-1.onrender.com/status", {
        server: serverName,
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
    
      setStatusData({ ...rest, cpuUsage: cpu, memoryUsage: memory });
      setHistoryData((prev) => [
        ...prev.slice(-10),
        {
          timestamp: new Date().toLocaleTimeString(),
          cpu: cpu || 0,
          memory: memory || 0,
        },
      ]);
    } catch (error) {
      console.error("Erro ao buscar o status do servidor:", error);
      alert("Erro ao buscar o status do servidor. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
    
  };

  // Atualização automática
  useEffect(() => {
    if (autoUpdate) {
      fetchServerStatus();
      const interval = setInterval(fetchServerStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [serverName, autoUpdate]);

  // Função para alternar o menu em telas pequenas
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
            {/* Botão para abrir o menu em telas pequenas */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <Menu />
            </IconButton>
            <Cloud sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap component="div">
              Monitoramento do Servidor
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="mailbox folders"
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
          {/* Campo para alterar o nome do servidor e botões */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              label="Nome do Servidor"
              variant="outlined"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              size="small"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={fetchServerStatus}
              startIcon={<Refresh />}
            >
              Atualizar
            </Button>
            <Button
              variant="outlined"
              color={autoUpdate ? "secondary" : "primary"}
              onClick={() => setAutoUpdate(!autoUpdate)}
            >
              {autoUpdate ? "Pausar" : "Reativar"}
            </Button>
          </Box>

          {loading ? (
            <Box mt={4} display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : statusData ? (
            <>
              {/* Cartão com informações do servidor */}
              <Card
                variant="outlined"
                className={`status-card ${
                  statusData.status === "Online" ? "online" : "offline"
                }`}
                sx={{ mb: 4 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {statusData.server} - {statusData.status}
                  </Typography>
                  <Typography variant="body1">
                    <strong>CPU:</strong> {statusData.cpuUsage}%
                  </Typography>
                  <Typography variant="body1">
                    <strong>Memória:</strong> {statusData.memoryUsage}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Última atualização: {new Date().toLocaleTimeString()}
                  </Typography>
                </CardContent>
              </Card>

              {/* Gráfico de histórico */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Histórico
              </Typography>
              <Box sx={{ width: "100%", height: 300, background: "#fff", p: 2, borderRadius: 2, boxShadow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={historyData}
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
            </>
          ) : (
            <Typography mt={4} color="text.secondary">
              Carregando...
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
