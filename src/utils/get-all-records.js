const { parseRes, checkMetaAndStatus, checkDataPropertyExists, checkDataIsNotEmpty } = require('./parse-res');

function getAllRecords(vvClient, queryName, q = '') {
    const limit = 2000; // getCustomQueryResultsByName limit
    let offset = 0; // Start on the first page
    let records = [];
    let resLength = 0;

    function getRecords(queryName, q) {
        const shortDescription = `Get ${queryName}, offset= ${offset}`;
        const customQueryData = {
            limit,
            q,
            offset,
            sort: 'vvCreateDate',
            sortdir: 'asc',
        };

        return vvClient.customQuery
            .getCustomQueryResultsByName(queryName, customQueryData)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription))
            .then((res) => {
                records.push(...res.data);
                resLength = res.data.length;
                // Move to the next page
                offset += limit;
                // If there are more records to get, call getRecords recursively
                // If not, return all the gathered records
                return resLength === limit ? getRecords(queryName, q) : records;
            });
    }

    return getRecords(queryName, q);
}

module.exports = getAllRecords;
