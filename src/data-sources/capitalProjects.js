export default {
  id: 'immigrant',
  type: 'http-get',
  dependent: 'none',
  resettable: false,
  replaceOnSuccess: true,
  url: 'https://phl.carto.com/api/v2/sql',
  options: {
    params: {
      q: 'select * from capital_projects_for_finder',
    },
    success: function(data) {
      if (import.meta.env.VITE_DEBUG) console.log('capitalProjects data:', data);
      data.rows.push(
        {
          "cartodb_id": 40,
          "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
          "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
          "objectid": 40,
          "project_number": "16381E-01-01",
          "project_name": "Lawncrest Rec fake 1",
          "client_dept": "Philadephia Parks and Recreation",
          "client_category": null,
          "site_code": "16381E",
          "site_name": "Lawncrest Recreation Center ",
          "site_address": "6000 RISING SUN AVENUE",
          "council_district": "9",
          "project_scope": "Site & Rec Center Improvements",
          "inspector": "TBD",
          "project_coordinator": "Medow",
          "estimated_completion_season": "Winter",
          "estimated_completion_year": "2025",
          "estimated_completion": "Late 2025",
          "actual_completion": null,
          "project_status": "Construction",
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
          "client_category": null,
          "site_code": "16381E",
          "site_name": "Lawncrest Recreation Center ",
          "site_address": "6000 RISING SUN AVENUE",
          "council_district": "9",
          "project_scope": "Site & Rec Center Improvements",
          "inspector": "TBD",
          "project_coordinator": "Medow",
          "estimated_completion_season": "Winter",
          "estimated_completion_year": "2025",
          "estimated_completion": "Late 2025",
          "actual_completion": null,
          "project_status": "Construction",
          "project_estimated_cost": "200",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/programs/rebuild/",
          "lat": 40.04670039069094,
          "lon": -75.10160256942602
        },
        {
          "cartodb_id": 42,
          "the_geom": "0101000020E6100000F53710A880C652C02F5D4547FA054440",
          "the_geom_webmercator": "0101000020110F0000576BF80954E45FC1F1E56EBE86965241",
          "objectid": 42,
          "project_number": "16381E-01-01",
          "project_name": "Lawncrest Rec fake 3",
          "client_dept": "Philadephia Parks and Recreation",
          "client_category": null,
          "site_code": "16381E",
          "site_name": "Lawncrest Recreation Center ",
          "site_address": "6000 RISING SUN AVENUE",
          "council_district": "9",
          "project_scope": "Site & Rec Center Improvements",
          "inspector": "TBD",
          "project_coordinator": "Medow",
          "estimated_completion_season": "Winter",
          "estimated_completion_year": "2025",
          "estimated_completion": "Late 2025",
          "actual_completion": null,
          "project_status": "Construction",
          "project_estimated_cost": "300",
          "contact_email": "CPO@phila.gov",
          "website_link": "https://www.phila.gov/programs/rebuild/",
          "lat": 40.04670039069094,
          "lon": -75.10160256942602
        },
      )



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
          'client_dept': value[0].client_dept,
          'lat': value[0].lat,
          'lon': value[0].lon,
          projects: value
        })
      );

      if (import.meta.env.VITE_DEBUG) console.log('reorderedData:', reorderedData);
      return reorderedData;
    },
  },
};
