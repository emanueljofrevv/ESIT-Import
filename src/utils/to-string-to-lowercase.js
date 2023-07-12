// Conver a value to a lowecase trimmed string
function toStrLC(str) {
    if (typeof str !== 'string') {
        str = String(str);
    }

    return str.toLowerCase().trim();
}

module.exports = toStrLC;
