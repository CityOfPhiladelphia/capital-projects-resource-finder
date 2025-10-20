/*
 * FUNCTIONS FOR CLEANING AND FORMATTING DATA FROM CARTO
 */

// function for consolidating different projects into the site where they occur
const reorderData = (data) => {
  return Array.from(data.rows, (row) => {
    return new Object({
      site_name: getShortestSiteName(row.site_name),
      site_address: Array.isArray(row.site_address) ? row.site_address[0] : row.site_address,
      site_category: normalizeSiteCategory(row.site_category),
      council_district: Array.isArray(row.council_district) ? row.council_district[0] : row.council_district,
      lat: Array.isArray(row.lat) ? row.lat[0] : row.lat,
      lon: Array.isArray(row.lon) ? row.lon[0] : row.lat,
      projects: row.projects
    })
  })
}

// gives app the best chance of displaying a site name, rather than a site name with the project description
const getShortestSiteName = (siteNames) => {
  let shortestLength = siteNames[0].length;
  let shortestName = siteNames[0];
  for (let i = 1; i < siteNames.length - 1; i++) {
    shortestName = siteNames[i].length < shortestLength ? siteNames[i] : shortestName;
  }
  return formatSiteOrProjectName(shortestName, true);
}

// reformats the site and project names to Title Case
// uses regex to expand some abbreviations back to full words, e.g. bb => basketball
const formatSiteOrProjectName = (rawString, isSiteName) => {
  //rawString = rawString.includes(' - ') ? isSiteName ? rawString.split(' - ')[0] : rawString.split(' - ')[1] : rawString;
  rawString.split(' ').filter(Boolean).forEach((word, i, sentence) => {
    word = word.length > 2 ? word.replace(/^[a-z]/, word.charAt(0).toUpperCase()) : word;
    switch (true) {
      case /^A[Nn][Dd]\b/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/^A[Nn][Dd]\b/, '&'))
        break;
      }
      case /^F[Dd][Rr]\b/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/^F[Dd][Rr]\b/, 'FDR'))
        break;
      }
      case /^B[Bb]\b/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/^B[Bb]\b/, 'Basketball'))
        break;
      }
      case /^P[Gg]|P\/[Gg]\b/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/^P[Gg]|P\/[Gg]\b/, 'Playground'))
        break;
      }
      case /^R[Cc]\b/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/^R[Cc]\b/, 'Recreation Center'))
        break;
      }
      case /^R[Ee][Cc]\b/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/^R[Ee][Cc]\b/, 'Recreation'))
        break;
      }
      case /^C[Rr][Cc]\b/.test(word): {
        rawString = rawString.replace(sentence[i], word.replace(/^C[Rr][Cc]\b/, 'Community Center'))
        break;
      }
      default: {
        rawString = rawString.replace(sentence[i], word)
        break;
      }
    }
  })
  return rawString.trim()
}

// gives each site a standard category value
// goes through each project at a site and checks for a department title's keyword after shifting the project's client_category to lowercase
// keyword checks and lowercase will allow for some amount of variation of formatting and spelling in the data still being recognized as the same department
// eg. 'parks & rec' and 'Parks and Recreation' will both reduce to 'parks'
// matched keywords are added to a Set to ensure no duplicates
// client_categories that do no match a keyword are stipped of all special characters and added to the set in all lowercase to give the best chance of matching other non-keyword departments
// if the size of the Set is greater than 1, returns 'multiple' for multiple client_categories having projects at the site
// otherwise if the item in the set is the keyword categories, it returns that item
// unreccognized client_categories get returned as 'other'
const normalizeSiteCategory = (projectCategories) => {
  const categories = new Set();
  const normalizedCategories = ['parks', 'health', 'library', 'fire', 'police', 'property'];
  projectCategories.forEach((projectCategory) => {
    let matchedAny = false;
    normalizedCategories.forEach((normalizedCategory) => {
      const matchedThis = projectCategory.toLowerCase().includes(normalizedCategory);
      if (matchedThis) { categories.add(normalizedCategory) }
      matchedAny |= matchedThis;
    })
    if (!matchedAny) { categories.add(projectCategory.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')) }
  })
  if (categories.size > 1) { return 'multiple' }
  return normalizedCategories.includes([...categories][0]) ? [...categories][0] : 'other';
}

const formatProjectNames = (projects) => {
  projects.forEach((project) => {
    project.project_name = formatSiteOrProjectName(project.project_name, false);
  })
  return projects;
}

const trimProjectName = (project_name, site_name) => {
  let nameCopy = project_name;
  site_name.toLowerCase().split(' ').forEach((word) => {
    if (!nameCopy.toLowerCase().split(word)[0]) { nameCopy = nameCopy.slice(word.length).trim() }
  })
  return nameCopy.length && nameCopy.length < project_name.length ? nameCopy : project_name;
}

const sqlQuery = `
SELECT DISTINCT site_code, site_name, site_address, site_category, council_district, lat, lon, projects
FROM (
  SELECT site_code,
  array_agg(DISTINCT site_name) FILTER (WHERE site_name IS NOT NULL) AS site_name,
  array_agg(DISTINCT site_address) FILTER (WHERE site_address IS NOT NULL) AS site_address,
  array_agg(DISTINCT client_category) FILTER (WHERE client_category IS NOT NULL) AS site_category,
  array_agg(DISTINCT council_district) FILTER (WHERE council_district IS NOT NULL) AS council_district,
  array_agg(DISTINCT lat) FILTER (WHERE lat IS NOT NULL) AS lat,
  array_agg(DISTINCT lon) FILTER (WHERE lon IS NOT NULL) AS lon,
  ARRAY(
    SELECT jsonb_build_object(
      'project_name', t.project_name,
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
    FROM  capital_projects_for_finder t
    WHERE sites.site_code = site_code
   ) AS projects
  FROM  (TABLE capital_projects_for_finder ORDER BY site_code, site_name, site_address, council_district, lat, lon) sites
  GROUP  BY 1
  ORDER  BY 1
  ) subquery
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
      if (import.meta.env.VITE_DEBUG) console.log('capitalProjects data:', data);

      /*
      ////////////////////////////////////////////////// TEMP FIXES FOR DATA //////////////////////////////////////////////////////////////
      */

      // const stdStatuses = ['Construction', 'Design', 'Complete', 'Planning'];
      // const statuses = new Set();
      // const councilDistricts = new Set();
      // const projectsAsSites = new Set(); // LIST OF SITES WHERE PROJECT NAME IS ALSO SITE NAME
      // data.rows.forEach((row) => {
      //   // FIX DISTRICT AND STATUS
      //   row.council_district = parseInt(row.council_district) ? row.council_district.charAt(0) : "0";
      //   row.project_status = stdStatuses.includes(row.project_status) ? row.project_status : "Planning";

      //   statuses.add(row.project_status)
      //   councilDistricts.add(row.council_district)
      //   if (row.project_name === row.site_name) { projectsAsSites.add(row.site_name) }
      // })
      // console.log("STATUSES: ", [...statuses])
      // console.log("DISTRICTS: ", [...councilDistricts])
      // console.log("PROJECT NAME SAME AS SITE: ", [...projectsAsSites])

      /*
      /////////////////////////////////////////////////////////// END TEMP FIXES //////////////////////////////////////////////////
      */

      const reorderedData = reorderData(data);
      if (import.meta.env.VITE_DEBUG) console.log('reorderedData:', reorderedData);

      /*
      ////////////////////////////////////////////////// TEMP FIXES FOR DATA //////////////////////////////////////////////////////////////
      */

      const stdStatuses = ['Construction', 'Design', 'Complete', 'Planning'];
      const councilDistricts = new Set();
      reorderedData.forEach((site) => {
        // FIX DISTRICT AND STATUS
        site.council_district = parseInt(site.council_district) ? site.council_district.charAt(0) : "0";
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
      // reorderedData.forEach((site) => {
      //   if (site.projects.length > 1) {
      //     // const possibleDuplicates = new Set();
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
      //     // if (possibleDuplicates.size) {
      //     //   duplicateProjects[site.site_name] = [...possibleDuplicates]
      //     // }
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

      return reorderedData;
    },
  }
};
