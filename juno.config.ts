import {defineConfig} from '@junobuild/config';

export default defineConfig({
  satellite: {
    ids: {
      development: '<DEV_SATELLITE_ID>',
      production: 'v6jv3-eaaaa-aaaal-asrxa-cai'
    },
    source: 'frontend/.next'
  }
});
