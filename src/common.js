import { createTheme } from '@mui/material/styles';

// Sorting 
export function descComp(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

export const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descComp(a, b, orderBy)
        : (a, b) => -descComp(a, b, orderBy);
}

// Utilities
export function getSmallerIcon(url, size) {
    try {
        url = new URL(url);
        url.searchParams.set('size', size ? size.toString() : '64');
        url.search = url.searchParams.toString();
        return url.toString();
    } catch (e) {
        console.log(e);
        return "#";
    }
}

export function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}

export function requestSearch(input) {
    console.log(input);
}

export const theme = createTheme({
    palette: {
      mode: 'dark',
    },
});
