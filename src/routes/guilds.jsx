import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Paper, TableContainer, Toolbar, Tooltip, Typography, IconButton, Divider } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

const columns = [
    {id: 'id', numeric: true, disablePadding: true, label: 'ID'},
    {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
    {id: 'icon', numeric: false, disablePadding: true, label: 'Icon'},
    {id: 'owner', numeric: false, disablePadding: true, label: 'Owner'},
    {id: 'member_count', numeric: true, disablePadding: true, label: 'Members'},
    {id: 'description', numeric: false, disablePadding: true, label: 'Description'},
    {id: 'features', numeric: false, disablePadding: true, label: 'Features'},
    {id: 'premium_tier', numeric: true, disablePadding: true, label: 'Premium Tier'},
    {id: 'first_seen', numeric: true, disablePadding: true, label: 'First Seen'},
]

// const rows = [
//     {id: 1, name: 'Guild 1', icon: 'https://i.imgur.com/XyqQZ.png', owner: 'Owner 1', member_count: 1, description: 'Description 1', features: 'Features 1', premium_tier: 'Premium Tier 1', first_seen: 'First Seen 1'},
//     {id: 2, name: 'Guild 2', icon: 'https://i.imgur.com/XyqQZ.png', owner: 'Owner 2', member_count: 2, description: 'Description 2', features: 'Features 2', premium_tier: 'Premium Tier 2', first_seen: 'First Seen 2'},
// ]

function descComp(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descComp(a, b, orderBy)
        : (a, b) => -descComp(a, b, orderBy);
}

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => { onRequestSort(event, property); };

    return (
        <TableHead>
            <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        align={column.numeric ? 'right' : 'left'}
                        padding={column.disablePadding ? 'normal' : 'none'}
                        sortDirection={orderBy === column.id ? order : false}
                        style={{ fontWeight: 'bold' }}
                    >
                        <TableSortLabel
                            active={orderBy === column.id}
                            direction={orderBy === column.id ? order : 'asc'}
                            onClick={createSortHandler(column.id)}
                        >
                            {column.label}
                            {orderBy === column.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
}

const EnhancedTableToolbar = (props) => {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%', padding: '0.8rem', fontWeight: 'light' }}
                color="inherit"
                variant="h3"
                component="div"
                id="tableTitle"
            >
                Guilds
            </Typography>
            {/* <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
            </Tooltip> */}
        </Toolbar>
    );
}

function getSmallerIcon(url) {
    try {
        url = new URL(url);
        url.searchParams.set('size', '64');
        url.search = url.searchParams.toString();
        return url.toString();
    } catch {
        return "#";
    }
}

export default function Guilds() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    const [retry, setRetry] = React.useState(false);

    const handlerRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetch(`http://localhost:8080/guilds?limit=${rowsPerPage}&offset=${rowsPerPage * page}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    for (let i = 0; i < result['guilds'].length; i++) {
                        result['guilds'][i]['first_seen'] = new Date(result['guilds'][i].first_seen * 1000).toLocaleDateString();
                        result['guilds'][i]['features'] = result['guilds'][i].features.join(', ');
                        result['guilds'][i]['owner'] = result['guilds'][i].owner.name + ` (${result['guilds'][i].owner.id})`;
                    }
                    setRows(result['guilds']);
                    setRetry(false);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [page, rowsPerPage, retry]);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    if (error) {
        return (
            <Box sx={{ width: '80%', margin: "auto" }}>
                <Paper sx={{ width: '100%', mb: 2, padding: '36px' }}>
                    <Typography variant="h5" component="h3">
                        Error: {error.message}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => {setRetry(true)}} sx={{ margin: '12px' }}>Retry</Button>
                </Paper>
            </Box>
        )
    } else if (!isLoaded) {
        return (
            <Box sx={{ width: '80%', margin: "auto" }}>
                <Paper sx={{ width: '100%', mb: 2, padding: '36px' }}>
                    <Typography variant="h5" component="h3">
                        Loading...
                    </Typography>
                </Paper>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '80%', margin: "auto" }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handlerRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows.slice().sort(getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-row-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.id}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                align="left"
                                                sx={{ paddingLeft: '16px' }}
                                            >
                                                {row.id}
                                            </TableCell>
                                            <TableCell align="left">{row.name}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title={<><img src={getSmallerIcon(row.icon)} alt="Server icon"/></>} placement="top" arrow>
                                                    <Button onClick={() => window.open(row.icon, '_blank', 'noopener, noreferrer')} disabled={(row.icon !== "None") ? false : true}>Link</Button>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="left">{row.owner}</TableCell>
                                            <TableCell align="right">{row.member_count.toLocaleString()}</TableCell>
                                            <Tooltip title={row.description} placement="top" arrow>
                                                <TableCell align="left" sx={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '200px',
                                                }}>{row.description}</TableCell>
                                            </Tooltip>
                                            <Tooltip title={row.features} placement="top" arrow>
                                                <TableCell align="right" sx={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '200px',
                                                }}>{row.features}</TableCell>
                                            </Tooltip>
                                            <TableCell align="right">{row.premium_tier}</TableCell>
                                            <TableCell align="right">{row.first_seen}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows, }}></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}