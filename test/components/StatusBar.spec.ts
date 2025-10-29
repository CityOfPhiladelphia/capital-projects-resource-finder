import { test, expect } from '@playwright/experimental-ct-vue';
import StatusBar from '../../src/components/StatusBar.vue';

const color_hex2rgb = (hexColorCode) => {
  return `rgb(${Number(`0x${hexColorCode.substring(1, 3)}`)}, ${Number(`0x${hexColorCode.substring(3, 5)}`)}, ${Number(`0x${hexColorCode.substring(5)}`)})`
}

const green = color_hex2rgb('#B9F2B1');
const blue = color_hex2rgb('#0E4D92');
const gray = color_hex2rgb('#F0F0F1');

const projectStatuses = ['planning', 'design', 'construction', 'complete'];
const backgroundColorGroups = [
  [blue, gray, gray, gray],
  [green, blue, gray, gray],
  [green, green, blue, gray],
  [green, green, green, green]
];

test.describe("StatusBar: Component Rendering Tests", () => {

  projectStatuses.forEach((status, i) => {

    test.describe(`StatusBar(${status}) section colors are correct`, () => {
      const testProps = {
        project: {
          project_status: status,
        }
      }
      test(`${status}, ${projectStatuses[0]} section renders the correct color`, async ({ mount }) => {
        const statusBar = await mount(StatusBar, { props: testProps });
        const section = await statusBar.getByTestId(projectStatuses[0]);
        const segmentBackgroundColor = await section.evaluate((el) => {
          return window.getComputedStyle(el, '::before').getPropertyValue('background-color');
        });
        await expect(segmentBackgroundColor).toEqual(backgroundColorGroups[i][0])
      })

      test(`${status}, ${projectStatuses[1]} section renders the correct color`, async ({ mount }) => {
        const statusBar = await mount(StatusBar, { props: testProps });
        const section = await statusBar.getByTestId(projectStatuses[1]);
        const segmentBackgroundColor = await section.evaluate((el) => {
          return window.getComputedStyle(el, '::before').getPropertyValue('background-color');
        });
        await expect(segmentBackgroundColor).toEqual(backgroundColorGroups[i][1])
      })

      test(`${status}, ${projectStatuses[2]} section renders the correct color`, async ({ mount }) => {
        const statusBar = await mount(StatusBar, { props: testProps });
        const section = await statusBar.getByTestId(projectStatuses[2]);
        const segmentBackgroundColor = await section.evaluate((el) => {
          return window.getComputedStyle(el, '::before').getPropertyValue('background-color');
        });
        await expect(segmentBackgroundColor).toEqual(backgroundColorGroups[i][2])
      })

      test(`${status}, ${projectStatuses[3]} section renders the correct color`, async ({ mount }) => {
        const statusBar = await mount(StatusBar, { props: testProps });
        const section = await statusBar.getByTestId(projectStatuses[3]);
        const segmentBackgroundColor = await section.evaluate((el) => {
          return window.getComputedStyle(el, '::before').getPropertyValue('background-color');
        });
        await expect(segmentBackgroundColor).toEqual(backgroundColorGroups[i][3])
      })
    })
  })
})
