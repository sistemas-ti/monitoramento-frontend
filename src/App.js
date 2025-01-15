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
  Add,
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
  const [servers, setServers] = useState([]);
  const [newServerName, setNewServerName] = useState("");
  const [newServerEndpoint, setNewServerEndpoint] = useState("");
  const [loading, setLoading] = useState({});
  const [historyData, setHistoryData] = useState({});

  const addServer = () => {
    if (!newServerName || !newServerEndpoint) {
      alert("Preencha o nome e o endpoint do servidor.");
      return;
    }

    setServers((prev) => [
      ...prev,
      { name: newServerName, endpoint: newServerEndpoint },
    ]);
    setNewServerName("");
    setNewServerEndpoint("");
  };

  const fetchServerStatus = async (server) => {
    setLoading((prev) => ({ ...prev, [server.name]: true }));

    try {
      const response = await axios.post(server.endpoint, {
        server: server.name,
      });
      const { cpuUsage, memoryUsage, ...rest } = response.data;

      const cpu = parseFloat(cpuUsage.replace("%", ""));
      const memory = parseFloat(memoryUsage.replace("%", ""));

      setHistoryData((prev) => ({
        ...prev,
        [server.name]: [
          ...(prev[server.name] || []).slice(-10),
          {
            timestamp: new Date().toLocaleTimeString(),
            cpu: cpu || 0,
            memory: memory || 0,
          },
        ],
      }));
    } catch (error) {
      console.error(`Erro ao buscar status do servidor ${server.name}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [server.name]: false }));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      servers.forEach(fetchServerStatus);
    }, 5000);

    return () => clearInterval(interval);
  }, [servers]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Cloud sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap>
              Monitoramento de Servidores
            </Typography>
          </Toolbar>
        </AppBar>

        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant="permanent"
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                background: "linear-gradient(45deg, #3f51b5, #5c6bc0)",
                color: "#fff",
              },
            }}
            open
          >
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
            </List>
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Adicionar Servidor</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                label="Nome do Servidor"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Endpoint"
                value={newServerEndpoint}
                onChange={(e) => setNewServerEndpoint(e.target.value)}
                fullWidth
              />
              <Button variant="contained" color="primary" onClick={addServer} startIcon={<Add />}>
                Adicionar
              </Button>
            </Box>
          </Box>

          {servers.map((server) => (
            <Card key={server.name} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">{server.name}</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => fetchServerStatus(server)}
                  disabled={loading[server.name]}
                  startIcon={loading[server.name] ? <CircularProgress size={20} /> : <Refresh />}
                >
                  Atualizar
                </Button>
                <Box sx={{ mt: 2 }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={historyData[server.name] || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU (%)" />
                      <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memória (%)" />
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
