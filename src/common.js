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


export function getSmallerIcon(url) {
    try {
        url = new URL(url);
        url.searchParams.set('size', '64');
        url.search = url.searchParams.toString();
        return url.toString();
    } catch {
        return "#";
    }
}