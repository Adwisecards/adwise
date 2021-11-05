const formatUnicode = (message) => {

    message = message.replace(/&nbsp;/g, '\n');
    message = message.replace(/&laquo;/g, '«');
    message = message.replace(/&raquo;/g, '»');
    message = message.replace(/&gt;/g, '>');
    message = message.replace(/&lt;/g, '<');
    message = message.replace(/<br \/>/g, '\n');

    return message
};
const formatJodit = (message) => {
    if (message.indexOf('<span') === -1) {
        return message
    }

    return `${message.split('<span')[0]}${message.split('span>')[1]}`
};

export {
    formatUnicode,
    formatJodit
}
