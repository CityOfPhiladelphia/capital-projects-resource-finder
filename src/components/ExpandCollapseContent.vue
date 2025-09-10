<script setup>

import PrintShareSection from './PrintShareSection.vue';
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

const parseServiceList = (list) => {
  console.log('parseServiceList:', list);
  let formattedService = [];
  for (let i=0; i < list.length; i++) {
    if (list[i] === 'Legal services') {
      let legalLink = props.item.properties.website_legal;
      let link = `<a href="${legalLink}" target="_blank">${t(list[i])} <i class='fa fa-external-link-alt'></i></a>`;
      formattedService.push(link);
    } else {
      formattedService.push(t(list[i]));
    }
  }
  return formattedService;
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

const parseTagsList = (list) => {
  let formattedTags = list.slice();
  let finalTags = [];
  // if (import.meta.env.VITE_DEBUG) console.log('formattedTags:', formattedTags);
  for (let tag of formattedTags) {
    let singleTag = tag.split(' and ');
    for (let i=0; i < singleTag.length; i++) {
      // console.log('singleTag[i]:', singleTag[i]);
      // finalTags.push(t(`${singleTag[i].toLowerCase()}`));
      finalTags.push(t(singleTag[i].toLowerCase()));
    }
  }
  // console.log('finalTags:', finalTags);
  return finalTags.sort().join(", ");
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
    class="project-select column is-4-desktop is-3-mobile has-text-centered add-borders pl-1 pr-1"
    :class="{ 'project-selected': project.project_name === selectedProjectName }"
    @click="handleProjectClick(project.project_name)"
    >
    {{ project.project_name }}
  </button>
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
            v-html="'<b>Category: </b>'+selectedProject.client_dept"
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
            v-html="'<b>Budget: </b>'+ accounting.formatMoney(selectedProject.project_estimated_cost)"
          />
            
        </div>

        <div
          v-if="selectedProject.council_district"
          class="columns is-mobile"
        >
          <div
            class="column is-1"
          >
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </div>
          <div class="column is-11">
            District {{ selectedProject.council_district }}
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

    <div
      v-if="selectedProject.services_offered"
    >
      <h3>
        {{ t('app.servicesOffered') }}
      </h3>
      <div class="columns is-multiline is-gapless">
        <div
          v-for="i in parseServiceList(selectedProject.services_offered)"
          :key="i"
          class="column is-half"
          v-html="i"
        >
        </div>
      </div>
    </div>

    <div
      v-if="selectedProject.tags && selectedProject.tags.length"
    >
      <h3>
        {{ $t('languagesSpoken') }}
      </h3>
      <div>
        {{ parseTagsList(selectedProject.tags) }}
      </div>
    </div>
  </div>
</template>

<style scoped>

.project-select {
  color: #444444;
  font-size: 1rem;
  background-color: #eeeeee;
  cursor: pointer;
}

.project-selected {
  background-color: white;
  font-weight: bold;
  border-bottom: 0px;
}

.ec-content {
  padding-top: .75rem;
  padding-bottom: 3rem;
  font-size: 14px;

  a {
    color: #0f4d90;
    font-weight: bold;
    text-decoration: underline;
  }
}

.ec-content-mobile {
  padding-top: 1rem;
  padding-bottom: 5rem;
  font-size: 14px;

  a {
    color: #0f4d90;
    font-weight: bold;
    text-decoration: underline;
  }
}

</style>