<script setup>

// use these if running off unlinked package
import { useMainStore } from '@phila/pinboard';
import { useRoute, useRouter } from '@phila/pinboard';
// OR
// use this if running off linked package
// import { useMainStore } from '../../node_modules/@phila/pinboard/src/stores/MainStore.js';
// import { useRoute, useRouter } from '../../node_modules/@phila/pinboard/src/main.js';

import * as bulmaToast from 'bulma-toast'

bulmaToast.setDefaults({
  position: 'top-center',
  type: 'is-success',
  dismissible: true,
  closeOnClick: true,
  zIndex: 9999,
});

const router = useRouter();
const route = useRoute();

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const MainStore = useMainStore();

const props = defineProps({
  'item': {
    type: Object,
    default: () => {}
  },
  'featureId': {
    type: [String, Number],
    default: null
  },
  'isMobile': {
    type: Boolean,
    default: false
  }
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
  MainStore.printCheckboxes = [ props.featureId ];
  router.push({ name: 'printView'  });
}

</script>

<template>
  <div v-if="route.name !== 'printView'">
    <div style="text-align:right;">
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
