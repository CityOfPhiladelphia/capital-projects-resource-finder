// this is the base-config for resource-finder
// the point of this file is that it will move outside the project
// (so that settings we put in it can be used by other projects)
// and be pulled in with an axios call or something
// (we might not need to use axios with new vue async tools)
// if that is not needed, we can move this info to main.js

import isMac from './util/is-mac';
if (isMac()) {
  import('./assets/mac-style.scss')
}

// Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown as farAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { faAngleUp as farAngleUp } from '@fortawesome/pro-regular-svg-icons';
import { faTimes as farTimes } from '@fortawesome/pro-regular-svg-icons';
import { faPlus as farPlus } from '@fortawesome/pro-regular-svg-icons';
import { faMinus as farMinus } from '@fortawesome/pro-regular-svg-icons';
import { faEnvelope as farEnvelope } from '@fortawesome/pro-regular-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { faChartTreeMap } from '@fortawesome/pro-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

library.add(farAngleDown, farAngleUp, farTimes, farPlus, farMinus, farEnvelope, faFolder, faMoneyCheckDollar, faChartTreeMap, faCaretDown, faCaretUp);

// use these if running off unlinked package
// import pinboard from '@phila/pinboard';
// import '../node_modules/@phila/pinboard/dist/style.css';

// OR
// use this if running off linked package
import pinboard from '../node_modules/@phila/pinboard/src/main.js';
import '../node_modules/@phila/pinboard/dist/index.css';


import legendControl from './general/legendControl';

// data-sources
import capitalProjects from './data-sources/capitalProjects';

import customGreeting from './components/customGreeting.vue';
import expandCollapseContent from './components/ExpandCollapseContent.vue';
import i18n from './i18n/i18n';

const customComps = markRaw({
  'customGreeting': customGreeting,
  'expandCollapseContent': expandCollapseContent,
});

const departmentNames = [
  'Fire',
  'Free Library of Philadelphia',
  'Health',
  'Human Services',
  'Philadephia Parks and Recreation',
  'Police Department',
  'Public Property'
];

// const departmentNames = [
//   'Parks & Recreation',
//   'Public Health',
//   'Human Services',
//   'Free Library',
//   'Fire Department',
//   'Police Department',
//   'Public Property',
// ]

const isArchiveProject = (project) => { return !!project.archive_date && (new Date(project.archive_date) < new Date()) }

const filterArchived = (locations, archiveToggle) => {
  const filteredSites = [];
  locations.forEach((location) => {
    const filteredProjects = location.properties.projects.filter((project) => isArchiveProject(project) === archiveToggle)
    if (filteredProjects.length) {
      const locationCopy = JSON.parse(JSON.stringify(location));
      locationCopy.properties.projects = filteredProjects;
      filteredSites.push(locationCopy);
    }
  })
  return filteredSites;
}


const filterLocationProjects = (locations, selectedStatusesArray) => {
  selectedStatusesArray = Array.from(selectedStatusesArray, (service) => service.split('_')[1])
  const archiveFilteredLocations = filterArchived(locations, selectedStatusesArray.includes('archive'))

  if (!selectedStatusesArray.includes('status')) { return archiveFilteredLocations }

  const filteredSites = [];
  archiveFilteredLocations.forEach((location) => {
    const filteredProjects = location.properties.projects.filter((project) => selectedStatusesArray.includes(project.project_status.toLowerCase()))
    if (filteredProjects.length) {
      const locationCopy = JSON.parse(JSON.stringify(location));
      locationCopy.properties.projects = filteredProjects;
      filteredSites.push(locationCopy);
    }
  })
  return filteredSites;
}

let $config = {
  publicPath: import.meta.env.VITE_PUBLICPATH,
  i18n: i18n.i18n,
  app: {
    type: 'capitalProjects',
    subtitle: 'i18n',
  },
  gtag: {
    category: 'rf-oia',
  },
  // printView: false,
  allowZipcodeSearch: true,
  allowPrint: true,
  showPrintInCards: false,
  retractableRefine: true,
  dropdownRefine: false,
  searchBar: {
    searchTypes: [
      'address',
      'zipcode',
      'keyword',
    ],
    searchDistance: 3,
    fuseThreshold: 0.3,
    fuseDistance: 500,
  },
  locationInfo: {
    siteNameField: 'site_name',
    siteName: function (item) { return item.properties.site_name },
  },
  tags: {
    type: 'fieldValues',
    tags: [
      {
        type: 'array',
        field: 'tags',
        translate: true,
      },
      {
        type: 'array',
        field: 'services_offered',
        translate: true,
      },
      {
        type: 'value',
        field: 'organization_name',
      },
      {
        type: 'array',
        field: 'en_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'ar_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'ch_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'es_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'fr_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'hi_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'ht_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'pt_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'ru_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'sq_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'sw_synonyms',
        i18nDependent: true,
      },
      {
        type: 'array',
        field: 'vi_synonyms',
        i18nDependent: true,
      },
    ],
  },
  customComps,
  refine: {
    type: 'multipleFieldGroups',
    columns: true,
    customRefine: filterLocationProjects,
    multipleFieldGroups: {
      status: {
        checkbox: {
          'planning': {
            unique_key: 'status_planning',
            i18n_key: 'status.planning',
            value: function (item) { return item.properties.projects.some((project) => project.project_status.toLowerCase() === i18n.i18n.data.messages.en.status.planning.toLowerCase()) }
          },
          'design': {
            unique_key: 'status_design',
            i18n_key: 'status.design',
            value: function (item) { return item.properties.projects.some((project) => project.project_status.toLowerCase() === i18n.i18n.data.messages.en.status.design.toLowerCase()) }
          },
          'construction': {
            unique_key: 'status_construction',
            i18n_key: 'status.construction',
            value: function (item) { return item.properties.projects.some((project) => project.project_status.toLowerCase() === i18n.i18n.data.messages.en.status.construction.toLowerCase()) }
          },
          'complete': {
            unique_key: 'status_complete',
            i18n_key: 'status.complete',
            value: function (item) { return item.properties.projects.some((project) => project.project_status.toLowerCase() === i18n.i18n.data.messages.en.status.complete.toLowerCase() && !isArchiveProject(project)) }
          },
          'archive': {
            unique_key: 'status_archive',
            i18n_key: 'status.archive',
            value: function (item) { return item.properties.projects.some((project) => isArchiveProject(project)) }
          }
        },
        toggleKey: 'status_archive',
      },
      projectCategory: {
        checkbox: {
          'parks': {
            unique_key: 'projectCategory_parks',
            i18n_key: 'projectCategory.parks',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.client_dept.trim().toLowerCase().split(' ').some((word) => word === 'parks')) }
          },
          'health': {
            unique_key: 'projectCategory_health',
            i18n_key: 'projectCategory.health',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.client_dept.trim().toLowerCase().split(' ').some((word) => word === 'health')) }
          },
          'human': {
            unique_key: 'projectCategory_human',
            i18n_key: 'projectCategory.human',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.client_dept.trim().toLowerCase().split(' ').some((word) => word === 'human')) }
          },
          'library': {
            unique_key: 'projectCategory_library',
            i18n_key: 'projectCategory.library',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.client_dept.trim().toLowerCase().split(' ').some((word) => word === 'library')) }
          },
          'fire': {
            unique_key: 'projectCategory_fire',
            i18n_key: 'projectCategory.fire',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.client_dept.trim().toLowerCase().split(' ').some((word) => word === 'fire')) }
          },
          'police': {
            unique_key: 'projectCategory_police',
            i18n_key: 'projectCategory.police',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.client_dept.trim().toLowerCase().split(' ').some((word) => word === 'police')) }
          },
          'property': {
            unique_key: 'projectCategory_property',
            i18n_key: 'projectCategory.property',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.client_dept.trim().toLowerCase().split(' ').some((word) => word === 'property')) }
          },
          'other': {
            unique_key: 'projectCategory_other',
            i18n_key: 'projectCategory.other',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => !departmentNames.includes(project.client_dept)) }
          },
          'multiple': {
            unique_key: 'projectCategory_multiple',
            i18n_key: 'projectCategory.multiple',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.length > 1 },
          }
        },
        columns: 2,
      },
      councilDistrict: {
        checkbox: {
          'district1': {
            unique_key: 'councilDistrict_district1',
            i18n_key: 'councilDistrict.district1',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.council_district == "1") }
          },
          'district2': {
            unique_key: 'councilDistrict_district2',
            i18n_key: 'councilDistrict.district2',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.council_district == "2") }
          },
          'district3': {
            unique_key: 'councilDistrict_district3',
            i18n_key: 'councilDistrict.district3',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.council_district == "3") }
          },
          'district4': {
            unique_key: 'councilDistrict_district4',
            i18n_key: 'councilDistrict.district4',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.council_district == "4") }
          },
          'district5': {
            unique_key: 'councilDistrict_district5',
            i18n_key: 'councilDistrict.district5',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.council_district == "5") }
          },
          'district6': {
            unique_key: 'councilDistrict_district6',
            i18n_key: 'councilDistrict.district6',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.council_district == "6") }
          },
          'district7': {
            unique_key: 'councilDistrict_district7',
            i18n_key: 'councilDistrict.district7',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.council_district == "7") }
          },
          'district8': {
            unique_key: 'councilDistrict_district8',
            i18n_key: 'councilDistrict.district8',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.council_district == "8") }
          },
          'district9': {
            unique_key: 'councilDistrict_district9',
            i18n_key: 'councilDistrict.district9',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.council_district == "9") }
          },
          'district10': {
            unique_key: 'councilDistrict_district10',
            i18n_key: 'councilDistrict.district10',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.projects.some((project) => project.council_district == "10") }
          },
        },
        columns: 2
      },
    },
  },
  legendControl,
  dataSources: {
    capitalProjects,
  },
  mapLayer: {
    id: 'resources',
    source: 'resources',
    type: 'circle',
    paint: {
      'circle-radius': 7,
      'circle-color': [
        'match',
        ['get', 'client_dept'],
        ' Fire',
        '#cc3000',
        'Free Library of Philadelphia',
        '#f99300',
        ' Health',
        '#f3c613',
        'Human Services',
        '#58c04d',
        'Philadephia Parks and Recreation',
        '#3a833c',
        'Police Department',
        '#2176d2',
        'Public Property',
        '#9400c6',
        'Multiple projects',
        '#444444',
        /* other */ '#000000'
      ],
      'circle-stroke-width': 1,
      'circle-stroke-color': 'white',
    },
  },
  footer: [
    {
      type: "native",
      href: "https://www.phila.gov/",
      attrs: {
        target: "_blank",
      },
      text: "app.cityOfPhiladelphia",
    },
    {
      type: "native",
      href: "/capital-projects-resource-finder",
      text: "app.about",
    },
    {
      type: "native",
      href: "https://www.phila.gov/feedback/",
      attrs: {
        target: "_blank",
      },
      text: "app.feedback",
    },
  ],
};

pinboard($config);
export default $config;
