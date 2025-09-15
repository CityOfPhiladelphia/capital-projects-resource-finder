<script setup>

// import { useMainStore } from '../stores/MainStore.js';
// import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import * as bulmaToast from 'bulma-toast'

bulmaToast.setDefaults({
  position: 'top-center',
  type: 'is-success',
  dismissible: true,
  closeOnClick: true,
  zIndex: 9999,
});

// const route = useRoute();
// const router = useRouter();

// console.log('route:', route);

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// const MainStore = useMainStore();

const props = defineProps({
  'item': {
    type: Object,
    default: {},
  },
});

const showPrintAndShare = computed(() => {
  let value = false;
  // if (route.name == 'home') {
    value = true;
  // }
  return value;
});

const isMobile = computed(() => {
  // return MainStore.windowDimensions.width < 768;
});

const clickedShare = () => {
  if (import.meta.env.VITE_DEBUG) console.log('clickedShare is running');
  var dummy = document.createElement('input'),
    text = window.location.href;

  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);

  bulmaToast.toast({
    message: t('copiedUrl'),
    type: 'is-success',
  })
};

const clickedPrint = () => {
  if (import.meta.env.VITE_DEBUG) console.log('clickedPrint is running');
  // MainStore.printCheckboxes = [ props.item._featureId ];
  // router.push({ name: 'printView'  });
}

</script>

<template>
  <div>
    <div
      v-if="showPrintAndShare"
      style="text-align:right;"
    >
      <button
        class="button is-small card-button"
        @click="clickedShare"
      >
        <font-awesome-icon icon="share-alt" />
        <span class="card-button-text">
          {{ $t('share') }}
        </span>
      </button>
      <button
        v-if="!isMobile"
        class="button is-small card-button"
        @click="clickedPrint"
      >
        <font-awesome-icon icon="print" />
        <span class="card-button-text">
          {{ $t('print') }}
        </span>
      </button>
    </div>
  </div>
</template>

<style>

.card-button {
  border-width: 0px;
  color: #0f4d90;
}

.card-button:hover {
  color: black;
}

.card-button:focus:not(:active), .card-button.is-focused:not(:active) {
  box-shadow: none !important;
}
.card-button-text {
  font-family: "OpenSans-Regular", "Open Sans", sans-serif;
  font-size: 14px;
  padding-left: 5px;
  text-transform: none;
}

</style>
