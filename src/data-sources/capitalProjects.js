// called by filterArchived and getProjectStatusBitArray
// checks if the project's archive_date is in the past. !!project.archive_date protects against null values
// new Date(project.archive_date) < new Date() returns true if project.archive_date is null, !!project.archive_date prevents such cases being marked as archived
const isArchiveProject = (project) => { return !!project.archive_date && (new Date(project.archive_date) < new Date()) }

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
    if (project.client_category.toLowerCase().includes('parks')) { categories.add('parks') }
    if (project.client_category.toLowerCase().includes('health')) { categories.add('health') }
    if (project.client_category.toLowerCase().includes('library')) { categories.add('library') }
    if (project.client_category.toLowerCase().includes('fire')) { categories.add('fire') }
    if (project.client_category.toLowerCase().includes('police')) { categories.add('police') }
    if (project.client_category.toLowerCase().includes('property')) { categories.add('property') }
    if (!categories.size) { categories.add(project.client_category.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')) }
  })

  if (categories.size > 1) { return 'multiple' }
  return normalizedCategories.includes([...categories][0]) ? [...categories][0] : 'other';
}

export default {
  id: 'capital_projects',
  type: 'http-get',
  dependent: 'none',
  resettable: false,
  replaceOnSuccess: true,
  url: 'https://phl.carto.com/api/v2/sql',
  options: {
    params: {
      q: 'select * from capital_projects_for_finder',
    },
    success: function (data) {
      if (import.meta.env.VITE_DEBUG) console.log('capitalProjects data:', data);

      const testArchived = data.rows.filter(r => {
        return r.project_name == '8th and Diamond Improvements';
      })[0];

      testArchived.actual_completion = '2023-12-31';

      console.log('testArchived:', testArchived);

      data.rows.push(
        {
          "cartodb_id": 40,
          "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
          "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
          "objectid": 40,
          "project_number": "16381E-01-01",
          "project_name": "Lawncrest Rec fake 1",
          "client_dept": "Philadephia Parks and Recreation",
          "client_category": "Philadephia Parks and Recreation",
          "site_code": "16381E",
          "site_name": "Lawncrest Recreation Center",
          "site_address": "6000 RISING SUN AVENUE",
          "council_district": "9",
          "project_scope": "Site & Rec Center Improvements",
          "inspector": "TBD",
          "project_coordinator": "Medow",
          "estimated_completion_season": "Winter",
          "estimated_completion_year": "2025",
          "estimated_completion": "Late 2025",
          "actual_completion": null,
          "archive_date": null,
          "project_status": "Planning",
          "project_estimated_cost": "100",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/programs/rebuild/",
          "lat": 40.04670039069094,
          "lon": -75.10160256942602
        },
        {
          "cartodb_id": 41,
          "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
          "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
          "objectid": 41,
          "project_number": "16381E-01-01",
          "project_name": "Lawncrest Rec fake 2",
          "client_dept": "Philadephia Parks and Recreation",
          "client_category": "Philadephia Parks and Recreation",
          "site_code": "16381E",
          "site_name": "Lawncrest Recreation Center",
          "site_address": "6000 RISING SUN AVENUE",
          "council_district": "9",
          "project_scope": "Site & Rec Center Improvements",
          "inspector": "TBD",
          "project_coordinator": "Medow",
          "estimated_completion_season": "Winter",
          "estimated_completion_year": "2025",
          "estimated_completion": "Late 2025",
          "actual_completion": '2025-08-31',
          "archive_date": null,
          "project_status": "Complete",
          "project_estimated_cost": "200",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/programs/rebuild/",
          "lat": 40.04670039069094,
          "lon": -75.10160256942602
        },
        {
          "cartodb_id": 47892,
          "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
          "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
          "objectid": 44534,
          "project_number": "16381E-01-01",
          "project_name": "Lawncrest Rec fake 3",
          "client_dept": "Philadephia Parks and Recreation",
          "client_category": "Philadephia Parks and Recreation",
          "site_code": "16381E",
          "site_name": "Lawncrest Recreation Center",
          "site_address": "6000 RISING SUN AVENUE",
          "council_district": "9",
          "project_scope": "Site & Rec Center Improvements",
          "inspector": "TBD",
          "project_coordinator": "Medow",
          "estimated_completion_season": "Winter",
          "estimated_completion_year": "2023",
          "estimated_completion": "Late 2023",
          "actual_completion": '2023-12-31',
          "archive_date": '2024-06-31',
          "project_status": "Complete",
          "project_estimated_cost": "300",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/programs/rebuild/",
          "lat": 40.04670039069094,
          "lon": -75.10160256942602
        },
        {
          "cartodb_id": 435675,
          "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
          "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
          "objectid": 456753,
          "project_number": "16381E-01-01",
          "project_name": "Lawncrest Rec fake 4",
          "client_dept": "Philadephia Parks and Recreation",
          "client_category": "Philadephia Parks and Recreation",
          "site_code": "16381E",
          "site_name": "Lawncrest Recreation Center",
          "site_address": "6000 RISING SUN AVENUE",
          "council_district": "9",
          "project_scope": "Site & Rec Center Improvements",
          "inspector": "TBD",
          "project_coordinator": "Medow",
          "estimated_completion_season": "Winter",
          "estimated_completion_year": "2023",
          "estimated_completion": "Late 2023",
          "actual_completion": '2023-12-31',
          "archive_date": '2024-06-31',
          "project_status": "Complete",
          "project_estimated_cost": "400",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/programs/rebuild/",
          "lat": 40.04670039069094,
          "lon": -75.10160256942602
        },
        {
          "cartodb_id": 449090,
          "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
          "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
          "objectid": 456754,
          "project_number": "16381E-01-01",
          "project_name": "Lawncrest Rec fake 5",
          "client_dept": "Parks&Rec",
          "client_category": "Parks&Rec",
          "site_code": "16381E",
          "site_name": "Lawncrest Recreation Center",
          "site_address": "6000 RISING SUN AVENUE",
          "council_district": "9",
          "project_scope": "Site & Rec Center Improvements",
          "inspector": "TBD",
          "project_coordinator": "Medow",
          "estimated_completion_season": "Winter",
          "estimated_completion_year": "2023",
          "estimated_completion": "Late 2023",
          "actual_completion": '2023-12-31',
          "archive_date": '2024-06-31',
          "project_status": "Complete",
          "project_estimated_cost": "500",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/programs/rebuild/",
          "lat": 40.04670039069094,
          "lon": -75.10160256942602
        },
        {
          "cartodb_id": 47674,
          "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
          "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
          "objectid": 456754,
          "project_number": "16381E-01-01",
          "project_name": "FAKE PROJECT",
          "client_dept": "FAKE DEPT",
          "client_category": "FAKE DEPT",
          "site_code": "16381E",
          "site_name": "FAKE SITE",
          "site_address": "6000 RISING SUN AVENUE",
          "council_district": "DISTRICT10",
          "project_scope": "Site & Rec Center Improvements",
          "inspector": "TBD",
          "project_coordinator": "Medow",
          "estimated_completion_season": "Winter",
          "estimated_completion_year": "2023",
          "estimated_completion": "Late 2023",
          "actual_completion": '2023-12-31',
          "archive_date": '2024-06-31',
          "project_status": "Complete",
          "project_estimated_cost": "500",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/programs/rebuild/",
          "lat": 40.0,
          "lon": -75.2
        },
        {
          "cartodb_id": 2908900,
          "the_geom": "0101000020E610000018455C6F53C452C020781503E7FF4340",
          "the_geom_webmercator": "0101000020110F0000763FCB8AA1E05FC1E0DAC6DDC98F5241",
          "objectid": 2567567,
          "project_number": "16-25-7223-01\t",
          "project_name": "Multiple Categories Test",
          "client_dept": "Police Dept",
          "client_category": "Police Dept",
          "site_code": "16134E",
          "site_name": "Bridesburg Recreation Center",
          "site_address": "4625 RICHMOND ST",
          "council_district": "6",
          "project_scope": "Multiple Categories Test",
          "inspector": "TBD",
          "project_coordinator": "Eldidi/Elisii",
          "estimated_completion_season": "Fall",
          "estimated_completion_year": "2025",
          "actual_completion": null,
          "project_status": "Design",
          "project_estimated_cost": "1696111.11",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/departments/capital-program-office/",
          "lat": 39.99923742817214,
          "lon": -75.06759246836407,
          "archive_date": null
        },
        {
          "cartodb_id": 289095,
          "the_geom": "0101000020E6100000B1EA383560C652C0DB7B4195E4054440",
          "the_geom_webmercator": "0101000020110F0000960AF7EB1CE45FC1D0089BAC6E965241",
          "objectid": 225655,
          "project_number": "52020E-01-01",
          "project_name": "Lawncrest Library Improvements 2",
          "client_dept": "Free Library of Philadelphia",
          "client_category": "Free Library of Philadelphia",
          "site_code": "52020E",
          "site_name": "Lawncrest Library",
          "site_address": "6098 RISING SUN AVE",
          "council_district": "9",
          "project_scope": "Building Renovation",
          "inspector": "TBD",
          "project_coordinator": "O'Connell",
          "estimated_completion_season": "Spring",
          "estimated_completion_year": "2025",
          "actual_completion": "04/102025",
          "project_status": "Complete",
          "project_estimated_cost": "5183148",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/programs/rebuild/",
          "lat": 40.04603830048992,
          "lon": -75.09962206419256,
          "archive_date": null
        },
        {
          "cartodb_id": 2565445,
          "the_geom": "0101000020E6100000B1EA383560C652C0DB7B4195E4054440",
          "the_geom_webmercator": "0101000020110F0000960AF7EB1CE45FC1D0089BAC6E965241",
          "objectid": 2435,
          "project_number": "52020E-01-01",
          "project_name": "Lawncrest Library Improvements 3",
          "client_dept": "Free Library of Philadelphia",
          "client_category": "Free Library of Philadelphia",
          "site_code": "52020E",
          "site_name": "Lawncrest Library",
          "site_address": "6098 RISING SUN AVE",
          "council_district": "9",
          "project_scope": "Building Renovation",
          "inspector": "TBD",
          "project_coordinator": "O'Connell",
          "estimated_completion_season": "Spring",
          "estimated_completion_year": "2025",
          "actual_completion": "04/102025",
          "project_status": "Complete",
          "project_estimated_cost": "5183148",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/programs/rebuild/",
          "lat": 40.04603830048992,
          "lon": -75.09962206419256,
          "archive_date": null
        },
      );

      const reorderedData = Array.from(
        data.rows.reduce((groups, obj) => {
          const category = obj['site_name'];
          if (!category || typeof category !== 'string') return groups;

          if (!groups.has(category)) {
            groups.set(category, []);
          }

          groups.get(category).push(obj);
          return groups;
        }, new Map()),
        ([site_name, value]) => ({
          'site_name': site_name,
          'site_category': normalizeSiteCategory(value),
          'council_district': value[0].council_district,
          'has_archived': value.some((project) => isArchiveProject(project)),
          'lat': value[0].lat,
          'lon': value[0].lon,
          projects: value
        })
      );

      if (import.meta.env.VITE_DEBUG) console.log('reorderedData:', reorderedData);
      return reorderedData;
    },
  },
  isArchiveProject: isArchiveProject,
};
