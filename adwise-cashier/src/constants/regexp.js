const regexp = {
    "phone": /^\+?(\d{1}) (\d{3}) (\d{3})-(\d{2})-(\d{2})$/,
    "url": /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
}

export default regexp;
