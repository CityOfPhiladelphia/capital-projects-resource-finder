import { formatSiteOrProjectName as formatSiteName } from '../general/helperFunctions'
import { normalizeCategory as normalizeSiteCategory } from '../general/helperFunctions'

/*
 * FUNCTIONS FOR CLEANING AND FORMATTING DATA FROM CARTO
 */

// gives app the best chance of displaying a site name, rather than a site name with the project description
const getShortestSiteName = (siteNames) => {
  let shortestLength = siteNames[0].length;
  let shortestName = siteNames[0];
  for (let i = 1; i < siteNames.length; i++) {
    shortestName = siteNames[i].length < shortestLength ? siteNames[i] : shortestName;
  }
  return formatSiteName(shortestName);
}

const sqlQuery = `
  SELECT
    site_code,
    COALESCE(
      lat,
      (SELECT lat
        FROM capital_projects_for_finder l1
        WHERE sites.site_code = l1.site_code
        AND sites.lat IS NOT NULL
        LIMIT 1),
      0) AS lat,
    COALESCE(
      lon,
      (SELECT lon
        FROM capital_projects_for_finder l2
        WHERE sites.site_code = l2.site_code
        AND sites.lon IS NOT NULL
        LIMIT 1),
      0) AS lon,
    array_agg(DISTINCT site_name) FILTER (WHERE site_name IS NOT NULL) AS site_name,
    array_agg(DISTINCT site_address) FILTER (WHERE site_address IS NOT NULL) AS site_address,
    array_agg(DISTINCT client_category) FILTER (WHERE client_category IS NOT NULL) AS site_category,
    array_agg(DISTINCT council_district) FILTER (WHERE council_district IS NOT NULL) AS council_district,
    ARRAY(
      SELECT jsonb_build_object(
        'project_name', projects.project_name,
        'project_category', projects.client_category,
        'project_scope',  projects.project_scope,
        'project_status', projects.project_status,
        'project_estimated_cost', projects.project_estimated_cost,
        'estimated_completion_season', projects.estimated_completion_season,
        'estimated_completion_year', projects.estimated_completion_year,
        'actual_completion', projects.actual_completion,
        'archive_date',  projects.archive_date,
        'project_coordinator', projects.project_coordinator,
        'inspector', projects.inspector,
        'contact_email', projects.contact_email,
        'website_link', projects.website_link,
        'fields_hash', projects.fields_hash)
      FROM capital_projects_for_finder projects
      WHERE sites.site_code = projects.site_code
        AND sites.lat = COALESCE(
          projects.lat,
          (SELECT lat
            FROM capital_projects_for_finder l1
            WHERE projects.site_code = l1.site_code
            AND projects.lat IS NOT NULL LIMIT 1),
          0)
        AND sites.lon = COALESCE(
          projects.lon,
          (SELECT lon
            FROM capital_projects_for_finder l2
            WHERE projects.site_code = l2.site_code
            AND projects.lon IS NOT NULL LIMIT 1),
          0)
    ) AS projects
  FROM (TABLE capital_projects_for_finder ORDER BY site_code, site_name, site_address, council_district, lat, lon) sites
  GROUP BY site_code, lat, lon
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


      data.rows.forEach((row, i, original) => {

        row.site_name = getShortestSiteName(row.site_name);
        row.site_address = Array.isArray(row.site_address) ? row.site_address[0] : row.site_address;
        row.site_category = normalizeSiteCategory(row.site_category);
        row.council_district = Array.isArray(row.council_district) ? row.council_district[0] : row.council_district;

        // const seenSites = {};
        // const iRemoved = [];

        //   row.site_name = Array.isArray(row.site_name) ? row.site_name : [row.site_name];
        //   const siteName = getShortestSiteName(row.site_name);

        //   row.site_name.concat(siteName).forEach((name) => {
        //     seenSites[name] = seenSites[name] ? Math.min(i, seenSites[name]) : i;
        //   })

        //   const j = seenSites[siteName];
        //   if (j < i) {
        //     original[j].site_name = getShortestSiteName([original[j].site_name, siteName]);
        //     original[j].site_category = normalizeSiteCategory(original[j].site_category.concat(row.site_category));
        //     original[j].projects = original[j].projects.concat(row.projects);
        //     iRemoved.push(i);
        //   }
        //   else {
        //     row.site_name = siteName;
        //     row.site_address = Array.isArray(row.site_address) ? row.site_address[0] : row.site_address;
        //     row.site_category = normalizeSiteCategory(row.site_category);
        //     row.council_district = Array.isArray(row.council_district) ? row.council_district[0] : row.council_district;
        //   }

        // })

        // iRemoved.forEach((i, j) => {
        //   data.rows.splice(i - j, 1)
      })

      if (import.meta.env.VITE_DEBUG) console.log('capitalProjects data:', data);

      /*
      ////////////////////////////////////////////////// TEMP FIXES FOR DATA //////////////////////////////////////////////////////////////
      */

      const stdStatuses = ['Construction', 'Design', 'Complete', 'Planning'];
      const councilDistricts = new Set();
      data.rows.forEach((site) => {
        // FIX DISTRICT AND STATUS
        site.council_district = parseInt(site.council_district) ? site.council_district : "0";
        councilDistricts.add(site.council_district)
        site.projects.forEach((project) => {
          const statuses = new Set();
          project.project_status = stdStatuses.includes(project.project_status) ? project.project_status : "Planning";
          statuses.add(project.project_status)
          // console.log("STATUSES: ", [...statuses])
        })
      })
      // console.log("DISTRICTS: ", [...councilDistricts])

      /*
      /////////////////////////////////////////////////////////// END TEMP FIXES //////////////////////////////////////////////////
      */


      /*
      ////////////////////////////////////////////////// TEMP TESTING AND DATA CLEANING ///////////////////////////////////////////////
      */
      // REMOVE WHERE SCOPE AND COST ARE THE SAME
      // let duplicateProjects = {};
      // data.rows.forEach((site) => {
      //   if (site.projects.length > 1) {
      //     const possibleDuplicates = new Set();
      //     for (let i = 0; i < site.projects.length - 1; i++) {
      //       const currentProject = site.projects[i];

      //       for (let j = i + 1; j < site.projects.length; j++) {
      //         const otherProject = site.projects[j];
      //         if (!!currentProject.project_estimated_cost &&
      //           currentProject.project_estimated_cost !== 'TBD' &&
      //           currentProject.project_estimated_cost === otherProject.project_estimated_cost &&
      //           currentProject.project_scope === otherProject.project_scope
      //         ) {
      //           // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
      //           // console.log(currentProject)
      //           // console.log(otherProject)
      //           // possibleDuplicates.add(currentProject);
      //           // possibleDuplicates.add(otherProject);
      //           site.projects = [...site.projects.slice(0, j), ...site.projects.slice(j + 1)]
      //         }
      //       }
      //     }
      //     if (possibleDuplicates.size) {
      //       duplicateProjects[site.site_name] = [...possibleDuplicates]
      //     }
      //   }
      // })
      // console.log("SAME COST AND SCOPE: ", duplicateProjects)

      // console.log("AFTER CLEANING 1.....................")
      // console.log(reorderedData)

      // FIND WHERE SITE AND COST ARE THE SAME
      // let duplicateProjects = {};
      // reorderedData.forEach((site) => {
      //   if (site.projects.length > 1) {
      //     const possibleDuplicates = new Set();
      //     for (let i = 0; i < site.projects.length - 1; i++) {
      //       const currentProject = site.projects[i];

      //       for (let j = i + 1; j < site.projects.length; j++) {
      //         const otherProject = site.projects[j];
      //         if (!!currentProject.project_estimated_cost &&
      //           currentProject.project_estimated_cost !== 'TBD' &&
      //           currentProject.project_estimated_cost === otherProject.project_estimated_cost
      //         ) {
      //           // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
      //           // console.log(currentProject)
      //           // console.log(otherProject)
      //           possibleDuplicates.add(currentProject);
      //           possibleDuplicates.add(otherProject);
      //           // site.projects = [...site.projects.slice(0, j), ...site.projects.slice(j + 1)]
      //         }
      //       }
      //     }
      //     if (possibleDuplicates.size) {
      //       duplicateProjects[site.site_name] = [...possibleDuplicates]
      //     }
      //   }
      // })
      // console.log("SAME COST AND SITE: ", duplicateProjects)

      /*
      ////////////////////////////////////////////////// END TEMP TESTING AND DATA CLEANING /////////////////////////////////////////////
      */

      return data.rows;
    },
  }
};
