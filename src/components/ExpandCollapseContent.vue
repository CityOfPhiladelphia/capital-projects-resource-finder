<script setup>

import PrintShareSection from './PrintShareSection.vue';
import ButtonDropdown from './ButtonDropdown.vue';
import StatusBar from './statusBar.vue';
import accounting from 'accounting';
import { ref, computed, watch } from 'vue';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
  item: {
    type: Object,
    default: function(){
      return {};
    },
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.item,
  async newProjects => {
    locationProjects.value = newProjects;
    selectedProjectName.value = newProjects.properties.projects[0].project_name;
    moreIsOpen.value = false;
  }
)

const locationProjects = ref(props.item);
const selectedProjectName = ref(props.item.properties.projects[0].project_name);
const moreIsOpen = ref(false);

const selectedProject = computed(() => {
  return props.item.properties.projects.find(project => project.project_name === selectedProjectName.value);
});

const excessProjects = computed(() => {
  let projects = [ ...props.item.properties.projects ];
  console.log('projects:', projects);
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
      name: function(selectedProject) { if (selectedProject) return selectedProject.value.project_coordinator },
      role: 'Project Coordinator'
    },
    {
      name: function(selectedProject) { if (selectedProject) return selectedProject.value.inspector },
      role: 'Inspector'
    },
  ];
  return { columns, rows };
});

// methods
const parseAddress = (address) => {
  const formattedAddress = address.replace(/(Phila.+)/g, city => `<div>${city}</div>`).replace(/^\d+\s[A-z]+\s[A-z]+/g, lineOne => `<div>${lineOne}</div>`).replace(/,/, '');
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

</script>

<template>
  <div class="ec-content button-row is-multiline columns is-mobile">

    <button
      class="project-button column is-4 p-0"
      :class="{
        'project-selected': !moreIsOpen && item.properties.projects[0].project_name === selectedProjectName,
        'multiple-children': item.properties.projects.length > 1,
        'only-child': item.properties.projects.length == 1
      }"
      @click="handleProjectClick(item.properties.projects[0].project_name)"
    >
      <div class="project-button-text has-text-centered p-1 pl-1 pr-1">
        {{ item.properties.projects[0].project_name }}
      </div>
    </button>

    <button
      v-if="item.properties.projects.length > 1"
      class="project-button column is-4 p-0"
      :class="{
        'project-selected': !moreIsOpen && item.properties.projects[1].project_name === selectedProjectName,
        'multiple-children': item.properties.projects.length > 1,
        'only-child': item.properties.projects.length == 1
      }"
      @click="handleProjectClick(item.properties.projects[1].project_name)"
      >
        <div class="project-button-text has-text-centered p-1 pl-1 pr-1">
          {{ item.properties.projects[1].project_name }}
        </div>
    </button>

    <button
      v-if="item.properties.projects.length == 3"
      class="project-button column is-4 p-0"
      :class="{
        'project-selected': !moreIsOpen && item.properties.projects[2].project_name === selectedProjectName,
        'multiple-children': item.properties.projects.length > 1,
        'only-child': item.properties.projects.length == 1
      }"
      @click="handleProjectClick(item.properties.projects[2].project_name)"
      >
        <div class="project-button-text has-text-centered p-1 pl-1 pr-1">
          {{ item.properties.projects[2].project_name }}
        </div>
    </button>

    <button
      v-if="item.properties.projects.length > 3 && !excessProjectSelected"
      class="project-button column is-4 p-0"
      :class="{ 'project-selected': moreIsOpen }"
      @click="handleMoreClick()"
    >
      <div
        class="project-button-text has-text-centered p-1 pl-1 pr-1"
        :class="{ 'project-selected': 'more' === selectedProjectName }"
      >
        More
        <font-awesome-icon v-if="!moreIsOpen" icon="caret-down" />
        <font-awesome-icon v-if="moreIsOpen" icon="caret-up" />
      </div>
    </button>

    <button
      v-if="excessProjectSelected"
      class="project-button column is-4 p-0 project-selected"
      @click="handleMoreClick()"
    >
      <div class="project-button-text has-text-centered p-1 pl-1 pr-1">
        {{ selectedProjectName }}
      </div>
    </button>

    <div v-if="item.properties.projects.length == 1" class="spacer column is-8"></div>
    <div v-if="item.properties.projects.length == 2" class="spacer column is-4"></div>

    <div class="more-zone column is-12 p-0">
      <button-dropdown
        v-if="moreIsOpen"
        :projects="excessProjects"
        :selectedProject="selectedProjectName"
        @clicked-project="handleProjectClick"
      >
      </button-dropdown>
    </div>

  </div>

  <div class='main-ec-content'>

    <print-share-section
      :item="selectedProject"
      :featureId="props.item._featureId"
      v-if="selectedProject"
    />

    <div>
      <h3>{{ selectedProject.project_name }}</h3>
    </div>

    <div class="columns top-section">
      <div class="column is-6">
        <div
          v-if="selectedProject && selectedProject.site_address"
          class="columns is-mobile"
        >
          <div class="column is-1">
            <font-awesome-icon icon="map-marker-alt" />
          </div>
          <div
            class="column is-11"
            v-html="parseAddress(selectedProject.site_address)"
          />
        </div>

        <div
          v-if="selectedProject && selectedProject.client_category"
          class="columns is-mobile"
        >
          <div class="column is-1">
            <font-awesome-icon icon="folder" />
          </div>
          <div
            class="column is-11"
            v-html="'<b>'+t('card.category')+': </b>'+selectedProject.client_category"
          />
        </div>

        <div
          v-if="selectedProject && selectedProject.website_link"
          class="columns is-mobile website-div"
        >
          <div
            class="column is-1"
          >
            <font-awesome-icon icon="globe" />
          </div>
          <div class="column is-11">
            <a
              target="_blank"
              :href="makeValidUrl(selectedProject.website_link)"
            >
              {{ selectedProject.website_link }}
            </a>
          </div>
        </div>

      </div>

      <div class="column is-6">

        <div
          v-if="selectedProject && selectedProject.project_estimated_cost"
          class="columns is-mobile"
        >
          <div
            class="column is-1"
          >
            <font-awesome-icon icon="money-check-dollar" />
          </div>
          <div
            class="column is-11"
            v-html="'<b>'+t('card.budget')+': </b>'+ accounting.formatMoney(selectedProject.project_estimated_cost)"
          />

        </div>

        <div
          v-if="selectedProject && selectedProject.council_district"
          class="columns is-mobile"
        >
          <div
            class="column is-1"
          >
            <font-awesome-icon icon="chart-tree-map" />
          </div>
          <div class="column is-11">
            {{ t('card.district') }} {{ selectedProject.council_district }}
          </div>
        </div>

        <div
          v-if="selectedProject && selectedProject.contact_email"
          class="columns is-mobile"
        >
          <div
            class="column is-1"
          >
            <font-awesome-icon icon="envelope" />
          </div>
          <div class="column is-11">
            <a :href="`mailto:${selectedProject.contact_email}`">{{ selectedProject.contact_email }}</a>
          </div>
        </div>


      </div>
    </div>

    <div>
      <h3>
        {{ t('card.section_description') }}
      </h3>
      <div class="columns is-multiline is-gapless">
        {{  t('card.description_text') }}
      </div>
    </div>

    <div>
      <h3>
        {{ t('card.section_status') }}
      </h3>
      <div class="columns is-multiline is-gapless mb-0">
        {{  t('card.status_text') }}
      </div>

      <status-bar
        :project="selectedProject"
      />

      <div v-if="selectedProject">
        {{ t('card.current_stage') }}: <a>{{ t('status.' + selectedProject.project_status.toLowerCase()) }}</a>
      </div>
    </div>

    <div>
      <h3 v-if="selectedProject">
        {{ t('card.estimated_completion_description') }}: {{ selectedProject.estimated_completion }}
      </h3>
      <div class="columns is-multiline is-gapless">
        {{  t('card.description_text') }}
      </div>
    </div>

    <div>
      <h3>
        {{ t('card.project_team_description') }}
      </h3>

      <vue-good-table
        :columns="projectTeam.columns"
        :rows="projectTeam.rows"
        :sort-options="{ enabled: false }"
        style-class="table-style"
      />

    </div>

  </div>
</template>

<style>

.button-row {
  height: 50px;
}

.spacer {
  background-color: #eeeeee;
  border-bottom-width: 1px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-style: solid;
  border-color: rgb(204,204,204);
}

.main-ec-content {
  padding-top: 0px !important;
}

.ec-content {
  margin-right: -.25rem;
  padding-top: .75rem;
  font-size: 14px;

  button:nth-child(1) {
    border-left-width: 0px;
  }

  .project-button-text {
    box-sizing: border-box;
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
    border-color: rgb(204,204,204);
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
    border-color: rgb(204,204,204);
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
