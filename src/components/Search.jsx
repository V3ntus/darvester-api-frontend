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
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import { Link, Outlet} from 'react-router-dom';

import ImageWithFallback from './Image';
import { getSmallerIcon, theme } from '../common';
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
    float: 'right'
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    left: '-60px',
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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#222222' : '#ffffff',
    ...theme.typography.body2,
    padding: theme.spacing(1.25),
    margin: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.seconday
}));

export function SearchAppBar() {
    const [state, setState] = React.useState({
      left: false
    });
    const [loading, setLoading] = React.useState(false);

    const [searchOpen, setSearchOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);

    const doSearch = (term) => {
        if (term === "" || term === undefined) {setOptions([]); return undefined};
        // setLoading(true);  // this not work
        fetch(`http://localhost:8080/search/${term}?limit=50`).then(res => res.json()).then(res => {
                res['users'].forEach(element => {
                    element['type'] = 'User';
                });
                res['guilds'].forEach(element => {
                    element['type'] = 'Guild';
                });
                setOptions([...res['guilds'], ...res['users']]);
            });
        // setLoading(false);
    };

    // If search is not open, clear options
    React.useEffect(() => {
      if (!searchOpen) {
        setOptions([]);
      }
    }, [searchOpen])
  
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
          <Link to="/" id="drawer_header">
            <Typography
              variant="h4"
              align="center"
              id="drawer_header"
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
              <TextField 
                id="search_field"
                label="Search..."
                variant="outlined"
                onChange={debounce((e) => doSearch(e.target.value), 300)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                InputProps={{
                    endAdornment: (
                        <React.Fragment>
                            <CircularProgress sx={{ display: loading ? 'block' : 'none' }} color="inherit" size={20} />
                        </React.Fragment>
                    )
                }}
              />
                <Stack sx={{
                display: searchOpen ? 'block' : 'none',
                position: 'absolute',
                maxHeight: '600px',
                minWidth: '500px',
                overflowY: 'auto',
                overflowX: 'hidden',
                zIndex: '5',
                right: 0,
                marginTop: '10px',
                backgroundColor: '#333333',
                padding: '12px',
                borderRadius: '6px'
                }}>
                <Typography
                    variant="h4"
                    color="#777777"
                    fontWeight="light"
                >
                    Guilds
                </Typography>
                <Divider sx={{ margin: "12px" }} />
                {options
                    .filter((el) => {
                        return el.type === 'Guild';
                    })
                    .map((option, index) => (
                        <Link to={`/guild/${option['id']}`}>
                            <Item>
                                <Box component="div" sx={{ display: 'inline-block', paddingRight: '12px' }}>
                                    <ImageWithFallback src={getSmallerIcon(option['icon'])} fallback="/default_avatar.png" alt={option['name']} width="64px" style={{ borderRadius: "4px" }} />
                                </Box>
                                <Box component="div" sx={{ display: 'inline-block', paddingRight: '12px' }}>
                                    <Typography variant="subtitle2" sx={{
                                            fontWeight: 'bold',
                                            fontSize: '24px'
                                        }}>{option['name']}</Typography>
                                    <Typography variant="subtitle1" sx={{ fontSize: '12px' }}>{option['id']}</Typography>
                                </Box>
                            </Item>
                        </Link>
                ))}
                <Typography variant="subtitle1" sx={{
                    fontWeight: 'light',
                    color: '#777777',
                }}>{options.filter((el) => {return el.type === 'Guild'}).length} results</Typography>
                <Typography
                    variant="h4"
                    color="#777777"
                    fontWeight="light"
                >
                    Users
                </Typography>
                <Divider sx={{ margin: "12px" }} />
                {options
                    .filter((el) => {
                        return el.type === 'User';
                    })
                    .map((option, index) => (
                        <Link to={`/user/${option['id']}`}>
                        <Item>
                                <Box component="div" sx={{ display: 'inline-block', paddingRight: '8px' }}>
                                    <ImageWithFallback src={getSmallerIcon(option['avatar_url'])} fallback="/default_avatar.png" alt={option['name']} width="64px" style={{ borderRadius: "4px" }} />
                                </Box>
                                <Box component="div" sx={{ display: 'inline-block' }}>
                                    <Typography variant="subtitle2" sx={{
                                            fontWeight: 'bold',
                                            fontSize: '24px'
                                        }}
                                        component="span">
                                        {option['name']}
                                    </Typography>
                                    <Typography variant="subtitle2" component="span" sx={{
                                        fontSize: '20px',
                                    }}>
                                        #{option['discriminator']}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontSize: '12px' }}>{option['id']}</Typography>
                                </Box>
                        </Item>
                        </Link>
                    ))
                }
                <Typography variant="subtitle1" sx={{
                    fontWeight: 'light',
                    color: '#777777',
                }}>{options.filter((el) => {return el.type === 'User'}).length} results</Typography>
                </Stack>
            </Search>
          </Toolbar>
        </AppBar>
        <Outlet />
      </Box>
    );
  }
  
