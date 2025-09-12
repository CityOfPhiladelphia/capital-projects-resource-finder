<script setup>

const publicPath = import.meta.env.VITE_PUBLICPATH || '/';

const props = defineProps({
  project: {
    type: Object,
    default: function(){
      return {};
    },
  }
});

const green = '#B9F2B1';
const blue = '#0E4D92';
const gray = '#F0F0F1';

const projectStatus = props.project.project_status.toLowerCase();

const completeColor = projectStatus === 'complete' ? blue : gray;

const planningStatus = projectStatus === 'planning' ? 'current' : (['design', 'construction', 'complete'].includes(projectStatus) ? 'past' : 'future');
const designStatus = projectStatus === 'design' ? 'current' : (['construction', 'complete'].includes(projectStatus) ? 'past' : (projectStatus === 'planning' ? 'future' : 'past'));
const constructionStatus = projectStatus === 'construction' ? 'current' : (projectStatus === 'complete' ? 'past' : (['planning', 'design'].includes(projectStatus) ? 'future' : 'past'));
const completeStatus = projectStatus === 'complete' ? 'current' : 'future';

const planningImage = planningStatus === 'past' ? 'images/normal_u153.svg' : (planningStatus === 'current' ? 'images/normal_u303.svg' : 'images/normal_u300.svg');
const designImage = designStatus === 'past' ? 'images/normal_u153.svg' : (designStatus === 'current' ? 'images/normal_u303.svg' : 'images/normal_u300.svg');
const constructionImage = constructionStatus === 'past' ? 'images/normal_u153.svg' : (constructionStatus === 'current' ? 'images/normal_u303.svg' : 'images/normal_u300.svg');
const completeImage = completeStatus === 'past' ? 'images/normal_u303.svg' : (completeStatus === 'current' ? 'images/normal_u303.svg' : 'images/normal_u300.svg');


</script>

<template>
  <div class="status-bar">

    <div :class="`chevron planning ${planningStatus}`">
      <img class="rotated-image" :src="publicPath + planningImage"></img>
    </div>
    <div :class="`chevron design ${designStatus}`">
      <img class="rotated-image" :src="publicPath + designImage"></img>
    </div>
    <div :class="`chevron construction ${constructionStatus}`">
      <img class="rotated-image" :src="publicPath + constructionImage"></img>
    </div>
    <div :class="`flag complete ${completeStatus}`" :style="`background: ${completeColor}`">
      <img class="spaced-image" :src="publicPath + completeImage"></img>
    </div>

  </div>

  <div class="status-labels">
    <div class="inline-block-div planning-div">
      Planning
    </div>
    <div class="inline-block-div design-div">
      Design
    </div>
    <div class="inline-block-div construction-div">
      Construction
    </div>
    <div class="inline-block-div complete-div">
      Complete
    </div>
  </div>

</template>

<style scoped>

.past:after {
  background: #B9F2B1;
}

.past:before {
  background: #B9F2B1;
}

.current:after {
  background: #0E4D92;
}

.current:before {
  background: #0E4D92;
}

.future:after {
  background: #F0F0F1;
}

.future:before {
  background: #F0F0F1;
}

.inline-block-div {
  display: inline-block;
}

.spaced-image {
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
}

.rotated-image {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-labels {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -1rem;
  margin-bottom: 1rem;
}

.chevron {
  text-align: center;
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
  z-index: 2;
}

.chevron:before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  height: 100%;
  width: 51%;
  -webkit-transform: skew(0deg, 45deg);
  -moz-transform: skew(0deg, 45deg);
  -ms-transform: skew(0deg, 45deg);
  -o-transform: skew(0deg, 45deg);
  transform: skew(0deg, 45deg);
}

.chevron:after {
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  right: 0;
  height: 100%;
  width: 50%;
  -webkit-transform: skew(0deg, -45deg);
  -moz-transform: skew(0deg, -45deg);
  -ms-transform: skew(0deg, -45deg);
  -o-transform: skew(0deg, -45deg);
  transform: skew(0deg, -45deg);
}

.flag {
  box-sizing: content-box;
  padding-top: 15px;
  position: relative;
  color: white;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-align: center;
  text-transform: uppercase;
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
}

.flag:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 0;
  height: 0;
}

@media (min-width: 1000px) {

  .chevron {
    margin-right: 52px;
    padding: 12px;
    height: 100px;
    width: 54px;
  }

  .flag {
    margin-left: -16px;
    width: 54px;
    height: 84px;
  }

  .flag:after {
    border-bottom: 28px solid white;
    border-left: 27px solid transparent;
    border-right: 27px solid transparent;
  }

  .spaced-image {
    margin-top: .75rem;
  }

  .rotated-image {
    margin-top: 1.75rem;
  }

  .planning-div {
    margin-right: 28px;
  }

  .design-div {
    margin-left: 28px;
    margin-right: 22px;
  }

  .construction-div {
    margin-left: 22px;
    margin-right: 12px;
  }

  .complete-div {
    margin-left: 12px;
    margin-right: 10px;
  }
}


@media (max-width: 999px) {

  .chevron {
    margin-right: 34px;
    padding: 8px;
    height: 72px;
    width: 44px;
  }

  .flag {
    margin-left: -6px;
    width: 44px;
    height: 64px;
  }

  .flag:after {
    border-bottom: 22px solid white;
    border-left: 22px solid transparent;
    border-right: 22px solid transparent;
  }

  .spaced-image {
    margin-top: .5rem;
  }

  .rotated-image {
    margin-top: 1rem;
  }

  .inline-block-div {
    font-size: 12px;
  }

  .planning-div {
    margin-right: 18px;
  }

  .design-div {
    margin-left: 18px;
    margin-right: 14px;
  }

  .construction-div {
    margin-left: 12px;
    margin-right: 8px;
  }

  .complete-div {
    margin-left: 10px;
  }

}

</style>

