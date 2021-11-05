import queryString from "query-string";

const parseSearchUrl = (search, initialFilter) => {
    const searchObject = queryString.parse(search);
    let filter = {...initialFilter};

    Object.keys(searchObject).map((key) => {

        if ( filter[key] !== undefined ) {

            if (
                key === 'page' ||
                key === 'limit'
            ) {
                filter[key] = Number(searchObject[key]);
            } else {
                filter[key] = searchObject[key];
            }
        }

    });

    return filter;
}

export default parseSearchUrl
