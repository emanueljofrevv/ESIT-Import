const { parseRes, checkMetaAndStatus, checkDataPropertyExists, checkDataIsNotEmpty } = require('../utils/parse-res');
const toStrLC = require('../utils/to-string-to-lowercase');
const raceMapping = require('../mappings/race-ethnicity-mapping');
const individualMapping = require('../mappings/individual-fields-mapping');

function updateIndividual(vvClient, csvIndv, vvIndv, IndividualFormTemplate) {
    try {
        const formFieldsToUpdate = getIndividualRecordFieldsToUpdate(csvIndv, vvIndv);
        const areFieldsToUpdate = Object.keys(formFieldsToUpdate).length;

        if (areFieldsToUpdate) {
            // TODO: Review params
            const shortDescription = `Update Individual ${csvIndv.ESITClientId}`;
            return vvClient.forms
                .postFormRevision(null, formFieldsToUpdate, IndividualFormTemplate, vvIndv.dhDocID)
                .then((res) => parseRes(res))
                .then((res) => checkMetaAndStatus(res, shortDescription))
                .then((res) => checkDataPropertyExists(res, shortDescription))
                .then((res) => checkDataIsNotEmpty(res, shortDescription));
        }
    } catch (error) {
        // TODO: Error handling
    }
}

function setEthnicity(isHispanic) {
    // TODO: Handling missing value or incorrect value type
    let ethnicity = '';

    if (isHispanic === 1 || isHispanic === true || isHispanic === 'true' || isHispanic === 'True' || isHispanic === 'TRUE') {
        ethnicity = 'Hispanic or Latino';
    } else {
        ethnicity = 'Non Hispanic or Latino';
    }

    return ethnicity;
}

function setRace(csvRace) {
    // TODO: Review that in VV there are more races than in the mapping object
    const raceMappingObj = raceMapping.find((mapping) => mapping.csvRace === csvRace);
    const vvRace = raceMappingObj.vvRace;
    return vvRace;
}

function setGender(gender) {
    if (gender == 'M' || gender == 'Male') {
        gender = 'Male';
    } else if (gender == 'F' || gender == 'Female') {
        gender = 'Female';
    }

    return gender;
}
function getIndividualRecordFieldsToUpdate(csvIndv, vvIndv) {
    const formFieldsToUpdate = {};

    // 1° ITERATE OVER EACH INDIVIDUAL RECORD FIELD

    individualMapping.forEach(({ csvColumnName, vvFieldName }) => {
        let csvValue = csvIndv[csvColumnName];
        let vvValue = vvIndv[vvFieldName];

        // 2° PARSE THE DATA TO MATCH THE VALUES ON VV DROP-DOWNS

        switch (csvColumnName) {
            case 'IsHispanic':
                // Convert the "isHispanic" value to "ethnicity" to compare with the vv field
                csvValue = setEthnicity(csvValue);
                break;
            case 'Race':
                // Convert the "race" value from the csv to match the values of the "race" drop-down on the Individual record
                csvValue = setRace(csvValue);
                break;
            case 'Gender':
                csvValue = setGender(csvValue);
                break;
            case 'BirthDate':
                csvValue = new Date(csvValue).toString('M/d/yyyy');
                vvValue = new Date(vvValue).toString('M/d/yyyy');
                break;
            default:
                break;
        }

        // TODO: Should an empty column in the CSV delete the field data on VV?

        // 3° ADD TO FIELDS TO UPDATE IF THE VALUE OF A FIELD IS DIFFERENT

        if (toStrLC(csvValue) !== toStrLC(vvValue)) {
            formFieldsToUpdate[vvFieldName] = csvValue;
        }
    });

    return formFieldsToUpdate;
}

module.export = updateIndividual;
