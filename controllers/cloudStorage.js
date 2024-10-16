import storage from "../config/gcStorage.js";
import data from "../data/library.books.json";

const bucketName = process.env.BOOK_BUCKET;

const json = JSON.parse(JSON.stringify(data));
const map = new Map();
for (let i = 0; i < data.length; i++) {
    map.set(data[i]._id.$oid, i);
}

export async function listFilesAndFolders(prefix = '') {
    try {
        const [files] = await storage.bucket(bucketName).getFiles();

        for(const file of files) {
            if (file.name.endsWith("jpg")) {
                const id = file.name.split("/")[1];
                await file.makePublic();
                json[map.get(id)]["thumbnail"] = `${bucketName}/${file.name}`
            }
            console.log(`File: ${file.name}`);
        };

        console.log(JSON.stringify(json));
        
    } catch (error) {
        console.error('Error listing files:', error);
    }
}