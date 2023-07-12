const toStrLC = require('../utils/to-string-to-lowercase');
const createIndividual = require('../lib/individuals-create');
const updateIndividual = require('../lib/individuals-update');

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

function isSameIndividual(csvIndv, vvIndv) {
    //  Same person
    const isSameFirstName = toStrLC(vvIndv['FirstName']) === toStrLC(csvIndv['FirstName']);
    const isSameLastName = toStrLC(vvIndv['last Name']) === toStrLC(csvIndv['LastName']);
    const isSameDOB = new Date(vvIndv['birth Date']).toString('M/d/yyyy') === new Date(csvIndv['BirthDate']).toString('M/d/yyyy');
    const isSamePerson = isSameFirstName && isSameLastName && isSameDOB;

    // Same ESIT ID
    const isSameESITid = toStrLC(vvIndv['client ESIT ID']) === toStrLC(csvIndv['ESITClientId']);

    // Same person or same ESIT ID
    return isSameESITid || isSamePerson;
}

/* -------------------------------------------------------------------------- */
/*                                  MAIN CODE                                 */
/* -------------------------------------------------------------------------- */

function processIndividuals(vvClient, csvIndvs, vvIndvs, IndividualFormTemplate) {
    csvIndvs.forEach(async (csvIndv) => {
        // 1° CHECK IF THE INDIVIDUAL EXISTS

        const preexistingRecords = vvIndvs.filter((vvIndv) => isSameIndividual(csvIndv, vvIndv));
        const doNotUpdate = preexistingRecords[0]['do Not Update'] === 'True'; // TODO: should we parse to lowecase?

        // 2° PROCESS THE INDIVIDUAL

        switch (preexistingRecords.length) {
            case 0:
                // TODO: Test is waiting before processing the next indv. If not, we can create the same indv twice
                // CREATE PATH
                // Create the individual and then add it as existing VV record in case is duplicated on the CSV
                await createIndividual(vvClient, csvIndv, IndividualFormTemplate).then((newVVIndv) => vvIndvs.push(newVVIndv));
                break;
            case 1:
                if (doNotUpdate) {
                    throw new Error(`The record for individual ${csvIndv.ESITClientId} was marked to not be imported.`);
                } else {
                    // UPDATE PATH
                    // TODO: Review what to do if there are 2 updates for the same indv in the same csv
                    await updateIndividual(vvClient, csvIndv, preexistingRecords[0], IndividualFormTemplate);
                }
                break;
            default:
                throw new Error(`The record for the individual ${csvIndv.ESITClientId} is duplicated ${preexistingRecords.length} times`);
        }
    });
}

module.exports = processIndividuals;
