<script setup>
import { computed } from 'vue';

const props = defineProps({
  projects: {
    type: Array,
    default: function () {
      return [];
    },
  },
  selectedProject: {
    type: String,
    default: '',
  },
});

const $emit = defineEmits(['clickedProject']);

const firstProjects = computed(() => {
  return [...props.projects];
});

</script>

<template>
  <div class="dropdown column is-4 is-hoverable">

    <button v-for="project in firstProjects" :key="project.fields_hash"
      class="project-button-dropdown column has-text-centered pl-1 pr-1 is-4 p-0" :class="{
        'is-selected': project.fields_hash == props.selectedProject,
      }" @click="$emit('clickedProject', project.fields_hash)">
      <div class="project-button-text has-text-centered pl-1 pr-1">
        {{ project.project_name }}
      </div>
    </button>

  </div>
</template>

<style scoped>
.dropdown {
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  z-index: 5;
  padding: 0;
  border-style: solid;
  border-color: rgb(204, 204, 204);
  border-top-width: 0px;
  border-bottom-width: 0px;
  border-left-width: 1px;
  border-right-width: 0px;
  width: 33.4%;
}

.project-button-dropdown {
  width: 100%;
  height: 48px;
  color: #0f4d90;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-width: 0px;
  border-bottom-width: 1px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-style: solid;
  border-color: rgb(204, 204, 204);
}

.project-button-text {
  overflow: hidden;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.project-button-dropdown:hover {
  background-color: #eeeeee;
}

.is-selected {
  background-color: #0f4d90 !important;
  color: white !important;
}
</style>
