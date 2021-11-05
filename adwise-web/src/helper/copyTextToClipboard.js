function fallbackCopyTextToClipboard(text) {
    var input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.focus();
    input.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(input);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }

    navigator.clipboard.writeText(text).then(function() {
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

export default copyTextToClipboard
