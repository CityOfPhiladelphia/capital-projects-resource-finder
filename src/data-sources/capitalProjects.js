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
