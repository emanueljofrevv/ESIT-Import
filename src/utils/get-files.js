async function getFiles(vvClient, vvDocs) {
    try {
        return Promise.all(vvDocs.map((doc) => vvClient.files.getFileBytesId(doc.id)));
    } catch (error) {
        console.log(error);
    }
}

module.exports = getFiles;
