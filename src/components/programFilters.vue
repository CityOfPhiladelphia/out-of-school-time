<template>
  <div
    class="jb-sidebar-filters"
    :class="{ 'in-modal': vModal }"
  >
    <div class="jb-sidebar-filters-wrap">
      <h2 class="jb-sidebar-header jb-first-sidebar-header bg-ghost-gray">
        Age
      </h2>
      <div
        v-for="filter in programAgeFilters"
        :key="filter.label"
        class="checkbox-wrap"
      >
        <input
          :id="filter.matchValue"
          type="checkbox"
          :value="filter.matchValue"
          :checked="isFilterChecked(filter.matchValue, 'programage')"
          @change="updateFilters('programage', $event)"
        >
        <label :for="filter.matchValue"><div>{{ filter.label }}</div></label>
      </div>
      <h2 class="jb-sidebar-header jb-first-sidebar-header bg-ghost-gray">
        Grade
      </h2>
      <div
        v-for="filter in programGradeFilters"
        :key="filter.label"
        class="checkbox-wrap"
      >
        <input
          :id="filter.matchValue"
          type="checkbox"
          :value="filter.matchValue"
          :checked="isFilterChecked(filter.matchValue, 'programgrade')"
          @change="updateFilters('programgrade', $event)"
        >
        <label :for="filter.matchValue"><div>{{ filter.label }}</div></label>
      </div>
      <h2 class="jb-sidebar-header jb-first-sidebar-header bg-ghost-gray">
        Program term
      </h2>
      <div
        v-for="filter in programTermFilters"
        :key="filter.label"
        class="checkbox-wrap"
      >
        <input
          :id="filter.matchValue"
          type="checkbox"
          :value="filter.matchValue"
          :checked="isFilterChecked(filter.matchValue, 'programterm')"
          @change="updateFilters('programterm', $event)"
        >
        <label :for="filter.matchValue"><div>{{ filter.label }}</div></label>
      </div>
      <h2 class="jb-sidebar-header jb-first-sidebar-header bg-ghost-gray">
        Focus Area
      </h2>
      <div
        v-for="filter in programFocusFilters"
        :key="filter.label"
        class="checkbox-wrap"
      >
        <input
          :id="filter.matchValue"
          type="checkbox"
          :value="filter.matchValue"
          :checked="isFilterChecked(filter.matchValue, 'programfocus')"
          @change="updateFilters('programfocus', $event)"
        >
        <label :for="filter.matchValue"><div>{{ filter.label }}</div></label>
      </div>
      <h2 class="jb-sidebar-header bg-ghost-gray">
        Transportation
      </h2>
      <div
        v-for="filter in programTransportationFilters"
        :key="filter.label"
        class="checkbox-wrap"
      >
        <input
          :id="filter.label"
          type="checkbox"
          :value="filter.matchValue"
          :checked="isFilterChecked(filter.matchValue, 'programtransit')"
          @change="updateFilters('programtransit', $event)"
        >
        <label :for="filter.label"><div>{{ filter.label }}</div></label>
      </div>
      <h2 class="jb-sidebar-header bg-ghost-gray">
        Not Focus Area
      </h2>
      <div
        v-for="filter in jobCompetitionFilters"
        :key="filter.label"
        class="checkbox-wrap"
      >
        <input
          :id="filter.label"
          :ref="`checkbox-${filter.matchValue}`"
          type="checkbox"
          :value="filter.matchValue"
          :checked="isFilterChecked(filter.matchValue, 'jobcompt')"
          @change="updateFilters('jobcompt', $event)"
        >
        <label :for="filter.label"><div>{{ filter.label }}</div></label>
      </div>
    </div>
    <div
      v-if="vModal"
      class="v-modal-btns"
    >
      <input
        class="jb-apply-filters-btn button"
        type="button"
        value="Apply Filters"
        @click="$modal.hide('job-filters')"
      > &nbsp;
    </div>
    <input
      class="jb-clear-all-btn button"
      type="button"
      :disabled="!hasFilters"
      value="Clear All Filters"
      @click="clearAllFilters(); $modal.hide('job-filters')"
    >
  </div>
</template>

<script>
export default {
  props: {
    programAgeFilters: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programGradeFilters: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programTermFilters: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programFocusFilters: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programTransportationFilters: {
      type: Array,
      default: () => {
        return [];
      },
    }, 
    jobCompetitionFilters: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programage: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programgrade: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programterm: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programfocus: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programtransit: {
      type: Array,
      default: () => {
        return [];
      },
    },
    updateResultsList: {
      type: Function,
      default: () => {
        return;
      },
    },
    clearAllFilters: {
      type: Function,
      default: () => {
        return;
      },
    },
    hasFilters: {
      type: Boolean,
      default: false,
    },
    vModal: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
    * @desc is checkbox checked
    * @param { String } value
    * @param { String } filter name to eval
    * @returns { Boolean }
    */
    isFilterChecked (value, filter) {
      if (this[filter].includes(value)) {
        return true;
      }
      return false;
    },

    /**
    * @desc emits filter updates back to parent
    * @param { String } filter name to eval
    * @param { Object } $event object
    */
    updateFilters (filter, e) {
      let newFilters = this[filter];

      if (e.target.checked) {
        console.log(e.target.value)
        if (!this[filter].includes(e.target.value)) {
          newFilters.push(e.target.value);
          console.log('target-checked:', newFilters);
        }
      } else {
        newFilters = this[filter].filter(item => item !== e.target.value);
        console.log(newFilters);

      }
      this.$emit(`update:${filter}`, newFilters);
      this.updateResultsList();
    },

  },
};
</script>
