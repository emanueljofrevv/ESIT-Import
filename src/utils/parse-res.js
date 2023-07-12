function parseRes(vvClientRes) {
    /*
        Generic JSON parsing function
        Parameters:
                vvClientRes: JSON response from a vvClient API method
        */
    try {
        // Parses the response in case it's a JSON string
        const jsObject = JSON.parse(vvClientRes);
        // Handle non-exception-throwing cases:
        if (jsObject && typeof jsObject === 'object') {
            vvClientRes = jsObject;
        }
    } catch (e) {
        // If an error ocurrs, it's because the resp is already a JS object and doesn't need to be parsed
    }
    return vvClientRes;
}

function checkMetaAndStatus(vvClientRes, errorDescription, ignoreStatusCode = 999) {
    /*
        Checks that the meta property of a vvCliente API response object has the expected status code
        Parameters:
                vvClientRes: Parsed response object from a vvClient API method
                errorDescription: A string with a short description of the process
                ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkData(), make sure to pass the same param as well.
        */
    if (!vvClientRes.meta) {
        throw new Error(`${errorDescription} error. No meta object found in response. Check method call parameters and credentials.`);
    }

    const status = vvClientRes.meta.status;

    // If the status is not the expected one, throw an error
    if (status != 200 && status != 201 && status != ignoreStatusCode) {
        const errorReason = vvClientRes.meta.errors && vvClientRes.meta.errors[0] ? vvClientRes.meta.errors[0].reason : 'unspecified';
        throw new Error(`${errorDescription} error. Status: ${vvClientRes.meta.status}. Reason: ${errorReason}`);
    }
    return vvClientRes;
}

function checkDataPropertyExists(vvClientRes, errorDescription, ignoreStatusCode = 999) {
    /*
        Checks that the data property of a vvCliente API response object exists 
        Parameters:
                res: Parsed response object from the API call
                errorDescription: A string with a short description of the process
                ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkMeta(), make sure to pass the same param as well.
        */
    const status = vvClientRes.meta.status;

    if (status != ignoreStatusCode) {
        // If the data property doesn't exist, throw an error
        if (!vvClientRes.data) {
            throw new Error(`${errorDescription} data property was not present. Please, check parameters and syntax. Status: ${status}.`);
        }
    }

    return vvClientRes;
}

function checkDataIsNotEmpty(vvClientRes, errorDescription, ignoreStatusCode = 999) {
    /*
        Checks that the data property of a vvCliente API response object is not empty
        Parameters:
                res: Parsed response object from the API call
                errorDescription: A string with a short description of the process
                ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkMeta(), make sure to pass the same param as well.
        */
    const status = vvClientRes.meta.status;

    if (status != ignoreStatusCode) {
        const dataIsArray = Array.isArray(vvClientRes.data);
        const dataIsObject = typeof vvClientRes.data === 'object';
        const isEmptyArray = dataIsArray && vvClientRes.data.length == 0;
        const isEmptyObject = dataIsObject && Object.keys(vvClientRes.data).length == 0;

        // If the data is empty, throw an error
        if (isEmptyArray || isEmptyObject) {
            throw new Error(`${errorDescription} returned no data. Please, check parameters and syntax. Status: ${status}.`);
        }
        // If it is a Web Service response, check that the first value is not an Error status
        if (dataIsArray) {
            const firstValue = vvClientRes.data[0];

            if (firstValue == 'Error') {
                throw new Error(`${errorDescription} returned an error. Please, check called Web Service. Status: ${status}.`);
            }
        }
    }
    return vvClientRes;
}

module.exports = {
    parseRes,
    checkMetaAndStatus,
    checkDataPropertyExists,
    checkDataIsNotEmpty,
};
