// Import necessary libraries/modules
const getAllRecords = require('./utils/get-all-records');
const getCSVs = require('./lib/get-CSVs');
const parseCSV = require('./utils/parse-csv');
const processIndividuals = require('./lib/individuals-main');
//const getRecordsFromCSVOnVV = require('./lib/getRecordsFromCSVOnVV');
//const getFiles = require('./utils/get-files');
// Export your main functionality and any other entities you want to expose

module.exports = {
    getAllRecords,
    getCSVs,
    parseCSV,
    processIndividuals,
};
