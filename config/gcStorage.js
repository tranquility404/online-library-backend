import { Storage } from '@google-cloud/storage';
import fs from 'fs';

export function connectToGc() {
  const keyFilePath = process.env.GC_STORAGE_KEY;
  console.log(keyFilePath);

  if (!fs.existsSync(keyFilePath)) {
    console.log('Google Service account key NOT found');
    return;
  }

  // const fileContents = fs.readFileSync(keyFilePath, 'utf-8');
  // console.log(fileContents);

  // const keyData = JSON.parse(fileContents);
  // console.log(keyData);

  const storage = new Storage({
    keyFilename: keyFilePath
  });

  // console.log(await storage.getBuckets());

  return storage;
}