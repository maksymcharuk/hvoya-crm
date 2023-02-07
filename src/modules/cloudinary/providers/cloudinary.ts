import { v2 } from 'cloudinary';

import { CLOUDINARY } from '../constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: process.env['C_CLOUD_NAME'],
      api_key: process.env['C_API_KEY'],
      api_secret: process.env['C_API_SECRET'],
    });
  },
};
