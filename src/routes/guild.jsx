import React from 'react';
import {
    Box,
    Typography,
    Snackbar
} from '@mui/material';
import ImageWithFallback from '../components/Image';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useSearchParams } from 'react-router-dom';
import { theme, getSmallerIcon } from '../common';

var JSONBig = require('json-bigint');

export default function Guild() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [guild, setGuild] = React.useState({});
    const [guildMembers, setGuildMembers] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');   

    React.useEffect(() => {
        let _promises = [];
        _promises.push(fetch(`http://localhost:8080/guilds/${searchParams.get('id')}`).then((resp) => resp.text()).then((data) => {
            data = JSONBig.parse(data);
            setGuild(data);
        }));
        _promises.push(fetch(`http://localhost:8080/guilds/${searchParams.get('id')}/members`).then((resp) => resp.text()).then(
            (data) => {
                data = JSONBig.parse(data);
                setGuildMembers(data['members']);
            }
        ));
        Promise.all(_promises)
            .then(() => {
                setOpen(true);
            });
        return () => {
            setOpen(false);
        }
    }, [searchParams]);
    
    return (
        <Box>
            <Box sx={{
                position: 'absolute',
                top: '76px',
                zIndex: '-5',
                opacity: '0.5',
                width: '100%',
                overflow: 'hidden'
            }}>
                <ImageWithFallback fallback="transparent.png" src={guild.splash_url} id="guild_splash" className={open ? "home_header" : "home_header hide"} alt="" />
            </Box>
            <Box sx={{
                    width: { xs: '100%', md: '80%' },
                    margin: 'auto',
                    marginBottom: '1rem',
                    padding: theme.spacing(2),
                    borderRadius: "4px",
                    wordBreak: 'break-all',
                    maxWidth: '100%'
                }}>
                <ImageWithFallback fallback="default_avatar.png" src={getSmallerIcon(guild['icon'], 128)} alt={guild.name} width={128} height={128} style={{
                    borderRadius: "5px",
                    padding: theme.spacing(1, 1, 1, 1),
                }} />
                <Typography variant="h1" component="span" align="left" className={open ? 'home_header' : 'home_header hide'} sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '3rem', md: '7rem' },
                    display: 'inline-block',
                    transform: 'translateY(-1.6rem)',
                    paddingLeft: { xs: '8px', md: '24px'},
                    paddingTop: { xs: '14px', md: '0' }
                }}>
                    {guild['name']}
                </Typography>
            </Box>
            
            <Box className={open ? 'home_header' : 'home_header hide'} sx={{
                backgroundColor: "#373737",
                width: { xs: '100%', md: '80%' },
                margin: 'auto',
                marginBottom: '1rem',
                padding: theme.spacing(2),
                borderRadius: "4px",
            }}>
                <Typography variant="h3" className='guild_info_header'>
                    Description
                </Typography>
                <Typography variant="body1" component="span" className='guild_info_body'>
                    {guild['description']}
                </Typography>

                <Typography variant="h3" className='guild_info_header'>
                    Members
                </Typography>
                <Typography variant="body1" component="div" className='guild_info_body' sx={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                }}>
                    {guildMembers
                        .map((row, index) => {
                        return (
                            <Box sx={{
                                padding: '0.25rem',
                            }}>
                                <Typography variant="subtitle2" sx={{
                                        fontWeight: 'bold',
                                        fontSize: {xs: "14px", md: "18px"}
                                    }}
                                    component="span">
                                    {row['name']}
                                </Typography>
                                <Typography variant="subtitle2" component="span" sx={{
                                    fontSize: '14px',
                                }}>
                                    #{row['discriminator']}
                                </Typography>
                                <ContentCopyIcon sx={{
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    paddingLeft: '6px'
                                }} onClick={() => {
                                    navigator.clipboard.writeText(`${row['id']}`);
                                    setSnackbarMessage("ID");
                                    setCopied(true);
                                }} />
                            </Box>
                        );
                    })}
                </Typography>
            </Box>
            <Snackbar 
                open={copied}
                onClose={() => {setCopied(false)}}
                message={`Copied ${snackbarMessage} to clipboard`}
                autoHideDuration={2000}
            />
        </Box>
    );
}