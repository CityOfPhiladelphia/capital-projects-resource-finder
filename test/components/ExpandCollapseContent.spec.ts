import { test, expect } from '@playwright/experimental-ct-vue';
import ExpandCollapseContent from '../../src/components/ExpandCollapseContent.vue';
import { STORAGE_PROJECTS } from '../../playwright-ct.config';
import fs from 'fs'

test.describe("ExpandCollapseContent: Component Rendering Tests", () => {

  let testSite = {
    council_district: null,
    lat: null,
    lon: null,
    projects: [{
      _featureId: null
    }],
    site_address: null,
    site_category: null,
    site_code: null,
    site_name: null,
    _featureId: null
  };

  try {
    const projs = fs.readFileSync(STORAGE_PROJECTS, { encoding: 'utf8', flag: 'r' })
    testSite = JSON.parse(projs).rows[0]
  } catch (err) {
    console.error('Error reading projects from file:', err);
  }

  test.describe("ExpandCollapseContent: Desktop Rendering", () => {

    const testProps = {
      item: {
        properties: testSite,
        _featureId: testSite.projects[0]._featureId
      },
      isMobile: false
    }

    test.describe("ExpandCollapseContent renders the correct number of tab buttons", () => {

      // test(`ExpandCollapseContent has 0 tabs when site has only 1 project`, async ({ mount }) => {
      //   testProps.item.properties.projects = testSite.projects.slice(0,1)
      //   const expandCollapseContent = await mount(ExpandCollapseContent, { props: testProps });
      //   await expect(expandCollapseContent.getByTestId('main-content')).toBeVisible();
      //   await expect(expandCollapseContent.getByTestId('tab-button-bar')).not.toBeVisible();
      // })

      test(`ExpandCollapseContent has 2 tabs when site has 2 projects`, async ({ mount }) => {
        testProps.item.properties.projects = testSite.projects.slice(0,2)
        console.log(testProps)
        const comp = await mount(ExpandCollapseContent, { props: testProps });
        await expect(comp.getByTestId('tab-button-bar')).toBeVisible();
        await expect(comp.getByTestId('tab-button-first')).toBeVisible();
        await expect(comp.getByTestId('tab-button-second')).toBeVisible();
        await expect(comp.getByTestId('tab-spacer-single')).toBeVisible();
      })

    })

  })

})
