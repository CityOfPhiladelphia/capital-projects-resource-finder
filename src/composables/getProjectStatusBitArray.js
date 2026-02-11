import { isArchiveProject } from './isArchiveProject'

// function for getting the counts of locations to return based on the status toggle
// data structure is a bit array, where each set bit corresponds to a site having an archived or active status project at it
// set bits are summed in Pinboard to display the correct numbers in the LocationsPanel message
// because sites can have both active and archived projects, bit arrays for each toggle state are calculated to account for overlap
export const getProjectStatusBitArray = (locations) => {
  const bufferLength = Math.ceil(locations.length / 8); // ArrayBuffers are declared in 8-bit chunks
  const bufferToggleOff = new ArrayBuffer(bufferLength); // buffers for toggle on and off statuses
  const bufferToggleOn = new ArrayBuffer(bufferLength);
  const viewToggleOff = new DataView(bufferToggleOff); // DataViews for each ArrayBuffer
  const viewToggleOn = new DataView(bufferToggleOn);

  let bitsToSet_toggleOn, bitsToSet_toggleOff = 0; // accumulate set bits before being pushed into buffer
  let offset = 0; // tracks the offset for setting a portion of the ArrayBuffer
  let setBit = 1; // gets shifted to the left once every cycle to set bits in the views

  // for each location, check if any project at site is archived and set a bit if so
  // do the same to set bits for non-archived
  // both are required since a single site may have a mix of archived and active projects
  locations.forEach((location, i) => {
    bitsToSet_toggleOff |= location.properties.projects.some((project) => !isArchiveProject(project)) ? setBit : 0;
    bitsToSet_toggleOn |= location.properties.projects.some((project) => isArchiveProject(project)) ? setBit : 0;
    setBit <<= 1; // shift setBit to the left: 00000010 <<= 00000001

    // on 8th iteration, push bits to buffers and reset accumulators and setBit
    if (i % 8 === 7) {
      viewToggleOff.setUint8(offset, bitsToSet_toggleOff);
      viewToggleOn.setUint8(offset, bitsToSet_toggleOn);
      bitsToSet_toggleOff = bitsToSet_toggleOn = 0;
      setBit = 1;
      offset++; // increment offset for next push to buffers
    }
  })

  if (bitsToSet_toggleOff | bitsToSet_toggleOn) { // push remaining bits to buffers if forEach ended when i % 8 != 7
    viewToggleOff.setUint8(offset, bitsToSet_toggleOff);
    viewToggleOn.setUint8(offset, bitsToSet_toggleOn);
  }

  return { // returns object with toggle status keys for each ArrayBuffer
    toggleOff: bufferToggleOff,
    toggleOn: bufferToggleOn
  }
}
