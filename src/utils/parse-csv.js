const csv = require('csv'); // csv parser
const { Readable } = require('stream'); // convert buffer to stream

async function parseCSV(buffer) {
    const errorLog = [];
    // 1° Convert the buffer to a readable stream
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    // 2° Parse the CSV from the stream
    const parser = csv.parse({
        auto_parse: true,
        columns: true,
        delimiter: '|',
        skip_empty_lines: true,
    });
    bufferStream.pipe(parser);

    // 3° Handle the parsed CSV data
    const records = [];

    parser.on('readable', () => {
        let record;
        while ((record = parser.read())) {
            records.push(record);
        }
    });

    parser.on('error', (error) => {
        // Handle any parsing errors
        // TODO: Error handling
        errorLog.push(error);
    });

    // Wait for parsing to finish
    await new Promise((resolve) => {
        parser.on('end', resolve);
    });

    // Return the parsed records array
    return records;
}

module.exports = parseCSV;
