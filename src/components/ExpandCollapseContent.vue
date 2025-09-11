<script setup>

import PrintShareSection from './PrintShareSection.vue';
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

const handleProjectClick = (projectName) => {
  selectedProjectName.value = projectName;
};

const selectedProject = computed(() => {
  return props.item.properties.projects.find(project => project.project_name === selectedProjectName.value);
});

</script>

<template>
  <div class="ec-content columns is-multiline is-mobile">
    <button
      v-for="project in item.properties.projects"
      :key="project.objectid"
      class="project-select column is-4 p-0"
      :class="{ 'project-selected': project.project_name === selectedProjectName }"
      @click="handleProjectClick(project.project_name)"
      >
        <div
          class="has-text-centered add-borders p-1 pl-1 pr-1"
          :class="{ 
            'project-selected': project.project_name === selectedProjectName,
            'first-child': item.properties.projects.length > 1,
            'only-child': item.properties.projects.length == 1
          }"
        >
          {{ project.project_name }}
        </div>
    </button>
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

.project-select {
  color: #0f4d90;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
  background-color: #eeeeee;
  cursor: pointer;
  border: 0px;
}

.project-selected {
  background-color: white;
  border-bottom: 0px;
  /* font-weight: bold; */
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

.ec-content {
  margin-right: -.25rem;
  padding-top: .75rem;
  font-size: 14px;

  button:nth-child(1) {
    border-left-width: 0px;
    border-right-width: 0px;

    .first-child {
      border-left-width: 0px;
      border-right-width: 0px;
    }

    .only-child {
      border-left-width: 0px;
      border-right-width: 1px;
    }
  }
}

.ec-content-mobile {
  padding-top: 1rem;
  padding-bottom: 5rem;
  font-size: 14px;
}

</style>