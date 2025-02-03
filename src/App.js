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
  alpha,
  useTheme,
  styled,
  keyframes
} from "@mui/material";
import {
  Cloud,
  Menu,
  Refresh,
  Dashboard,
  Settings,
  BarChart,
  FiberManualRecord,
  Lan,
  Memory,
  Storage,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const drawerWidth = 280;
const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  70% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
`;

const ModernCard = styled(Card)(({ theme, status }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
    padding: '2px',
    background: status === 'online' 
      ? `linear-gradient(45deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0)})`
      : `linear-gradient(45deg, ${theme.palette.error.main}, ${alpha(theme.palette.error.main, 0)})`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  },
}));

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c4dff',
    },
    secondary: {
      main: '#00e5ff',
    },
    background: {
      default: '#0a1929',
      paper: '#001e3c',
    },
    success: {
      main: '#00ff88',
    },
    error: {
      main: '#ff1744',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(16, 24, 39, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${alpha('#7c4dff', 0.2)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(16, 24, 39, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRight: `1px solid ${alpha('#7c4dff', 0.1)}`,
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
  const theme = useTheme();

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

  useEffect(() => {
    fetchMachineStatuses();
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleCloseOfflineAlert = () => setOfflineAlertOpen(false);

  const drawer = (
    <div>
      <Toolbar sx={{ px: 2, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Cloud sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          <Typography variant="h6" color="text.primary">
            Cloud Monitor
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1), my: 2 }} />
      <List>
        {[
          { text: 'Dashboard', icon: <Dashboard /> },
          { text: 'Analytics', icon: <BarChart /> },
          { text: 'Infraestrutura', icon: <Memory /> },
          { text: 'Armazenamento', icon: <Storage /> },
          { text: 'Configurações', icon: <Settings /> },
        ].map((item) => (
          <ListItem 
            button 
            key={item.text}
            sx={{
              borderRadius: 2,
              mx: 2,
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: "none" } }}
              >
                <Menu />
              </IconButton>
              <Typography variant="h6" noWrap>
                Machine Monitoring
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: serverOnline ? 'success.main' : 'error.main',
                    animation: serverOnline ? `${pulse} 1.5s infinite` : 'none',
                  }}
                />
                <Typography variant="body2">
                  {serverOnline ? 'Connected' : 'Offline'}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={fetchMachineStatuses}
                startIcon={<Refresh />}
                sx={{
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                Refresh
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              '& .MuiDrawer-paper': { width: drawerWidth },
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
            mt: 8,
            background: theme.palette.background.default,
            minHeight: '100vh',
          }}
        >
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={3}>
              {machineStatuses.map((status) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={status._id}>
                  <ModernCard status={status.status.toLowerCase()}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Lan sx={{ 
                          fontSize: 40, 
                          mr: 2,
                          color: status.status.toLowerCase() === 'online' 
                            ? 'success.main' 
                            : 'error.main' 
                        }} />
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {status.machine}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color={status.status.toLowerCase() === 'online' 
                              ? 'success.main' 
                              : 'error.main'}
                            fontWeight={500}
                          >
                            {status.status}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography 
                        variant="caption" 
                        component="div" 
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Last update: {new Date(status.timestamp).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </ModernCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Snackbar
          open={offlineAlertOpen}
          autoHideDuration={6000}
          onClose={handleCloseOfflineAlert}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            severity="error"
            sx={{
              background: theme.palette.error.dark,
              color: theme.palette.common.white,
              borderRadius: 3,
              boxShadow: theme.shadows[6],
            }}
          >
            Connection lost! Unable to reach the server.
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
