const { parseRes, checkMetaAndStatus, checkDataPropertyExists, checkDataIsNotEmpty } = require('../utils/parse-res');
const individualMapping = require('../mappings/individual-fields-mapping');

function isValidDate(dateStr) {
    // Check that dateStr is a string and not null, undefined, or empty (including strings with only white space)
    if (typeof dateStr !== 'string' || !dateStr.trim()) {
        return false;
    }

    // Create a Date object and check its validity
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

function createIndividual(vvClient, csvIndv, IndividualFormTemplate) {
    try {
        // 1° INDIVIDUAL DATA PROCESSING

        const startDate = csvIndv.StartDate;
        const birthDate = csvIndv.BirthDate;
        const birthDatePlus38Months = birthDate.addMonths(38);
        const youngerThan38MonthsOnStartDate = Date.compare(birthDatePlus38Months, startDate) === -1 ? true : false; // 1 = greater, -1 = less than,

        if (!isValidDate(startDate)) {
            throw new Error(`The CSV Individual ${csvIndv.ESITClientId} has a non-valid start date.`);
        }

        if (!youngerThan38MonthsOnStartDate) {
            throw new Error(`The CSV Individual ${csvIndv.ESITClientId} has a non-valid start date.`);
        }

        // 2° INDIVIDUAL RECORD CREATION

        // TODO: implement, params are not set
        const shortDescription = `Create Individual ${csvIndv.ESITClientId}`;
        const newIndvData = {};
        // Map the CSV value to VV fields
        individualMapping.forEach(({ csvColumnName, vvFieldName }) => {
            newIndvData[vvFieldName] = csvIndv[csvColumnName];
        });

        return vvClient.forms
            .postForms(null, newIndvData, IndividualFormTemplate)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription))
            .then(() => newIndvData);
    } catch (error) {
        // TODO: Error handling
    }
}

module.exports = createIndividual;
