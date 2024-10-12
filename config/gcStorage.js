const { Storage } = require('@google-cloud/storage');
const path = require("path");

const keyPath = path.join(__dirname, "../config/gc_key.json");

const storage = new Storage({
    keyFilename: keyPath
});

module.exports = storage;