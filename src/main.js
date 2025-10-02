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

const getProjectStatusBitArray = (locations) => {
  const bufferLength = Math.ceil(locations.length / 8);

  const bufferToggleOff = new ArrayBuffer(bufferLength);
  const viewToggleOff = new DataView(bufferToggleOff);
  let bitsToSet_toggleOff = 0;

  const bufferToggleOn = new ArrayBuffer(bufferLength);
  const viewToggleOn = new DataView(bufferToggleOn);
  let bitsToSet_toggleOn = 0;

  let offset = 0;
  let exp = 0;

  locations.forEach((location, i) => {
    exp = i % 8;
    bitsToSet_toggleOff |= location.properties.projects.some((project) => !isArchiveProject(project)) ? 1 << exp : 0;
    bitsToSet_toggleOn |= location.properties.projects.some((project) => isArchiveProject(project)) ? 1 << exp : 0;

    const setBitsTrigger = (exp === 7);
    if (setBitsTrigger) {
      viewToggleOff.setUint8(offset, bitsToSet_toggleOff);
      viewToggleOn.setUint8(offset, bitsToSet_toggleOn);
      bitsToSet_toggleOff = 0;
      bitsToSet_toggleOn = 0;
    }
    offset += setBitsTrigger ? 1 : 0;
  })

  if (offset && exp !== 7) {
    viewToggleOff.setUint8(offset, bitsToSet_toggleOff);
    viewToggleOn.setUint8(offset, bitsToSet_toggleOn);
  }

  return {
    toggleOff: bufferToggleOff,
    toggleOn: bufferToggleOn
  }
}

// filterLocationProjects function gets passed to Pinboard to refine the projects at sites according to their archived status, or (inclusive) based on their project status
const statusToggleRefine = (locations, selectedServicesArray) => {
  const refineGroups = new Set();
  const selectedStatusesArray = Array.from(selectedServicesArray, (service) => {
    const splitService = service.split('_');
    refineGroups.add(splitService[0])
    return splitService[1];
  })
  const archiveFilteredLocations = filterArchived(locations, selectedStatusesArray.includes('archive'))
  if (![...refineGroups].includes('status') || selectedStatusesArray.includes('archive')) { return archiveFilteredLocations }

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

const $config = {
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
    multipleFieldGroups: {
      status: {
        checkbox: {
          'planning': {
            unique_key: 'status_planning',
            i18n_key: 'status.planning',
            value: function (item) { return item.properties.projects.some((project) => project.project_status.toLowerCase() === 'planning') }
          },
          'design': {
            unique_key: 'status_design',
            i18n_key: 'status.design',
            value: function (item) { return item.properties.projects.some((project) => project.project_status.toLowerCase() === 'design') }
          },
          'construction': {
            unique_key: 'status_construction',
            i18n_key: 'status.construction',
            value: function (item) { return item.properties.projects.some((project) => project.project_status.toLowerCase() === 'construction') }
          },
          'complete': {
            unique_key: 'status_complete',
            i18n_key: 'status.complete',
            value: function (item) { return item.properties.projects.some((project) => project.project_status.toLowerCase() === 'complete' && !isArchiveProject(project)) }
          },
          'archive': {
            unique_key: 'status_archive',
            i18n_key: 'status.archive',
            value: function (item) { return item.properties.projects.some((project) => isArchiveProject(project)) }
          }
        },
        toggleKey: 'status_archive',
        toggleRefine: statusToggleRefine,
        toggleCount: getProjectStatusBitArray,
      },
      projectCategory: {
        checkbox: {
          'parks': {
            unique_key: 'projectCategory_parks',
            i18n_key: 'projectCategory.parks',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.site_category === 'parks' }
          },
          'health': {
            unique_key: 'projectCategory_health',
            i18n_key: 'projectCategory.health',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.site_category === 'health' }
          },
          'library': {
            unique_key: 'projectCategory_library',
            i18n_key: 'projectCategory.library',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.site_category === 'library' }
          },
          'fire': {
            unique_key: 'projectCategory_fire',
            i18n_key: 'projectCategory.fire',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.site_category === 'fire' }
          },
          'police': {
            unique_key: 'projectCategory_police',
            i18n_key: 'projectCategory.police',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.site_category === 'police' }
          },
          'property': {
            unique_key: 'projectCategory_property',
            i18n_key: 'projectCategory.property',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.site_category === 'property' }
          },
          'other': {
            unique_key: 'projectCategory_other',
            i18n_key: 'projectCategory.other',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.site_category === 'other' }
          },
          'multiple': {
            unique_key: 'projectCategory_multiple',
            i18n_key: 'projectCategory.multiple',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.site_category === 'multiple' }
          }
        },
        columns: 2
      },
      councilDistrict: {
        checkbox: {
          'district1': {
            unique_key: 'councilDistrict_district1',
            i18n_key: 'councilDistrict.district1',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district.endsWith('1') }
          },
          'district2': {
            unique_key: 'councilDistrict_district2',
            i18n_key: 'councilDistrict.district2',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district.endsWith('2') }
          },
          'district3': {
            unique_key: 'councilDistrict_district3',
            i18n_key: 'councilDistrict.district3',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district.endsWith('3') }
          },
          'district4': {
            unique_key: 'councilDistrict_district4',
            i18n_key: 'councilDistrict.district4',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district.endsWith('4') }
          },
          'district5': {
            unique_key: 'councilDistrict_district5',
            i18n_key: 'councilDistrict.district5',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district.endsWith('5') }
          },
          'district6': {
            unique_key: 'councilDistrict_district6',
            i18n_key: 'councilDistrict.district6',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district.endsWith('6') }
          },
          'district7': {
            unique_key: 'councilDistrict_district7',
            i18n_key: 'councilDistrict.district7',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district.endsWith('7') }
          },
          'district8': {
            unique_key: 'councilDistrict_district8',
            i18n_key: 'councilDistrict.district8',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district.endsWith('8') }
          },
          'district9': {
            unique_key: 'councilDistrict_district9',
            i18n_key: 'councilDistrict.district9',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district.endsWith('9') }
          },
          'district10': {
            unique_key: 'councilDistrict_district10',
            i18n_key: 'councilDistrict.district10',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district.endsWith('10') }
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
        ['get', 'site_category'],
        'fire',
        legendControl.legend.data['Fire Department']['background-color'],
        'library',
        legendControl.legend.data['Free Library']['background-color'],
        'human',
        legendControl.legend.data['Human Services']['background-color'],
        'parks',
        legendControl.legend.data['Parks & Recreation']['background-color'],
        'health',
        legendControl.legend.data['Public Health']['background-color'],
        'property',
        legendControl.legend.data['Public Property']['background-color'],
        'police',
        legendControl.legend.data['Police Department']['background-color'],
        'other',
        legendControl.legend.data['Other']['background-color'],
        // multiple (mapLibre requires an unlabled default value)
        legendControl.legend.data['Multiple Departments']['background-color']
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
