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

library.add(farAngleDown, farAngleUp, farTimes, farPlus, farMinus, farEnvelope);

// use these if running off unlinked package
import pinboard from '@phila/pinboard';
import '../node_modules/@phila/pinboard/dist/style.css';
// OR
// use this if running off linked package
// import pinboard from '../node_modules/@phila/pinboard/src/main.js';

// data-sources
import capitalProjects from './data-sources/capitalProjects';

import customGreeting from './components/customGreeting.vue';
import expandCollapseContent from './components/ExpandCollapseContent.vue';

const isArchiveProject = (dateCompleted) => {
  const sixMonths = 15778800000; // 6 months in milliseconds
  const completed = dateCompleted ? new Date(dateCompleted) : 0;
  return completed && (Date.now() - completed > sixMonths);
};

const customComps = markRaw({
  'customGreeting': customGreeting,
  'expandCollapseContent': expandCollapseContent,
});

import i18n from './i18n/i18n';
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
    siteNameField: 'project_name',
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
        radio: {
          'active': {
            unique_key: 'status_active',
            i18n_key: 'status.active',
            value: function (item) {
              return !isArchiveProject(item.properties.actual_completion);
            }
          },
          'archived': {
            unique_key: 'status_archived',
            i18n_key: 'status.archived',
            value: function (item) {
              return isArchiveProject(item.properties.actual_completion);
            }
          }
        }
      },
      projectCategory: {
        checkbox: {
          'parksRecreation': {
            unique_key: 'projectCategory_parksRecreation',
            i18n_key: 'projectCategory.parksRecreation',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.client_dept == 'Philadephia Parks and Recreation'; },
          },
          'publicHealth': {
            unique_key: 'projectCategory_publicHealth',
            i18n_key: 'projectCategory.publicHealth',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.client_dept == 'Public Health'; },
          },
          'humanServices': {
            unique_key: 'projectCategory_humanServices',
            i18n_key: 'projectCategory.humanServices',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.client_dept == 'Human Services'; },
          },
          'freeLibrary': {
            unique_key: 'projectCategory_freeLibrary',
            i18n_key: 'projectCategory.freeLibrary',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.client_dept == 'Free Library'; },
          },
          'fireDepartment': {
            unique_key: 'projectCategory_fireDepartment',
            i18n_key: 'projectCategory.fireDepartment',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.client_dept == 'Fire Department'; },
          },
          'policeDepartment': {
            unique_key: 'projectCategory_policeDepartment',
            i18n_key: 'projectCategory.policeDepartment',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.client_dept == 'Police Department'; },
          },
          'publicProperty': {
            unique_key: 'projectCategory_publicProperty',
            i18n_key: 'projectCategory.publicProperty',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.client_dept == 'Public Property'; },
          },
          'other': {
            unique_key: 'projectCategory_other',
            i18n_key: 'projectCategory.other',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.client_dept !== null; },
          },
        },
      },
      councilDistrict: {
        checkbox: {
          'district1': {
            unique_key: 'councilDistrict_district1',
            i18n_key: 'councilDistrict.district1',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district == "1"; },
          },
          'district2': {
            unique_key: 'councilDistrict_district2',
            i18n_key: 'councilDistrict.district2',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district == "2"; },
          },
          'district3': {
            unique_key: 'councilDistrict_district3',
            i18n_key: 'councilDistrict.district3',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district == "3"; },
          },
          'district4': {
            unique_key: 'councilDistrict_district4',
            i18n_key: 'councilDistrict.district4',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district == "4"; },
          },
          'district5': {
            unique_key: 'councilDistrict_district5',
            i18n_key: 'councilDistrict.district5',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district == "5"; },
          },
          'district6': {
            unique_key: 'councilDistrict_district6',
            i18n_key: 'councilDistrict.district6',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district == "6"; },
          },
          'district7': {
            unique_key: 'councilDistrict_district7',
            i18n_key: 'councilDistrict.district7',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district == "7"; },
          },
          'district8': {
            unique_key: 'councilDistrict_district8',
            i18n_key: 'councilDistrict.district8',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district == "8"; },
          },
          'district9': {
            unique_key: 'councilDistrict_district9',
            i18n_key: 'councilDistrict.district9',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district == "9"; },
          },
          'district10': {
            unique_key: 'councilDistrict_district10',
            i18n_key: 'councilDistrict.district10',
            dependentGroups: ['status'],
            value: function (item) { return item.properties.council_district == "10"; },
          },
        },
        columns: 2
      },
    },
  },
  dataSources: {
    capitalProjects,
  },
  mapLayer: {
    id: 'resources',
    source: 'resources',
    type: 'circle',
    paint: {
      'circle-radius': 7,
      'circle-color': '#9400c6',
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
