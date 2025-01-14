import React, { useState, useEffect } from "react";
import axios from "axios";
import {
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
  ListItemText,
} from "@mui/material";
import { Refresh, Cloud, Dashboard, BarChart } from "@mui/icons-material";
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

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function App() {
  const [serverName, setServerName] = useState("MeuServidor");
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(true);

  const fetchServerStatus = async () => {
    if (!serverName.trim()) {
      alert("O nome do servidor não pode estar vazio.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/status", {
        server: serverName,
      });

      const { cpuUsage, memoryUsage, ...rest } = response.data;

      const cpu = parseFloat(cpuUsage.replace(",", "."));
      const memory = parseFloat(memoryUsage.replace(",", "."));

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

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 5000); // Atualiza a cada 5 segundos
    return () => clearInterval(interval);
  }, [serverName, autoUpdate]);

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
            },
            display: { xs: "none", md: "block" },
          }}
        >
          <List>
            <ListItem button>
              <Dashboard />
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button>
              <BarChart />
              <ListItemText primary="Relatórios" />
            </ListItem>
          </List>
        </Drawer>

        {/* Conteúdo Principal */}
        <Container className="App" maxWidth="md" sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            <Cloud fontSize="large" /> Monitoramento do Servidor
          </Typography>

          {/* Formulário */}
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
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
              Atualizar Status
            </Button>
            <Button
              variant="outlined"
              color={autoUpdate ? "secondary" : "primary"}
              onClick={() => setAutoUpdate(!autoUpdate)}
            >
              {autoUpdate ? "Pausar Monitoramento" : "Reativar Monitoramento"}
            </Button>
          </Box>

          {/* Status e Gráficos */}
          {loading ? (
            <Box mt={4} display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : statusData ? (
            <>
              {/* Card de Status */}
              <Card
                variant="outlined"
                className={`status-card ${
                  statusData.status === "Online" ? "online" : "offline"
                }`}
                sx={{ mt: 4 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Status do {statusData.server}
                  </Typography>
                  <Typography>Uso de CPU: {statusData.cpuUsage}%</Typography>
                  <Typography>Uso de Memória: {statusData.memoryUsage}%</Typography>
                  <Typography>Status: {statusData.status}</Typography>
                  <Typography>Última atualização: {statusData.timestamp}</Typography>
                </CardContent>
              </Card>

              {/* Gráfico de Linhas Responsivo */}
              <Typography variant="h6" mt={4}>
                Histórico de Uso (CPU e Memória)
              </Typography>
              <Box mt={2} width="100%" height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={historyData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                      formatter={(value) => `${value}%`}
                      labelFormatter={(label) => `Horário: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cpu"
                      stroke="#8884d8"
                      name="CPU (%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="memory"
                      stroke="#82ca9d"
                      name="Memória (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </>
          ) : (
            <Typography mt={4} color="text.secondary">
              Carregando status...
            </Typography>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
