import { test as teardown } from '@playwright/experimental-ct-vue';
import { STORAGE_PROJECTS } from '../playwright-ct.config';
import fs from 'fs';

teardown('delete database', async ({ }) => {
  console.log('deleting test database...');
  // Delete the database
  try {
    fs.unlinkSync(STORAGE_PROJECTS);
    console.log('File removed:', STORAGE_PROJECTS);
  } catch (err) {
    console.error(err);
  }
});
