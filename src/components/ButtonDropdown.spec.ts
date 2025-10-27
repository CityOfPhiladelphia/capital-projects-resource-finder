import { test, expect } from '@playwright/experimental-ct-vue';
import ButtonDropdown from './ButtonDropdown.vue';

// const sqlQuery = `
//   https://phl.carto.com/api/v2/sql?q=
//   SELECT
//     project_name,
//     client_category AS project_category,
//     project_scope,
//     project_status,
//     project_estimated_cost,
//     estimated_completion_season,
//     estimated_completion_year,
//     actual_completion,
//     archive_date,
//     project_coordinator,
//     inspector,
//     contact_email,
//     website_link,
//     fields_hash
//   FROM capital_projects_for_finder
//   WHERE site_code = (
//     SELECT mode() WITHIN GROUP ( ORDER BY site_code )
//     FROM capital_projects_for_finder
//   )
// `

const testProjects = [
  {
    project_name: 'PROJECT 1',
    fields_hash: '12345'
  },
  {
    project_name: 'PROJECT 2',
    fields_hash: 'abcde'
  },
  {
    project_name: 'PROJECT 3',
    fields_hash: '!@#$%'
  },
]



test.describe("Test ButtonDropdown When NONE are Selected", () => {

  const testProps = {
    projects: testProjects,
    selectedProject: ''
  }

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

  const testProps = {
  projects: testProjects,
  selectedProject: testProjects[0].fields_hash
}

  test("Selected button's background color should not change on hover", async ({ mount }) => {
    const dropdown = await mount(ButtonDropdown, { props: testProps } );

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
  });

})
