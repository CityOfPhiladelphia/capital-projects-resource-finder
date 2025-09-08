export default {
  id: 'immigrant',
  type: 'http-get',
  dependent: 'none',
  resettable: false,
  url: 'https://phl.carto.com/api/v2/sql',
  options: {
    params: {
      q: 'select * from capital_projects_for_finder',
    },
  },
};
