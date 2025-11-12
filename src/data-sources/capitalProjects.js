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
    sq.lat AS lat,
    sq.lon AS lon,
    sq.council_district AS council_district,
    array_agg(DISTINCT sq.site_name) FILTER (WHERE sq.site_name IS NOT NULL) AS site_name,
    array_agg(DISTINCT sq.site_category) FILTER (WHERE sq.site_category IS NOT NULL) AS site_category,
    array_agg(DISTINCT project) AS projects,
    ARRAY(SELECT DISTINCT unnest(string_to_array(lower(concat_ws(',', VARIADIC array_agg(keywords))), ','))) AS keywords
  FROM capital_projects_for_finder st, capital_projects_for_finder pt,
    LATERAL (
      SELECT
        st.lat AS lat,
        st.lon AS lon,
        st.council_district AS council_district,
        st.site_name AS site_name,
        st.client_category AS site_category
    ) sq,
    LATERAL (SELECT jsonb_build_object(
      'project_name', pt.project_name,
      'project_address', pt.site_address,
      'project_category', pt.client_category,
      'project_scope', pt.project_scope,
      'project_status', pt.project_status,
      'project_estimated_cost', pt.project_estimated_cost,
      'estimated_completion_season', pt.estimated_completion_season,
      'estimated_completion_year', pt.estimated_completion_year,
      'actual_completion', pt.actual_completion,
      'archive_date', pt.archive_date,
      'project_coordinator', pt.project_coordinator,
      'inspector', pt.inspector,
      'contact_email', pt.contact_email,
      'website_link', pt.website_link,
      'fields_hash', pt.fields_hash) AS project,
      concat_ws(',',
        regexp_replace(pt.project_name, '[^\\w]+', ',', 'g'),
        regexp_replace(pt.project_scope, '[^\\w]+', ',', 'g'),
        pt.project_coordinator,
        pt.inspector,
        pt.estimated_completion_year,
        pt.estimated_completion_season
      ) AS keywords
      ) pq
  WHERE COALESCE(sq.lat, 0) = COALESCE(pt.lat, 0)
    AND COALESCE(sq.lon, 0) = COALESCE(pt.lon, 0)
    AND sq.council_district = pt.council_district
  GROUP BY sq.council_district, sq.lat, sq.lon
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

      console.log(hashesArray.filter((value, index) =>
        hashesArray.indexOf(value) !== index && hashesArray.lastIndexOf(value) === index))

      console.log([...statuses])
      // console.log([...hashes])


      /*
      /////////////////////////////////////////////////////////// END TEMP FIXES //////////////////////////////////////////////////
      */

      return data.rows;
    },
  }
};
