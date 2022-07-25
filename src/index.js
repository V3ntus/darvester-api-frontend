// Core
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import { SearchAppBar } from './components/Search';
import {
  Box,
  Typography
} from '@mui/material';

// Styles
import './index.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './common';

// Routes
import { default as Guilds } from './routes/guilds';
import Users from './routes/users';
import Guild from './routes/guild';

const root = ReactDOM.createRoot(document.getElementById('root'));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  componentDidMount() {
    this.setState({ open: true });
  }
  
  componentWillUnmount() {
    this.setState({ open: false });
  }

  render() {
    const classes = this.state.open ? 'home_header' : 'home_header hide';
    return (
      <Box>
        <Typography variant="h1" component="h1" align="center" className={classes}>
          Darvester
        </Typography>
        <Box sx={{
          backgroundColor: "#444444",
          width: { xs: '100%', md: '80%' },
          margin: 'auto',
          marginBottom: '1rem',
          padding: theme.spacing(2),
          borderRadius: "4px",
        }}>
          To get started, open the drawer on the left or begin a search.
        </Box>
        <Box sx={{
          backgroundColor: "#444444",
          width: { xs: '100%', md: '80%' },
          margin: 'auto',
          marginBottom: '1rem',
          padding: theme.spacing(2),
          borderRadius: "4px",
        }}>
          Stuff and things
        </Box>
      </Box>
    );
  }
}

root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchAppBar />}>
            <Route path="/" element={<App />} />
            <Route path="guilds" element={<Guilds />} />
            <Route path="users" element={<Users />} />
            <Route path="info" element={<></>} />
            <Route path="guild" element={<Guild />} />
            <Route path="user" element={<></>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
);
