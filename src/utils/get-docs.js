const { parseRes, checkMetaAndStatus, checkDataPropertyExists, checkDataIsNotEmpty } = require('../utils/parse-res');

function getDocs(vvClient, folderPath, filterFn) {
    try {
        const errorDescription = `An error occurred while retrieving the documents from ${folderPath}.`;
        const getDocsParams = {
            q: `FolderPath = '${folderPath}'`,
            sort: 'CreateDate',
            sortDir: 'ASC',
        };

        return vvClient.documents
            .getDocuments(getDocsParams)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, errorDescription))
            .then((res) => checkDataPropertyExists(res, errorDescription))
            .then((res) => checkDataIsNotEmpty(res, errorDescription))
            .then((res) => res.data.filter(filterFn)); // Only docs from matching filter
    } catch (error) {
        console.log(error);
    }
}

module.exports = getDocs;
