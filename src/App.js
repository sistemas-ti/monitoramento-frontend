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
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
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

// Mantemos o tema anterior...

function App() {
  // Estados anteriores mantidos...

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          {/* Header mantido igual */}
        </AppBar>

        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          {/* Drawer mantido igual */}
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
            <Grid
              container
              spacing={3}
              sx={{
                alignItems: 'stretch',
                '& > .MuiGrid-item': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              {machineStatuses.map((status) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={status._id}>
                  <ModernCard status={status.status.toLowerCase()}>
                    <CardContent sx={{ 
                      p: 3,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        minHeight: 64
                      }}>
                        <Lan sx={{ 
                          fontSize: 40, 
                          mr: 2,
                          flexShrink: 0,
                          color: status.status.toLowerCase() === 'online' 
                            ? 'success.main' 
                            : 'error.main' 
                        }} />
                        <Box sx={{ overflow: 'hidden' }}>
                          <Typography 
                            variant="h6" 
                            fontWeight={600}
                            noWrap
                            sx={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden'
                            }}
                          >
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
                        sx={{ 
                          mt: 1,
                          textAlign: 'right',
                          opacity: 0.8
                        }}
                      >
                        {new Date(status.timestamp).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </ModernCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Snackbar mantido igual */}
      </Box>
    </ThemeProvider>
  );
}

export default App;
