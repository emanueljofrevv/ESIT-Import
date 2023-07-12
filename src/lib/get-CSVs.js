const getDocs = require('../utils/get-docs');
const getFiles = require('../utils/get-files');

async function getCSVs(vvClient, folderPath, fileFilter) {
    // 1° GET DOCUMENTS FORM DOCUMENT LIBRARY

    try {
        const docs = await getDocs(vvClient, folderPath, fileFilter);
        const files = await getFiles(vvClient, docs);

        return files;
    } catch (error) {
        console.log(error);
    }
}

module.exports = getCSVs;
