<template>
  <div
    :class="{ 'in-modal': vModal }"
  >
    <div class="ost-sidebar-filters-wrap">
      <h2 class="ost-sidebar-header ost-first-sidebar-header">
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
      <h2 class="ost-sidebar-header ost-sidebar-header">
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
      <h2 class="ost-sidebar-header ost-sidebar-header">
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
      <h2 class="ost-sidebar-header ost-sidebar-header">
        Zip
        </h2>
        <div
          v-for="filter in programZipFilters"
          :key="filter.label"
          class="search">
          <label 
            for="search-bar"
            :aria-label="filter.label"
          >
            <input
              :id="filter.matchValue"
              class="search-field"
              type="number"
              :placeholder="filter.label"
              @keydown.enter="updateFilters('programzip', $event, 'zip');"
              :checked="isFilterChecked(filter.matchValue, 'programzip')"
            ><input
              ref="ost-zip-search"
              type="submit"
              class="search-submit"
              value="Search"
            >
          <button
            class="ost-clear-search-btn"
            @click="clearAllFilters()"
          >
            <i class="fal fa-times-square" />
          </button>
          </label>
        </div>
      <h2 class="ost-sidebar-header ost-sidebar-header">
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
      <h2 class="ost-sidebar-header ost-sidebar-header">
        Days offered
      </h2>
      <div
        v-for="filter in programDaysFilters"
        :key="filter.label"
        class="checkbox-wrap"
      >
        <input
          :id="filter.matchValue"
          type="checkbox"
          :value="filter.matchValue"
          :checked="isFilterChecked(filter.matchValue, 'programdays')"
          @change="updateFilters('programdays', $event)"
        >
        <label :for="filter.matchValue"><div>{{ filter.label }}</div></label>
      </div>
      <h2 class="ost-sidebar-header ost-sidebar-header">
        Fee
      </h2>
      <div
        v-for="filter in programFeesFilters"
        :key="filter.label"
        class="checkbox-wrap"
      >
        <input
          :id="filter.matchValue"
          type="checkbox"
          :value="filter.matchValue"
          :checked="isFilterChecked(filter.matchValue, 'programfees')"
          @change="updateFilters('programfees', $event)"
        >
        <label :for="filter.matchValue"><div>{{ filter.label }}</div></label>
      </div>
      <h2 class="ost-sidebar-header">
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
    </div>
    <div
      v-if="vModal"
      class="v-modal-btns"
    >
      <input
        class="ost-apply-filters-btn button"
        type="button"
        value="Apply Filters"
        @click="$modal.hide('job-filters')"
      > &nbsp;
    </div>
    <input
      class="ost-clear-all-btn button"
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
    programZipFilters: {
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
    programDaysFilters: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programFeesFilters: {
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
    programzip: {
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
    programdays: {
      type: Array,
      default: () => {
        return [];
      },
    },
    programfees: {
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
   //TODO refactor all filters to not require the filter name to be the match
    updateFilters (filter, e, name) {
      let newFilters = this[filter];

      console.log('e.target', e.target.id)

      if ( e.target.checked || (e.target.id === 'zip' && e.target.value ) )  {
        
        if (!this[filter].includes(e.target.value)) {
          //newFilters.push(e.target.value);
          newFilters.push(name, e.target.value);
        }

      }else {
        newFilters = this[filter].filter(item => item !== e.target.value);

      }
      this.$emit(`update:${filter}`, newFilters);
      this.updateResultsList();
    },

  }
}
</script>