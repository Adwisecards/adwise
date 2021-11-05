// import { FileMediaService } from "./implementation/FileMediaService";
import path from 'path';
import { configProps } from '../config';

import { GoogleMediaService } from "./implementation/GoogleMediaService";

// const mediaService = new FileMediaService(path.resolve(__dirname, '..', 'server', 'implementation', 'public'));

const mediaService = new GoogleMediaService(path.join(__dirname, 'implementation', 'cert', 'google_storage.json'), configProps.storageBucketName, configProps.storageBucketUrl, configProps.storageBucketFolder);

export {
    mediaService
};