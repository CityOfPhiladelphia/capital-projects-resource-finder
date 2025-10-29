import { test as setup, expect } from '@playwright/experimental-ct-vue';
import { STORAGE_PROJECTS } from '../playwright-ct.config';
import fs from 'fs';

setup('create new database', async ({ request }) => {
  console.log('creating new database...');
  const cartoURL = `https://phl.carto.com/api/v2/sql?q=`
  const sqlQuery = `
  SELECT site_code,
    COALESCE(lat, 0) AS lat,
    COALESCE(lon, 0) AS lon,
    site_name,
    site_address,
    client_category AS site_category,
    council_district,
  ARRAY(
    SELECT jsonb_build_object(
      'project_name', t.project_name,
      'project_category', t.client_category,
      'project_scope',  t.project_scope,
      'project_status', t.project_status,
      'project_estimated_cost', t.project_estimated_cost,
      'estimated_completion_season', t.estimated_completion_season,
      'estimated_completion_year', t.estimated_completion_year,
      'actual_completion', t.actual_completion,
      'archive_date',  t.archive_date,
      'project_coordinator', t.project_coordinator,
      'inspector', t.inspector,
      'contact_email', t.contact_email,
      'website_link', t.website_link,
      'fields_hash', t.fields_hash
    )
    FROM capital_projects_for_finder t
    WHERE site_code = (
      SELECT mode() WITHIN GROUP ( ORDER BY site_code )
      FROM capital_projects_for_finder
    )
    LIMIT 6
   ) AS projects
  FROM (TABLE capital_projects_for_finder ORDER BY site_code, site_name, site_address, council_district, lat, lon) sites
  WHERE site_code = (
    SELECT mode() WITHIN GROUP ( ORDER BY site_code )
    FROM capital_projects_for_finder
    )
    LIMIT 1
`

  const response = await request.get(cartoURL + sqlQuery);
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
