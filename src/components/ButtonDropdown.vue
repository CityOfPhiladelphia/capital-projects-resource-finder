<script setup>

const props = defineProps({
  projects: {
    type: Array,
    default: function(){
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
  const projects = [ ...props.projects ];
  return projects.splice(0, projects.length - 1);
});

const lastProject = computed(() => {
  const projects = [ ...props.projects ];
  return projects.pop();
});

</script>

<template>
  <div class="dropdown column is-4 is-hoverable">

    <button
      v-for="project in firstProjects"
      :key="project.project_name"
      class="project-button column is-4 p-0"
      :class="{ 'is-selected': project.project_name == props.selectedProject }"
      @click="$emit('clickedProject', project.project_name)"
    >
      <div class="button-div-1 has-text-centered p-1 pl-1 pr-1">
        <div class="button-div-2">
          {{ project.project_name }}
        </div>
      </div>
    </button>

    <button
      class="project-button column is-4 p-0"
      :class="{ 'is-selected': lastProject.project_name == props.selectedProject }"
      @click="$emit('clickedProject', lastProject.project_name)"
    >
      <div class="button-div-1 has-text-centered p-1 pl-1 pr-1">
        <div class="button-div-3">
          {{ lastProject.project_name }}
        </div>
      </div>
    </button>

  </div>
</template>

<style scoped>

.dropdown {
  position: absolute;
  top: 0;
  right:0;
  background-color: white;
  z-index: 10;
  padding: 0;
  border-left-width: 1px;
  border-bottom-width: 1px;
  border-right-width: 0px;
  border-top-width: 0px;
  border-style: solid;
  border-color: rgb(204,204,204);
}

.project-button {
  width: 100%;
  color: #0f4d90;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
  background-color: white;
  cursor: pointer;
  border-width: 0px;
  :hover {
    background-color: #eeeeee;
  }
}

.is-selected {
  background-color: #0f4d90 !important;
  color: white !important;
  :hover {
    background-color: #0f4d90 !important;
  }
}

.button-div-1 {
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  border-width: 0px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding-left: 16px !important;
  padding-right: 16px !important;
}

.button-div-2 {
  border-left-width: 0px;
  border-bottom-width: 1px;
  border-right-width: 0px;
  border-top-width: 0px;
  border-style: solid;
  border-color: rgb(204,204,204);
  padding: 4px;
}

.button-div-3 {
  border-width: 0px;
  padding: 4px;
}



</style>