<script setup>

import { useConfigStore } from '@pinboard';
const $config = useConfigStore().config;

if (import.meta.env.VITE_DEBUG) console.log('$config:', $config);

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});

</script>

<template>
  <div class="main-greeting">

    <div class="half-data-section">
      <h3 v-html="t('introPage.h3_2')" />
    </div>

    <div class="half-data-section">
      <p v-html="t('introPage.p3')" />
    </div>

    <div class="half-data-section">
      <ul class="bullet-list">
        <li v-for="(item, index) in $config.i18n.data.messages['en'].introPage.ul2" :key="index">
          {{ t('introPage.ul2.' + index) }}
        </li>
      </ul>
    </div>

    <div class="half-data-section">
      <p v-html="t('introPage.p4')" />
    </div>

    <div class="half-data-section">
      <p v-html="t('introPage.p5')" />
    </div>

    <div class="half-data-section">
      <div class="has-text-centered container">
        <button class="button greeting-button" @click="$emit('view-list')" v-html="$t('app.viewList')" />
        <button v-if="isMobile" class="button greeting-button" @click="$emit('view-map')" v-html="$t('app.viewMap')" />
      </div>
    </div>

    <div class="half-data-section">
      <h3 v-html="t('introPage.h3_1')" />
    </div>

    <div class="half-data-section">
      <p v-html="t('introPage.p1')" />
    </div>

    <div class="half-data-section">
      <ul class="bullet-list">
        <li v-for="(item, index) in $config.i18n.data.messages['en'].introPage.ul1" :key="index">
          {{ t('introPage.ul1.' + index) }}
        </li>
      </ul>
    </div>

    <div class="half-data-section">
      <p v-html="t('introPage.p2')" />
    </div>

    <div class="half-data-section">
      <h3 v-html="t('introPage.h3_3')" />
    </div>

    <div class="half-data-section">
      <p v-html="t('introPage.p6')" />
    </div>

  </div>

</template>

<style lang="scss" scoped>
.main-greeting {
  padding: 1rem;
}

.greeting-button {
  background-color: #0f4d90 !important;
  border-color: #0f4d90 !important;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  margin: 1rem;
}

.greeting-button:hover {
  background-color: #444444 !important;
}

.half-data-section {
  margin-bottom: 1rem;
}
</style>
