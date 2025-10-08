<script setup>

import PrintShareSection from './PrintShareSection.vue';
import ButtonDropdown from './ButtonDropdown.vue';
import StatusBar from './statusBar.vue';
import accounting from 'accounting';
import { ref, computed, watch } from 'vue';
import { format } from 'date-fns';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// checks if the project's archive_date is in the past. !!project.archive_date protects against null values
// new Date(project.archive_date) < new Date() returns true if project.archive_date is null, !!project.archive_date prevents such cases being marked as archived
const isArchiveProject = (project) => { return !!project.archive_date && (new Date(project.archive_date) < new Date()) }

// PROPS
const props = defineProps({
  item: {
    type: Object,
    default: () => { }
  },
  isMobile: {
    type: Boolean,
    default: false,
  }
});

// REFS
const selectedProjectName = ref(props.item.properties.projects[0].project_name);
const moreIsOpen = ref(false);
const archiveActive = ref(isArchiveProject(props.item.properties.projects[0]))

// WATCHERS
watch(
  () => props.item,
  async newProjects => {
    selectedProjectName.value = newProjects.properties.projects[0].project_name;
    moreIsOpen.value = false;
    archiveActive.value = isArchiveProject(newProjects.properties.projects[0]);
  }
)

// COMPUTED PROPERTIES
const selectedProject = computed(() => {
  return props.item.properties.projects.find(project => project.project_name === selectedProjectName.value);
});

const archiveMessage = computed(() => {
  return archiveActive.value ? t('card.archived_on') + ' ' + selectedProject.value.archive_date.replace(/-/g, '/') + '. ' + t('card.archive_message') : '';
})

const excessProjects = computed(() => {
  if (props.item.properties.projects.length <= 3) return [];
  let projects = [...props.item.properties.projects];
  return projects.splice(2);
});

const excessProjectSelected = computed(() => {
  let excessProjectNames = excessProjects.value.map(project => project.project_name);
  return excessProjectNames.includes(selectedProjectName.value);
})

const projectTeam = computed(() => {
  let columns = [
    {
      label: 'Name',
      i18nLabel: 'card.team_name',
      field: 'name',
      thClass: 'th-black-class',
      tdClass: 'table-text',
    },
    {
      label: 'Role',
      i18nLabel: 'card.team_role',
      field: 'role',
      thClass: 'th-black-class',
      tdClass: 'table-text',
    }
  ];
  let rows = [
    {
      name: function (selectedProject) { if (selectedProject) return selectedProject.value.project_coordinator },
      role: 'Project Coordinator'
    },
    {
      name: function (selectedProject) { if (selectedProject) return selectedProject.value.inspector },
      role: 'Inspector'
    },
  ];
  return { columns, rows };
});

const estimatedCompletion = computed(() => {
  if (!selectedProject.value) return 'N/A';
  const season = selectedProject.value.estimated_completion_season;
  const year = selectedProject.value.estimated_completion_year;
  if (season && year && season !== year) {
    return `${season} ${year}`;
  } else if (season && year && season === year) {
    return `${season}`;
  } else if (season && !year) {
    return `${season}`;
  } else if (!season && year) {
    return `${year}`;
  } else {
    return 'N/A';
  }
});

const actualCompletionDate = computed(() => {
  if (!selectedProject.value || !selectedProject.value.actual_completion) return 'No date provided';
  let value;
  try {
    value = format(selectedProject.value.actual_completion, 'MMMM d, yyyy');
  } catch (error) {
    value = 'No date provided';
  }
  return value;
});

// METHODS
const parseAddress = (address) => {
  const formattedAddress = address.replace(/(Phila.+)/g, city => `${city}`).replace(/^\d+\s[A-z]+\s[A-z]+/g, lineOne => `${lineOne}`).replace(/,/, '');
  return formattedAddress;
};

const makeValidUrl = (url) => {
  let newUrl = window.decodeURIComponent(url);
  newUrl = newUrl
    .trim()
    .replace(/\s/g, '');
  if (/^(:\/\/)/.test(newUrl)) {
    return `http${newUrl}`;
  }
  if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
    return `http://${newUrl}`;
  }
  return newUrl;
};

const handleProjectClick = (projectName) => {
  moreIsOpen.value = false;
  if (import.meta.env.VITE_DEBUG) console.log('handleProjectClick projectName:', projectName);
  selectedProjectName.value = projectName;
};

const handleMoreClick = () => {
  if (import.meta.env.VITE_DEBUG) console.log('handleMoreClick projectName:', 'more');
  moreIsOpen.value = !moreIsOpen.value;
};

const normalizeProjectCategory = (client_category) => {
  const categories = new Set();
  const normalizedCategories = ['parks', 'health', 'library', 'fire', 'police', 'property'];
  if (client_category.toLowerCase().includes('parks')) { categories.add('parks') }
  if (client_category.toLowerCase().includes('health')) { categories.add('health') }
  if (client_category.toLowerCase().includes('library')) { categories.add('library') }
  if (client_category.toLowerCase().includes('fire')) { categories.add('fire') }
  if (client_category.toLowerCase().includes('police')) { categories.add('police') }
  if (client_category.toLowerCase().includes('property')) { categories.add('property') }
  if (!categories.size) { categories.add(client_category.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')) }
  if (categories.size > 1) { return 'projectCategory.multiple' }
  return normalizedCategories.includes([...categories][0]) ? 'projectCategory.' + [...categories][0] : 'projectCategory.other';
}

const trimProjectName = (project_name) => {
  let project_copy = project_name;
  props.item.properties.site_name.toLowerCase().split(' ').forEach((word) => {
    if (!project_copy.toLowerCase().split(word)[0]) {
      project_copy = project_copy.slice(word.length).trim()
    }
  })
  return project_copy.length < project_name.length ? project_copy : project_name;
}

</script>

<template>
  <div v-if="props.item.properties.projects.length > 1" class="ec-content button-row is-multiline columns is-mobile">

    <button class="project-button column is-4 p-0" :class="{
      'project-selected': !moreIsOpen && item.properties.projects[0].project_name === selectedProjectName,
      'multiple-children': item.properties.projects.length > 1,
      'only-child': item.properties.projects.length == 1
    }" @click="handleProjectClick(item.properties.projects[0].project_name)">
      <div class="project-button-text has-text-centered pl-1 pr-1">
        {{ trimProjectName(item.properties.projects[0].project_name) }}
      </div>
    </button>

    <button v-if="item.properties.projects.length > 1" class="project-button column is-4 p-0" :class="{
      'project-selected': !moreIsOpen && item.properties.projects[1].project_name === selectedProjectName,
      'multiple-children': item.properties.projects.length > 1,
      'only-child': item.properties.projects.length == 1
    }" @click="handleProjectClick(item.properties.projects[1].project_name)">
      <div class="project-button-text has-text-centered pl-1 pr-1">
        {{ trimProjectName(item.properties.projects[1].project_name) }}
      </div>
    </button>

    <button v-if="item.properties.projects.length == 3" class="project-button column is-4 p-0" :class="{
      'project-selected': !moreIsOpen && item.properties.projects[2].project_name === selectedProjectName,
      'multiple-children': item.properties.projects.length > 1,
      'only-child': item.properties.projects.length == 1
    }" @click="handleProjectClick(item.properties.projects[2].project_name)">
      <div class="project-button-text has-text-centered pl-1 pr-1">
        {{ trimProjectName(item.properties.projects[2].project_name) }}
      </div>
    </button>

    <button v-if="item.properties.projects.length > 3" class="project-button column is-4 p-0"
      :class="{ 'project-selected': excessProjectSelected }" @click="handleMoreClick()">
      <div class="project-button-text has-text-centered pl-1 pr-1"
        :class="{ 'project-selected': 'more' === selectedProjectName }">
        More
        <font-awesome-icon v-if="!moreIsOpen" icon="caret-down" />
        <font-awesome-icon v-if="moreIsOpen" icon="caret-up" />
      </div>
    </button>

    <!-- <button v-if="item.properties.projects.length > 3 && !excessProjectSelected" class="project-button column is-4 p-0"
      :class="{ 'project-selected': moreIsOpen }" @click="handleMoreClick()">
      <div class="project-button-text has-text-centered pl-1 pr-1"
        :class="{ 'project-selected': 'more' === selectedProjectName }">
        More
        <font-awesome-icon v-if="!moreIsOpen" icon="caret-down" />
        <font-awesome-icon v-if="moreIsOpen" icon="caret-up" />
      </div>
    </button> -->

    <!-- <button v-if="excessProjectSelected" class="project-button column is-4 p-0 project-selected"
      @click="handleMoreClick()">
      <div class="project-button-text has-text-centered pl-1 pr-1">
        {{ selectedProjectName }}
      </div>
    </button> -->

    <div v-if="item.properties.projects.length == 1" class="spacer column is-8"></div>
    <div v-if="item.properties.projects.length == 2" class="spacer column is-4"></div>

    <div class="more-zone column is-12 p-0">
      <button-dropdown v-if="moreIsOpen" :projects="excessProjects" :selectedProject="selectedProjectName"
        @clicked-project="handleProjectClick">
      </button-dropdown>
    </div>

  </div>

  <div class='main-ec-content'>

    <print-share-section :item="selectedProject" :featureId="props.item._featureId" v-if="selectedProject" />

    <callout v-if="archiveActive" :message="archiveMessage" class="is-warning is-archive" />

    <div>
      <h2 class="project-name">{{ selectedProject.project_name }}</h2>
    </div>

    <div class="columns top-section">
      <div class="column is-6">
        <div v-if="selectedProject && selectedProject.site_address" class="columns is-mobile">
          <div class="column is-1">
            <font-awesome-icon icon="map-marker-alt" />
          </div>
          <div class="column is-11">
            <b>{{ t('card.address') }}: </b> {{ parseAddress(selectedProject.site_address) }}
          </div>
        </div>

        <div v-if="selectedProject && selectedProject.client_category" class="columns is-mobile">
          <div class="column is-1">
            <font-awesome-icon icon="folder" />
          </div>
          <div class="column is-11"
            v-html="'<b>' + t('card.category') + ': </b>' + t(normalizeProjectCategory(selectedProject.client_category))" />
        </div>

        <div v-if="selectedProject && selectedProject.website_link" class="columns is-mobile website-div">
          <div class="column is-1">
            <font-awesome-icon icon="globe" />
          </div>
          <div class="column is-11">
            <a target="_blank" :href="makeValidUrl(selectedProject.website_link)">
              Project website
            </a>
          </div>
        </div>
      </div>

      <div class="column is-6">

        <div v-if="selectedProject && selectedProject.project_estimated_cost" class="columns is-mobile">
          <div class="column is-1">
            <font-awesome-icon icon="money-check-dollar" />
          </div>
          <div class="column is-11"
            v-html="'<b>' + t('card.budget') + ': </b>' + accounting.formatMoney(selectedProject.project_estimated_cost)" />

        </div>

        <div v-if="selectedProject && selectedProject.council_district" class="columns is-mobile">
          <div class="column is-1">
            <font-awesome-icon icon="chart-tree-map" />
          </div>
          <div class="column is-11" v-html="'<b>' + t('card.district') + ': </b>' + selectedProject.council_district" />
        </div>

        <div v-if="selectedProject && selectedProject.contact_email" class="columns is-mobile">
          <div class="column is-1">
            <font-awesome-icon icon="envelope" />
          </div>
          <div class="column is-11">
            <b>{{ t('card.contact') }}: </b>
            <a :href="`mailto:${selectedProject.contact_email}`">{{ selectedProject.contact_email }}</a>
          </div>
        </div>


      </div>
    </div>

    <div>
      <h3>
        {{ t('card.section_description') }}
      </h3>
      <div>
        {{ t('card.improvements_include') }}
        <ul v-if="selectedProject && selectedProject.project_scope"
          :style="'list-style-type: disc; margin-left: 20px;'">
          <li v-for="(improvement, index) in selectedProject.project_scope.split(',')" :key="index">
            {{ improvement }}
          </li>
        </ul>
      </div>
    </div>

    <div v-if="selectedProject">
      <h3>
        {{ t('card.section_status') }}
      </h3>

      <status-bar :project="selectedProject" />

      <div id="status-info">
        <h1>
          <b>{{ t('card.current_stage') }}: </b>
          <span>{{ t('status.' + selectedProject.project_status.toLowerCase()) }}</span>
        </h1>
        <h1>{{ t('card.status_description.' + selectedProject.project_status.toLowerCase()) }}</h1>
      </div>

      <div id="completion-info">
        <div v-if="selectedProject.project_status !== 'Complete'">
          <b>{{ t('card.estimated_completion') }}:</b> {{ estimatedCompletion }}
        </div>
        <div v-if="selectedProject.project_status === 'Complete'">
          <b>{{ t('card.completed') }}:</b> {{ actualCompletionDate }}
        </div>
      </div>

    </div>

    <div>
      <h3>
        {{ t('card.project_team_description') }}
      </h3>

      <!-- <vue-good-table :columns="projectTeam.columns" :rows="projectTeam.rows" :sort-options="{ enabled: false }"
        style-class="table-style" /> -->
      <ul :style="'list-style-type: disc; margin-left: 20px;'">
        <li><b>Project coordinator:</b> {{ selectedProject.project_coordinator }}</li>
        <li><b>Inspector:</b> {{ selectedProject.inspector }}</li>
      </ul>

    </div>

  </div>
</template>

<style>
#completion-info {
  margin-top: 0.313rem;
}

.spacer {
  background-color: #eeeeee;
  border-bottom-width: 1px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-style: solid;
  border-color: rgb(204, 204, 204);
}

.main-ec-content {
  padding-top: 12px !important;

  .project-name {
    font-family: "Montserrat-SemiBold", "Montserrat SemiBold", "Montserrat", sans-serif !important;
    font-size: 28px !important;
    font-weight: 650 !important;
    color: #444444 !important;
    text-align: left !important;
    line-height: 30px !important;
  }

  .section-header {
    font-family: "Montserrat-SemiBold", "Montserrat SemiBold", "Montserrat", sans-serif !important;
    font-size: 24px !important;
    font-weight: 650 !important;
    line-height: 30px !important;
  }

  .card-h4 {
    font-family: "Open Sans Semibold", "Open Sans", sans-serif;
    font-size: 20px;
    font-weight: 600;
  }
}

.is-archive {
  margin-top: 6px;
  margin-bottom: 14px !important;
}

.ec-content {
  margin-bottom: 0px !important;
  margin-right: -.25rem;
  padding-top: .75rem;
  font-size: 14px;

  button:nth-child(1) {
    border-left-width: 0px;
  }

  .project-button-text {
    overflow: hidden;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .project-button {
    color: #0f4d90;
    font-size: 1rem;
    font-family: 'Montserrat', sans-serif;
    background-color: #eeeeee;
    cursor: pointer;
    border: 0px;
    border-bottom-width: 1px;
    border-style: solid;
    border-color: rgb(204, 204, 204);
    padding-left: 10px !important;
    padding-right: 10px !important;
    height: 48px;
  }

  .more-button {
    position: relative;
    color: #0f4d90;
    font-size: 1rem;
    font-family: 'Montserrat', sans-serif;
    background-color: #eeeeee;
    cursor: pointer;
    border: 0px;
    border-bottom-width: 1px;
    border-style: solid;
    border-color: rgb(204, 204, 204);
  }

  .more-zone {
    position: relative;

  }

  .project-selected {
    background-color: white;
    border-bottom: 0px;
  }

  .multiple-children {
    border-right-width: 1px;
  }

  .only-child {
    border-left-width: 0px;
    border-right-width: 1px;
  }
}

/* This is copied from phila-ui-3 and edited to match the project's design */
.table-style {
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  border: 0;

  thead {
    tr {
      th {
        background-clip: padding-box;
        position: relative;
        background-color: white;
        color: #444;
        font-weight: 600;
        font-size: 14px;
        padding: 6px 16px;
        line-height: 18px;
        border-top-width: 0px;
        border-left-width: 0px;
        border-right-width: 0px;
        border-bottom-width: 2px;
        border-style: solid;
        border-color: #444;

        &.sortable {
          cursor: pointer;
          padding-right: 20px;

          &:before,
          &:after {
            border-radius: 1px;
            content: "";
            display: block;
            height: 0;
            right: 8px;
            top: 8px;
            position: absolute;
            width: 0;
          }

          &:before {
            border-bottom-color: #444;
          }

          &:after {
            border-top-color: #444;
            margin-top: 12px;
          }

          &:hover {
            &:before {
              border-bottom-color: white;
            }

            &:after {
              border-top-color: white;
            }
          }

          &.sorting {
            background-color: #0f4d90;
            color: white;

            &.sorting-asc {
              &:before {
                border-bottom-color: #444;
              }

              &:after {
                border-top-color: #85b4e6;
              }
            }

            &.sorting-desc {
              &:before {
                border-bottom-color: #85b4e6;
              }

              &:after {
                border-top-color: white;
              }
            }
          }
        }
      }
    }
  }

  tbody {
    tr {
      &:nth-of-type(even) {
        td {
          background-color: #ffffff;
        }
      }

      td {
        background-clip: padding-box;
        position: relative;
        background-color: #f0f0f0;
        border-bottom-width: 1px;
        border-top-width: 0px;
        border-left-width: 0px;
        border-right-width: 0px;
        border-style: solid;
        border-color: #444;
        color: #444444;
        font-size: 14px;
        padding: 6px 16px;
        line-height: 28px;
      }
    }
  }

  &.is-align-middle {

    td,
    th {
      vertical-align: middle;
    }
  }

  &.table-responsive {
    width: 100%;
    overflow: hidden;
    overflow-x: auto;
  }
}
</style>
