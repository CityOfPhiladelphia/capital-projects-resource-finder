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
    lat,
    lon,
    council_district,
    array_agg(DISTINCT site_name) FILTER (WHERE site_name IS NOT NULL) AS site_name,
    array_agg(DISTINCT client_category) FILTER (WHERE client_category IS NOT NULL) AS site_category,
    ARRAY(
      SELECT jsonb_build_object(
        'project_name', project.project_name,
        'project_category', project.client_category,
        'project_scope',  project.project_scope,
        'project_status', project.project_status,
        'project_estimated_cost', project.project_estimated_cost,
        'estimated_completion_season', project.estimated_completion_season,
        'estimated_completion_year', project.estimated_completion_year,
        'actual_completion', project.actual_completion,
        'archive_date',  project.archive_date,
        'project_coordinator', project.project_coordinator,
        'inspector', project.inspector,
        'contact_email', project.contact_email,
        'website_link', project.website_link,
        'fields_hash', project.fields_hash)
      FROM capital_projects_for_finder project
      WHERE COALESCE(sites.lat, 0) = COALESCE(project.lat, 0) AND COALESCE(sites.lon, 0) = COALESCE(project.lon, 0)
        AND sites.council_district = project.council_district
    ) AS projects
  FROM capital_projects_for_finder sites
  GROUP BY council_district, lat, lon
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
      const hashes = new Set();
      data.rows.forEach((site) => {
        // FIX STATUS
        site.projects.forEach((project) => {
          statuses.add(project.project_status)
          project.project_status = stdStatuses.includes(project.project_status) ? project.project_status : "Planning";
          hashes.has(project.fields_hash) ? console.log(project.fields_hash) : hashes.add(project.fields_hash)
        })
      })

      // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX")
      // console.log([...statuses])
      // console.log([...hashes])
      // console.log(hashes.size)

      /*
      /////////////////////////////////////////////////////////// END TEMP FIXES //////////////////////////////////////////////////
      */

      return data.rows;
    },
  }
};
