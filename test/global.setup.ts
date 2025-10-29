import { test as setup, expect } from '@playwright/experimental-ct-vue';
import { STORAGE_PROJECTS } from '../playwright-ct.config';
import fs from 'fs';

setup('create new database', async ({ request }) => {
  console.log('creating new database...');
  const sqlQuery = `
    https://phl.carto.com/api/v2/sql?q=
    SELECT
      project_name,
      client_category AS project_category,
      project_scope,
      project_status,
      project_estimated_cost,
      estimated_completion_season,
      estimated_completion_year,
      actual_completion,
      archive_date,
      project_coordinator,
      inspector,
      contact_email,
      website_link,
      fields_hash
    FROM capital_projects_for_finder
    WHERE site_code = (
      SELECT mode() WITHIN GROUP ( ORDER BY site_code )
      FROM capital_projects_for_finder
    )
    LIMIT 3
  `

  const response = await request.get(sqlQuery);
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const testProjects = await response.json();
  expect(testProjects.rows).toBeTruthy();
  try {
    fs.writeFileSync(STORAGE_PROJECTS, JSON.stringify(testProjects))
  } catch (err) {
    console.error(err);
  }
});
