<script setup>

import PrintShareSection from './PrintShareSection.vue';
import ButtonDropdown from './ButtonDropdown.vue';
import StatusBar from './statusBar.vue';
import accounting from 'accounting';

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

const selectedProjectName = ref(props.item.properties.projects[0].project_name);

const moreIsOpen = ref(false);

const handleProjectClick = (projectName) => {
  moreIsOpen.value = false;
  if (import.meta.env.VITE_DEBUG) console.log('handleProjectClick projectName:', projectName);
  selectedProjectName.value = projectName;
};

const handleMoreClick = () => {
  if (import.meta.env.VITE_DEBUG) console.log('handleMoreClick projectName:', 'more');
  moreIsOpen.value = true;
};

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

</script>

<template>
  <div class="ec-content columns is-multiline is-mobile">

    <button
      class="project-button column is-4 p-0"
      :class="{
        'project-selected': !moreIsOpen && item.properties.projects[0].project_name === selectedProjectName,
        'multiple-children': item.properties.projects.length > 1,
        'only-child': item.properties.projects.length == 1
      }"
      @click="handleProjectClick(item.properties.projects[0].project_name)"
    >
      <div class="has-text-centered p-1 pl-1 pr-1">
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
        <div class="has-text-centered p-1 pl-1 pr-1">
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
        <div class="has-text-centered p-1 pl-1 pr-1">
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
        class="has-text-centered p-1 pl-1 pr-1"
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
      <div class="has-text-centered p-1 pl-1 pr-1">
        {{ selectedProjectName }}
      </div>
    </button>

    <div class="more-zone column is-12 p-0">
      <button-dropdown
        v-if="moreIsOpen"
        :projects="excessProjects"
        :selectedProject="selectedProjectName"
        @clicked-project="handleProjectClick"
      >
      </button-dropdown>
    </div>

    <div v-if="item.properties.projects.length == 1" class="spacer column is-8"></div>
    <div v-if="item.properties.projects.length == 2"class="spacer column is-4"></div>
  </div>

  <div class='main-ec-content'>

    <print-share-section
      :item="selectedProject"
      v-if="selectedProject"
    />

    <div class="columns top-section">
      <div class="column is-6">
        <div
          v-if="selectedProject.site_address"
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
          v-if="selectedProject.client_dept"
          class="columns is-mobile"
        >
          <div class="column is-1">
            <font-awesome-icon icon="folder" />
          </div>
          <div
            class="column is-11"
            v-html="'<b>'+t('card.category')+': </b>'+selectedProject.client_dept"
          />
        </div>

        <div
          v-if="selectedProject.website_link"
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
          v-if="selectedProject.project_estimated_cost"
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
          v-if="selectedProject.council_district"
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
          v-if="selectedProject.contact_email"
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

      <div>
        {{ t('card.current_stage') }}: <a>{{ t('status.' + selectedProject.project_status.toLowerCase()) }}</a>
      </div>
    </div>

    <div>
      <h3>
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
      <div class="columns is-multiline is-gapless">
        
      </div>
    </div>

  </div>
</template>

<style scoped>

.spacer {
  background-color: #eeeeee;
  border-bottom-width: 1px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-style: solid;
  border-color: rgb(204,204,204);
}

.ec-content {
  margin-right: -.25rem;
  padding-top: .75rem;
  font-size: 14px;

  button:nth-child(1) {
    border-left-width: 0px;
    /* border-right-width: 0px; */
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
    /* border-left-width: 1px; */
    border-right-width: 1px;
  }

  .only-child {
    border-left-width: 0px;
    border-right-width: 1px;
  }

}

.ec-content-mobile {
  padding-top: 1rem;
  padding-bottom: 5rem;
  font-size: 14px;
}

</style>