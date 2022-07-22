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
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
);
