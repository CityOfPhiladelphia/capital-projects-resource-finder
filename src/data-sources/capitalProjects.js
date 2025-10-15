// gives each site a standard category value
// goes through each project at a site and checks for a department title's keyword after shifting the project's client_category to lowercase
// keyword checks and lowercase will allow for some amount of variation of formatting and spelling in the data still being recognized as the same department
// eg. 'parks & rec' and 'Parks and Recreation' will both reduce to 'parks'
// matched keywords are added to a Set to ensure no duplicates
// client_categories that do no match a keyword are stipped of all special characters and added to the set in all lowercase to give the best chance of matching other non-keyword departments
// if the size of the Set is greater than 1, returns 'multiple' for multiple client_categories having projects at the site
// otherwise if the item in the set is the keyword categories, it returns that item
// unreccognized client_categories get returned as 'other'
const normalizeSiteCategory = (projects) => {
  const categories = new Set();
  const normalizedCategories = ['parks', 'health', 'library', 'fire', 'police', 'property'];
  projects.forEach((project) => {
    let matchedAny = false;
    normalizedCategories.forEach((normalizedCategory) => {
      const matchedThis = project.client_category.toLowerCase().includes(normalizedCategory);
      if (matchedThis) { categories.add(normalizedCategory) }
      matchedAny |= matchedThis;
    })
    if (!matchedAny) { categories.add(project.client_category.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')) }
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

// function for consolidating different projects into the site where they occur
const reorderData = (data) => {
  return Array.from(
    data.rows.reduce((groups, obj) => {
      const category = obj['site_code'];
      if (!category || typeof category !== 'string') return groups;
      if (!groups.has(category)) { groups.set(category, []) };
      groups.get(category).push(obj);
      return groups;
    }, new Map()),
    ([site_code, value]) => ({
      'site_code': site_code,
      'site_name': getShortestSiteName(value),
      'site_category': normalizeSiteCategory(value),
      'council_district': value[0].council_district,
      'lat': value[0].lat,
      'lon': value[0].lon,
      projects: formatProjectNames(value)
    })
  );
}

const getShortestSiteName = (projects) => {
  let shortestLength = projects[0].site_name.length;
  let shortestName = projects[0].site_name;
  for (let i = 1; i < projects.length - 1; i++) {
    shortestName = projects[i].site_name.length < shortestLength ? projects[i].site_name : shortestName;
  }
  return formatSiteOrProjectName(shortestName, true);
}

const formatSiteOrProjectName = (rawString, isSiteName) => {
  rawString = rawString.includes(' - ') ? isSiteName ? rawString.split(' - ')[0] : rawString.split(' - ')[1] : rawString;
  let senCase = toSentenceCase(rawString).replace(/Martin luther king|martin luther king/, 'Martin Luther King')
  .replace(/\band\b/, '&')
  .replace(/\bFdr|fdr\b/, 'FDR')
  .replace(/\bbb\b/, 'basketball')
  .replace(/\bpg|p\/g\b/, 'playground')
  .replace(/\brc\b/, 'recreation center')
  .replace(/\brec\b/, 'recreation')
  .replace(/\bcrc\b/, 'community center');
  const splitSen = senCase.split(' ');
  const iRec = splitSen.indexOf('recreation');
  const iPlay = splitSen.indexOf('playground');
  senCase = splitSen[0].includes("'") ? senCase.replace(splitSen[0], toProperCase(splitSen[0])) : senCase;
  senCase = iRec > 1 && splitSen[iRec - 1] !== 'community' ? senCase.replace(splitSen[iRec - 1], toProperCase(splitSen[iRec - 1])) : senCase;
  senCase = iPlay > 1 ? senCase.replace(splitSen[iPlay - 1], toProperCase(splitSen[iPlay - 1])) : senCase;
  senCase = splitSen[1] === '&' ? senCase.replace(splitSen[2], toProperCase(splitSen[2])) : senCase;
  return senCase;
}

const toSentenceCase = (rawString) => {
  return rawString.charAt(0).toUpperCase() + rawString.slice(1).toLowerCase();
}

////////////////////// NEEDS TO GUARD AGAINST POSSESSIVE CASE
const toProperCase = (properNoun) => {
  const iAps = properNoun.split('').indexOf("'");
  return iAps > 0 ? `${toSentenceCase(properNoun.slice(0, iAps))}'${toSentenceCase(properNoun.slice(iAps + 1))}` : toSentenceCase(properNoun);
}

const queryFields = [
  'project_name',
  'client_category',
  'site_code',
  'site_name',
  'site_address',
  'council_district',
  'project_scope',
  'inspector',
  'project_coordinator',
  'estimated_completion_season',
  'estimated_completion_year',
  'actual_completion',
  'project_status',
  'project_estimated_cost',
  'contact_email',
  'website_link',
  'lat',
  'lon',
  'archive_date',
  'fields_hash'
]

export default {
  id: 'capital_projects',
  type: 'http-get',
  dependent: 'none',
  resettable: false,
  replaceOnSuccess: true,
  url: 'https://phl.carto.com/api/v2/sql',
  options: {
    params: {
      q: `select ${queryFields} from capital_projects_for_finder`,
    },
    success: function (data) {
      if (import.meta.env.VITE_DEBUG) console.log('capitalProjects data:', data);

      // data.rows.push(
      //   {
      //     "cartodb_id": 40,
      //     "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
      //     "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
      //     "objectid": 40,
      //     "project_number": "16381E-01-01",
      //     "project_name": "Lawncrest Rec fake 1",
      //     "client_dept": "Philadephia Parks and Recreation",
      //     "client_category": "Philadephia Parks and Recreation",
      //     "site_code": "16381E",
      //     "site_name": "Lawncrest Recreation Center",
      //     "site_address": "6000 RISING SUN AVENUE",
      //     "council_district": "9",
      //     "project_scope": "Site & Rec Center Improvements",
      //     "inspector": "TBD",
      //     "project_coordinator": "Medow",
      //     "estimated_completion_season": "Winter",
      //     "estimated_completion_year": "2025",
      //     "estimated_completion": "Late 2025",
      //     "actual_completion": null,
      //     "archive_date": null,
      //     "project_status": "Planning",
      //     "project_estimated_cost": "100",
      //     "contact_email": "CPO@phila.gov",
      //     "website_link": "https://www.phila.gov/programs/rebuild/",
      //     "lat": 40.04670039069094,
      //     "lon": -75.10160256942602
      //   },
      //   {
      //     "cartodb_id": 41,
      //     "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
      //     "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
      //     "objectid": 41,
      //     "project_number": "16381E-01-01",
      //     "project_name": "Lawncrest Rec fake 2",
      //     "client_dept": "Philadephia Parks and Recreation",
      //     "client_category": "Philadephia Parks and Recreation",
      //     "site_code": "16381E",
      //     "site_name": "Lawncrest Recreation Center",
      //     "site_address": "6000 RISING SUN AVENUE",
      //     "council_district": "9",
      //     "project_scope": "Site & Rec Center Improvements",
      //     "inspector": "TBD",
      //     "project_coordinator": "Medow",
      //     "estimated_completion_season": "Winter",
      //     "estimated_completion_year": "2025",
      //     "estimated_completion": "Late 2025",
      //     "actual_completion": '2025-08-31',
      //     "archive_date": null,
      //     "project_status": "Complete",
      //     "project_estimated_cost": "200",
      //     "contact_email": "CPO@phila.gov",
      //     "website_link": "https://www.phila.gov/programs/rebuild/",
      //     "lat": 40.04670039069094,
      //     "lon": -75.10160256942602
      //   },
      //   {
      //     "cartodb_id": 47892,
      //     "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
      //     "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
      //     "objectid": 44534,
      //     "project_number": "16381E-01-01",
      //     "project_name": "Lawncrest Rec Locker Room Refresh",
      //     "client_dept": "Philadephia Parks and Recreation",
      //     "client_category": "Philadephia Parks and Recreation",
      //     "site_code": "16381E",
      //     "site_name": "Lawncrest Recreation Center",
      //     "site_address": "6000 RISING SUN AVENUE",
      //     "council_district": "9",
      //     "project_scope": "Site & Rec Center Improvements",
      //     "inspector": "TBD",
      //     "project_coordinator": "Medow",
      //     "estimated_completion_season": "Winter",
      //     "estimated_completion_year": "2023",
      //     "estimated_completion": "Late 2023",
      //     "actual_completion": '2023-12-31',
      //     "archive_date": '2024-05-31',
      //     "project_status": "Complete",
      //     "project_estimated_cost": "300",
      //     "contact_email": "CPO@phila.gov",
      //     "website_link": "https://www.phila.gov/programs/rebuild/",
      //     "lat": 40.04670039069094,
      //     "lon": -75.10160256942602
      //   },
      //   {
      //     "cartodb_id": 435675,
      //     "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
      //     "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
      //     "objectid": 456753,
      //     "project_number": "16381E-01-01",
      //     "project_name": "LawncrestRecreationCenter Pool Equipment Upgrades",
      //     "client_dept": "Philadephia Parks and Recreation",
      //     "client_category": "Philadephia Parks and Recreation",
      //     "site_code": "16381E",
      //     "site_name": "Lawncrest Recreation Center",
      //     "site_address": "6000 RISING SUN AVENUE",
      //     "council_district": "9",
      //     "project_scope": "Site & Rec Center Improvements",
      //     "inspector": "TBD",
      //     "project_coordinator": "Medow",
      //     "estimated_completion_season": "Winter",
      //     "estimated_completion_year": "2023",
      //     "estimated_completion": "Late 2023",
      //     "actual_completion": '2023-12-31',
      //     "archive_date": '2024-06-31',
      //     "project_status": "Complete",
      //     "project_estimated_cost": "400",
      //     "contact_email": "CPO@phila.gov",
      //     "website_link": "https://www.phila.gov/programs/rebuild/",
      //     "lat": 40.04670039069094,
      //     "lon": -75.10160256942602
      //   },
      //   {
      //     "cartodb_id": 449090,
      //     "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
      //     "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
      //     "objectid": 456754,
      //     "project_number": "16381E-01-01",
      //     "project_name": "Lawncrest Rec HVAC System Upgrade",
      //     "client_dept": "Parks&Rec",
      //     "client_category": "Parks&Rec",
      //     "site_code": "16381E",
      //     "site_name": "Lawncrest Recreation Center",
      //     "site_address": "6000 RISING SUN AVENUE",
      //     "council_district": "9",
      //     "project_scope": "Site & Rec Center Improvements",
      //     "inspector": "TBD",
      //     "project_coordinator": "Medow",
      //     "estimated_completion_season": "Winter",
      //     "estimated_completion_year": "2023",
      //     "estimated_completion": "Late 2023",
      //     "actual_completion": '2023-12-31',
      //     "archive_date": '2024-07-31',
      //     "project_status": "Complete",
      //     "project_estimated_cost": "500",
      //     "contact_email": "CPO@phila.gov",
      //     "website_link": "https://www.phila.gov/programs/rebuild/",
      //     "lat": 40.04670039069094,
      //     "lon": -75.10160256942602
      //   },
      //   {
      //     "cartodb_id": 47674,
      //     "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
      //     "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
      //     "objectid": 456754,
      //     "project_number": "16381E-01-01",
      //     "project_name": "FAKE PROJECT",
      //     "client_dept": "FAKE DEPT",
      //     "client_category": "FAKE DEPT",
      //     "site_code": "16381E",
      //     "site_name": "FAKE SITE",
      //     "site_address": "6000 RISING SUN AVENUE",
      //     "council_district": "DISTRICT10",
      //     "project_scope": "Site & Rec Center Improvements",
      //     "inspector": "TBD",
      //     "project_coordinator": "Medow",
      //     "estimated_completion_season": "Winter",
      //     "estimated_completion_year": "2023",
      //     "estimated_completion": "Late 2023",
      //     "actual_completion": '2023-12-31',
      //     "archive_date": '2024-06-31',
      //     "project_status": "Complete",
      //     "project_estimated_cost": "500",
      //     "contact_email": "CPO@phila.gov",
      //     "website_link": "https://www.phila.gov/programs/rebuild/",
      //     "lat": 40.0,
      //     "lon": -75.2
      //   },
      //   {
      //     "cartodb_id": 2908900,
      //     "the_geom": "0101000020E610000018455C6F53C452C020781503E7FF4340",
      //     "the_geom_webmercator": "0101000020110F0000763FCB8AA1E05FC1E0DAC6DDC98F5241",
      //     "objectid": 2567567,
      //     "project_number": "16-25-7223-01\t",
      //     "project_name": "Multiple Categories Test",
      //     "client_dept": "Police Dept",
      //     "client_category": "Police Dept Fire Dept",
      //     "site_code": "16134E",
      //     "site_name": "Bridesburg Recreation Center",
      //     "site_address": "4625 RICHMOND ST",
      //     "council_district": "6",
      //     "project_scope": "Multiple Categories Test",
      //     "inspector": "TBD",
      //     "project_coordinator": "Eldidi/Elisii",
      //     "estimated_completion_season": "Fall",
      //     "estimated_completion_year": "2025",
      //     "actual_completion": null,
      //     "project_status": "Design",
      //     "project_estimated_cost": "1696111.11",
      //     "contact_email": "CPO@phila.gov",
      //     "website_link": "https://www.phila.gov/departments/capital-program-office/",
      //     "lat": 39.99923742817214,
      //     "lon": -75.06759246836407,
      //     "archive_date": null
      //   },
      //   {
      //     "cartodb_id": 289095,
      //     "the_geom": "0101000020E6100000B1EA383560C652C0DB7B4195E4054440",
      //     "the_geom_webmercator": "0101000020110F0000960AF7EB1CE45FC1D0089BAC6E965241",
      //     "objectid": 225655,
      //     "project_number": "52020E-01-01",
      //     "project_name": "Lawncrest Library Improvements 2",
      //     "client_dept": "Free Library of Philadelphia",
      //     "client_category": "Free Library of Philadelphia",
      //     "site_code": "52020E",
      //     "site_name": "Lawncrest Library",
      //     "site_address": "6098 RISING SUN AVE",
      //     "council_district": "9",
      //     "project_scope": "Building Renovation",
      //     "inspector": "TBD",
      //     "project_coordinator": "O'Connell",
      //     "estimated_completion_season": "Spring",
      //     "estimated_completion_year": "2025",
      //     "actual_completion": "04/102025",
      //     "project_status": "Complete",
      //     "project_estimated_cost": "5183148",
      //     "contact_email": "CPO@phila.gov",
      //     "website_link": "https://www.phila.gov/programs/rebuild/",
      //     "lat": 40.04603830048992,
      //     "lon": -75.09962206419256,
      //     "archive_date": null
      //   },
      //   {
      //     "cartodb_id": 2565445,
      //     "the_geom": "0101000020E6100000B1EA383560C652C0DB7B4195E4054440",
      //     "the_geom_webmercator": "0101000020110F0000960AF7EB1CE45FC1D0089BAC6E965241",
      //     "objectid": 2435,
      //     "project_number": "52020E-01-01",
      //     "project_name": "Lawncrest Library Improvements 3",
      //     "client_dept": "Free Library of Philadelphia",
      //     "client_category": "Free Library of Philadelphia",
      //     "site_code": "52020E",
      //     "site_name": "Lawncrest Library",
      //     "site_address": "6098 RISING SUN AVE",
      //     "council_district": "9",
      //     "project_scope": "Building Renovation",
      //     "inspector": "TBD",
      //     "project_coordinator": "O'Connell",
      //     "estimated_completion_season": "Spring",
      //     "estimated_completion_year": "2025",
      //     "actual_completion": "04/102025",
      //     "project_status": "Complete",
      //     "project_estimated_cost": "5183148",
      //     "contact_email": "CPO@phila.gov",
      //     "website_link": "https://www.phila.gov/programs/rebuild/",
      //     "lat": 40.04603830048992,
      //     "lon": -75.09962206419256,
      //     "archive_date": null
      //   },
      //   {
      //     "cartodb_id": 1200,
      //     "the_geom": "0101000020E61000008E72F2D8D6C252C094FE7CD1A2034440",
      //     "the_geom_webmercator": "0101000020110F000077BB6E131BDE5FC1463554C4ED935241",
      //     "objectid": 1200,
      //     "project_number": "16228E-02-02",
      //     "project_name": "Disston Recreation Center Improvements",
      //     "client_dept": "Philadephia Parks and Recreation",
      //     "client_category": "Philadephia Parks and Recreation",
      //     "site_code": "16228E",
      //     "site_name": "Disston Recreation Center",
      //     "site_address": "4423 LONGSHORE AVE",
      //     "council_district": "6",
      //     "project_scope": "P1 playground, adult fitness;P2 Building renovation;P3 new roof;P4 aluminum cornice",
      //     "inspector": "TBD",
      //     "project_coordinator": "Sebastiani",
      //     "estimated_completion_season": "Fall",
      //     "estimated_completion_year": "2025",
      //     "actual_completion": null,
      //     "project_status": "Construction",
      //     "project_estimated_cost": "1500000",
      //     "contact_email": "CPO@phila.gov",
      //     "website_link": "https://www.phila.gov/programs/rebuild/",
      //     "lat": 40.02840632060284,
      //     "lon": -75.0443632476474,
      //     "archive_date": null,
      //     "fields_hash": "123451e61b6913e487cd762d782ad4bb"
      //   }
      // );


      ////////////////////////////////////////////////// TEMP FIXES FOR DATA //////////////////////////////////////////////////////////////
      const stdStatuses = ['Construction', 'Design', 'Complete', 'Planning'];
      const statuses = new Set();
      const councilDistricts = new Set();
      const projectsAsSites = new Set(); // LIST OF SITES WHERE PROJECT NAME IS ALSO SITE NAME
      data.rows.forEach((row) => {
        // FIX DISTRICT AND STATUS
        row.council_district = parseInt(row.council_district) ? row.council_district.charAt(0) : "0";
        row.project_status = stdStatuses.includes(row.project_status) ? row.project_status : "Planning";

        statuses.add(row.project_status)
        councilDistricts.add(row.council_district)
        if (row.project_name === row.site_name) { projectsAsSites.add(row.site_name) }
      })
      // console.log("STATUSES: ", [...statuses])
      // console.log("DISTRICTS: ", [...councilDistricts])
      // console.log("PROJECT NAME SAME AS SITE: ", [...projectsAsSites])
      ////////////////////////////////////////////////// END TEMP FIXES //////////////////////////////////////////////////

      const reorderedData = reorderData(data);
      if (import.meta.env.VITE_DEBUG) console.log('reorderedData:', reorderedData);

      ////////////////////////////////////////////////// TEMP TESTING AND DATA CLEANING ///////////////////////////////////////////////
      // REMOVE WHERE SCOPE AND COST ARE THE SAME
      // let duplicateProjects = {};
      reorderedData.forEach((site) => {
        if (site.projects.length > 1) {
          // const possibleDuplicates = new Set();
          for (let i = 0; i < site.projects.length - 1; i++) {
            const currentProject = site.projects[i];

            for (let j = i + 1; j < site.projects.length; j++) {
              const otherProject = site.projects[j];
              if (!!currentProject.project_estimated_cost &&
                currentProject.project_estimated_cost !== 'TBD' &&
                currentProject.project_estimated_cost === otherProject.project_estimated_cost &&
                currentProject.project_scope === otherProject.project_scope
              ) {
                // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
                // console.log(currentProject)
                // console.log(otherProject)
                // possibleDuplicates.add(currentProject);
                // possibleDuplicates.add(otherProject);
                site.projects = [...site.projects.slice(0, j), ...site.projects.slice(j + 1)]
              }
            }
          }
          // if (possibleDuplicates.size) {
          //   duplicateProjects[site.site_name] = [...possibleDuplicates]
          // }
        }
      })
      // console.log("SAME COST AND SCOPE: ", duplicateProjects)

      // console.log("AFTER CLEANING 1.....................")
      // console.log(reorderedData)

      // FIND WHERE SITE AND COST ARE THE SAME
      let duplicateProjects = {};
      reorderedData.forEach((site) => {
        if (site.projects.length > 1) {
          const possibleDuplicates = new Set();
          for (let i = 0; i < site.projects.length - 1; i++) {
            const currentProject = site.projects[i];

            for (let j = i + 1; j < site.projects.length; j++) {
              const otherProject = site.projects[j];
              if (!!currentProject.project_estimated_cost &&
                currentProject.project_estimated_cost !== 'TBD' &&
                currentProject.project_estimated_cost === otherProject.project_estimated_cost
              ) {
                // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
                // console.log(currentProject)
                // console.log(otherProject)
                possibleDuplicates.add(currentProject);
                possibleDuplicates.add(otherProject);
                // site.projects = [...site.projects.slice(0, j), ...site.projects.slice(j + 1)]
              }
            }
          }
          if (possibleDuplicates.size) {
            duplicateProjects[site.site_name] = [...possibleDuplicates]
          }
        }
      })
      // console.log("SAME COST AND SITE: ", duplicateProjects)
      ////////////////////////////////////////////////// END TEMP TESTING AND DATA CLEANING /////////////////////////////////////////////

      return reorderedData;
    },
  }
};
