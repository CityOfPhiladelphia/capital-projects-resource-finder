import { formatSiteOrProjectName as formatSiteName } from '../general/helperFunctions'
import { normalizeCategory as normalizeSiteCategory } from '../general/helperFunctions'

/*
 * FUNCTIONS FOR CLEANING AND FORMATTING DATA FROM CARTO
 */

// gives app the best chance of displaying a site name, rather than a site name with the project description
const getShortestSiteName = (siteNames) => {
  let shortestName = formatSiteName(siteNames[0]).split(' - ')[0];
  const shortestNameTrimmed = shortestName.match(/^.*?((?<=Community Center|Recreation Center|Playground)|.*?(?<=\)))/);
  shortestName = shortestNameTrimmed ? shortestNameTrimmed[0] : shortestName
  let shortestLength = /[a-zA-Z][/\\][a-zA-Z]/.test(shortestName) ? Infinity : shortestName.length

  for (let i = 1; i < siteNames.length; i++) {
    let nextName = formatSiteName(siteNames[i]).split(' - ')[0]
    const nextNameTrimmed = shortestName.match(/^.*?((?<=Community Center|Recreation Center|Playground)|.*?(?<=\)))/);
    nextName = nextNameTrimmed ? nextNameTrimmed[0] : nextName
    const nextLength = /[a-zA-Z][/\\][a-zA-Z]/.test(nextName) ? Infinity : shortestName.length
    shortestName = nextLength < shortestLength ? nextName : shortestName;
  }
  return shortestName
}

const sqlQuery = `
SELECT
  sites.lat AS lat,
  sites.lon AS lon,
  sites.council_district AS council_district,
  array_agg(DISTINCT sites.site_name) FILTER (WHERE sites.site_name IS NOT NULL) AS site_name,
  array_agg(DISTINCT sites.site_category) FILTER (WHERE sites.site_category IS NOT NULL) AS site_category,
  array_agg(DISTINCT project) AS projects
FROM capital_projects_for_finder sq, capital_projects_for_finder pq,
  LATERAL (
    SELECT
      COALESCE(sq.lat, (SELECT pq.lat WHERE sq.site_name = pq.site_name AND sq.council_district = pq.council_district AND pq.lat IS NOT NULL)) AS lat,
      COALESCE(sq.lon, (SELECT pq.lon WHERE sq.site_name = pq.site_name AND sq.council_district = pq.council_district AND pq.lon IS NOT NULL)) AS lon,
      sq.council_district AS council_district,
      sq.site_name AS site_name,
      sq.client_category AS site_category
  ) sites,
  LATERAL (SELECT jsonb_build_object(
    'project_name', pq.project_name,
    'project_address', pq.site_address,
    'project_category', pq.client_category,
    'project_scope', pq.project_scope,
    'project_status', pq.project_status,
    'project_estimated_cost', pq.project_estimated_cost,
    'estimated_completion_season', pq.estimated_completion_season,
    'estimated_completion_year', pq.estimated_completion_year,
    'actual_completion', pq.actual_completion,
    'archive_date', pq.archive_date,
    'project_coordinator', pq.project_coordinator,
    'inspector', pq.inspector,
    'contact_email', pq.contact_email,
    'website_link', pq.website_link,
    'fields_hash', pq.fields_hash) AS project
     ) proj
WHERE sites.lat = COALESCE(pq.lat, (SELECT sq.lat WHERE sq.site_name = pq.site_name AND sq.council_district = pq.council_district AND sq.lat IS NOT NULL))
  AND sites.lon = COALESCE(pq.lon, (SELECT sq.lon WHERE sq.site_name = pq.site_name AND sq.council_district = pq.council_district AND sq.lon IS NOT NULL))
  AND sites.council_district = pq.council_district
GROUP BY sites.council_district, sites.lat, sites.lon
`

export default {
  id: 'capital_projects',
  type: 'http-get',
  dependent: 'none',
  resettable: false,
  replaceOnSuccess: true,
  url: 'https://phl.carto.com/api/v2/sql',
  options: {
    params: {
      q: sqlQuery,
    },
    success: function (data) {
      data.rows.forEach((row) => {
        row.site_name = row.lat === null ? `Council District ${row.council_district}` : getShortestSiteName(row.site_name);
        row.site_category = normalizeSiteCategory(row.site_category);
      })

      if (import.meta.env.VITE_DEBUG) console.log('capitalProjects data:', data);

      /*
      ////////////////////////////////////////////////// TEMP FIXES FOR DATA //////////////////////////////////////////////////////////////
      */

      const stdStatuses = ['Construction', 'Design', 'Complete', 'Planning'];
      const statuses = new Set();
      const hashesSet = new Set();
      const hashesArray = [];
      data.rows.forEach((site) => {
        // FIX STATUS
        site.projects.forEach((project) => {
          statuses.add(project.project_status)
          project.project_status = stdStatuses.includes(project.project_status) ? project.project_status : "Planning";
          hashesSet.add(project.fields_hash);
          hashesArray.push(project.fields_hash)
        })
      })

      console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX")
      console.log(hashesSet.size)
      console.log(hashesArray.length)

      // console.log([...statuses])
      // console.log([...hashes])


      /*
      /////////////////////////////////////////////////////////// END TEMP FIXES //////////////////////////////////////////////////
      */

      return data.rows;
    },
  }
};
