import { test, expect } from '@playwright/experimental-ct-vue';
import ButtonDropdown from '../../src/components/ButtonDropdown.vue';
import { STORAGE_PROJECTS } from '../../playwright-ct.config';
import fs from 'fs'

let testProjects = []

try {
  const projs = fs.readFileSync(STORAGE_PROJECTS, { encoding: 'utf8', flag: 'r' })
  testProjects = JSON.parse(projs).rows[0].projects
} catch (err) {
  console.error('Error reading projects from file:', err);
}

const testProps = {
  projects: testProjects,
  selectedProject: ''
}

test.describe("ButtonDropdown: Full Functional Component Test", () => {

  test.describe('General Tests Independent of State', () => {

    test("Dropdown renders the correct number of buttons", async ({ mount }) => {
      const dropdown = await mount(ButtonDropdown, { props: testProps });
      const numButtons = await dropdown.getByRole('button').count();
      await expect(numButtons).toEqual(testProjects.length);
    });

    test('Buttons display their text', async ({ mount }) => {
      const dropdown = await mount(ButtonDropdown, { props: testProps });
      for (let i = 0; i < testProjects.length; i++) {
        await expect(dropdown.locator(`id=${testProjects[i].fields_hash}`)).toContainText(testProjects[i].project_name);
      }
    });

    test("Buttons should emit their fields_hash when clicked", async ({ mount }) => {
      const emittedValues = [];
      const dropdown = await mount(ButtonDropdown, {
        props: testProps,
        on: {
          clickedProject: clickedHash => emittedValues.push(clickedHash)
        }
      });

      for (let i = 0; i < testProjects.length; i++) {
        await dropdown.locator(`id=${testProjects[i].fields_hash}`).click();
        await expect(emittedValues[i]).toEqual(testProjects[i].fields_hash)
      }
    });
  })

  test.describe('Tests That Depend on Current State', () => {

    test.describe("Test ButtonDropdown When NONE are Selected", () => {

      test("Unselected buttons background color should change on hover", async ({ mount }) => {
        const dropdown = await mount(ButtonDropdown, { props: testProps });

        for (let i = 0; i < testProjects.length; i++) {
          const button = await dropdown.locator(`id=${testProjects[i].fields_hash}`);
          const initialBackgroundColor = await button.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue('background-color');
          });

          await button.hover();
          const hoverBackgroundColor = await button.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue('background-color');
          });

          await expect(initialBackgroundColor === hoverBackgroundColor).toBeFalsy();
        }
      });
    })

    test.describe("Test ButtonDropdown When ONE is Selected", () => {

      test("Selected button's background color should not change on hover", async ({ mount }) => {
        const dropdown = await mount(ButtonDropdown, {
          props: {
            projects: testProjects,
            selectedProject: testProjects[0].fields_hash
          }
        });

        for (let i = 0; i < testProjects.length; i++) {
          const button = await dropdown.locator(`id=${testProjects[i].fields_hash}`);
          const initialBackgroundColor = await button.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue('background-color');
          });

          await button.hover();
          const hoverBackgroundColor = await button.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue('background-color');
          });

          if (i) {
            await expect(initialBackgroundColor === hoverBackgroundColor).toBeFalsy();
          }
          else {
            await expect(initialBackgroundColor).toEqual(hoverBackgroundColor)
          }
        }
      })
    })
  })
})
