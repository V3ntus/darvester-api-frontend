import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';


import { Link, Outlet} from 'react-router-dom';

import { theme } from '../common';
import debounce from 'lodash.debounce';

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
}));

export function SearchAppBar() {
    const [state, setState] = React.useState({
      left: false
    });
    const [searchTerm, setSearchTerm] = React.useState('');

    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.filter(
      function(obj) {
        return Object.keys(obj).some(function(key) {
          if (typeof(obj[key]) === 'string') return obj[key].toLowerCase().includes(searchTerm.toLowerCase());
          return false;
        })
      }
    ).length < 25;

    const debouncedResults = React.useMemo(() => {
        return debounce((async () => {
            if (searchTerm === "" || undefined) return undefined;
            fetch(`http://localhost:8080/search/${searchTerm}?limit=25`).then(res => res.json()).then(res => {
                res['users'].forEach(element => {
                    element['type'] = 'User';
                });
                res['guilds'].forEach(element => {
                    element['type'] = 'Guild';
                });
                setOptions([...res['users'], ...res['guilds']]);
            });
        }), 500)
    }, [searchTerm]);

    React.useEffect(() => {
        if (!loading && options.length !== 0) {
            return undefined;
        }
        debouncedResults();
    }, [loading, options.length]);

    React.useEffect(() => {
      if (!open) {
        setOptions([]);
      }
    }, [open])
  
    const toggleDrawer = (anchor, open) => (event) => {
      if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
        return;
      }
      setState({ ...state, [anchor]: open });
    }
    
    const list = (anchor) => (
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          <Link to="/">
            <Typography
              variant="h4"
              align="center"
              sx={{
                padding: theme.spacing(2),
              }}
              >
                Darvester
              </Typography>
            </Link>
            <Divider />
          {['Guilds', 'Users', 'Info'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <Link to={text.toLowerCase()} style={{ width: '100%' }}>
                <ListItemButton sx={{ width: '100%' }}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Settings'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem key={"footer"}>
            <ListItemText primary={"Version: 0.0.1"} />
          </ListItem>
        </List>
      </Box>
    );
  
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={toggleDrawer('left', true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={state["left"]}
              onClose={toggleDrawer('left', false)}
            >
              {list("left")}
            </Drawer>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              <Link to="/">
                Darvester
              </Link>
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              {/* <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onInput={(e) => (debouncedResults(e.target.value))}
              /> */}
              <Autocomplete 
                id="async-search"
                sx={{ width: 300 }}
                open={open}
                onInputChange={(e) => {setSearchTerm(e.target.value)}}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                isOptionEqualToValue={(option, value) => option.name.toLowerCase() === value.name.toLowerCase()}
                getOptionLabel={(option) => option.name}
                groupBy={(option) => option.type}
                options={options}
                loading={loading}
                renderInput={(params) => (
                  <TextField 
                    {...params}
                    label="Search"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      )
                    }}
                  />
                )}
              />
            </Search>
          </Toolbar>
        </AppBar>
        <Outlet />
      </Box>
    );
  }
  
