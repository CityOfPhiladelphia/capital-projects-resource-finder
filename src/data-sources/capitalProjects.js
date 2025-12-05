import { getShortestSiteName } from '@/composables/getShortestSiteName';
import { normalizeCategory as normalizeSiteCategory } from '@/composables/normalizeCategory';
import { expandContractions } from '@/composables/expandContractions';

const sqlQuery = `
  SELECT
    st.lat AS lat,
    st.lon AS lon,
    st.council_district AS council_district,
    array_agg(DISTINCT st.site_name) AS site_name,
    array_agg(DISTINCT st.client_category) AS site_category,
    array_agg(DISTINCT project) AS projects,
    ARRAY( SELECT DISTINCT
      unnest(string_to_array(lower(concat_ws(',', VARIADIC array_agg(keywords))), ','))
    ) AS keywords
  FROM capital_projects_for_finder st, capital_projects_for_finder pt,
    LATERAL( SELECT
      jsonb_build_object(
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
        'fields_hash', pt.fields_hash
      ) AS project,
      concat_ws(',',
        regexp_replace(pt.project_name, '[^\\w]+', ',', 'g'),
        regexp_replace(pt.project_scope, '[^\\w]+', ',', 'g'),
        regexp_replace(pt.project_coordinator, '[\\/-:;]', ',', 'g'),
        regexp_replace(pt.inspector, '[\\/-:;]', ',', 'g'),
        pt.estimated_completion_year,
        pt.estimated_completion_season
      ) AS keywords
    ) pq
  WHERE (COALESCE(st.lat, 0), COALESCE(st.lon, 0), st.council_district, st.site_name) = (COALESCE(pt.lat, 0), COALESCE(pt.lon, 0), pt.council_district, pt.site_name)
  GROUP BY st.council_district, st.lat, st.lon
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
        row.keywords = Array.from(row.keywords, (keyword) => expandContractions(keyword))
      })
      if (import.meta.env.VITE_DEBUG) console.log('capitalProjects data:', data);
      return data.rows;
    },
  }
};
