const formatUnicode = (message) => {

    // message = message.replace(/&nbsp;/g, '\n');
    message = message.replace(/&laquo;/g, '«');
    message = message.replace(/&raquo;/g, '»');
    message = message.replace(/&gt;/g, '>');
    message = message.replace(/&lt;/g, '<');
    message = message.replace(/<br>/g, '<br/>');
    // message = message.replace(/<br \/>/g, '\n');

    return message
};

export {
    formatUnicode
}
