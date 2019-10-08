<template>
  <div
    :class="{ 'in-modal': vModal }"
  >
    <div class="ost-sidebar-filters-wrap">
      Refine by
      <accordion
        accordion-title="Age"
      >
        <template v-slot:title>
          <h2 
            class="ost-sidebar-header ost-first-sidebar-header accordion-header"
            @click="toggle"
          >
            Age
          </h2>
        </template>
        <template v-slot:content>
          <div
            v-for="filter in programAgeFilters"
            :key="filter.label"
            class="checkbox-wrap"
            role="checkbox"
            @keyup.space="$emit('it-happened', $event.target.value)"
          >
            <input
              :id="filter.matchValue"
              type="checkbox"
              :value="filter.matchValue"
              :checked="isFilterChecked(filter.matchValue, 'programage')"
              :aria-checked="isFilterChecked(filter.matchValue, 'programage')"
              @change="updateFilters('programage', $event)"
            >
            <label 
              :for="filter.matchValue"
            ><div>{{ filter.label }}</div></label>
          </div>
        </template>
      </accordion>

      <accordion
        accordion-title="Grade"
      >
        <template v-slot:title>
          <h2 
            class="ost-sidebar-header ost-sidebar-header"
          >
            Grade
          </h2>
        </template>
        <template v-slot:content>
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
              :aria-checked="isFilterChecked(filter.matchValue, 'programage')"
              @change="updateFilters('programgrade', $event)"
            >
            <label 
              :for="filter.matchValue"
            ><div>{{ filter.label }}</div></label>
          </div>
        </template>
      </accordion>
      <accordion 
        accordion-title="Program term"
      >
        <template v-slot:title>
          <h2 class="ost-sidebar-header ost-sidebar-header">
            Program term
          </h2>
        </template>
        <template v-slot:content>
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
        </template>
      </accordion>
      <accordion>
        <template v-slot:title>
          <h2 class="ost-sidebar-header ost-sidebar-header">
            Zip
          </h2>
        </template>
        <template v-slot:content>
          <div
            v-for="filter in programZipFilters"
            :key="filter.label"
          >
            <v-select 
              :options="zipcodes"
              @input="updateFilters('programzip', $event, 'zip');"
              :clearable="false"
              :clearSearchOnSelect="true"
            />
          </div>
        </template>
      </accordion>
      <accordion>
        <template v-slot:title>
          <h2 class="ost-sidebar-header ost-sidebar-header">
            Focus Area
          </h2>
        </template>
        <template v-slot:content>
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
        </template>
      </accordion>
      <accordion>
        <template v-slot:title>
          <h2 class="ost-sidebar-header ost-sidebar-header">
            Days offered
          </h2>
        </template>
        <template v-slot:content>
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
        </template>
      </accordion>
      <accordion>
        <template v-slot:title>
          <h2 class="ost-sidebar-header ost-sidebar-header">
            Fee
          </h2>
        </template>
        <template v-slot:content>
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
        </template>
      </accordion>
      <accordion>
        <template v-slot:title>
          <h2 class="ost-sidebar-header">
            Transportation
          </h2>
        </template>
        <template v-slot:content>
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
        </template>
      </accordion>
    </div>
    <div
      v-if="vModal"
      class="v-modal-btns"
    >
      <input
        class="ost-apply-filters-btn button"
        type="button"
        value="Apply Filters"
        @click="$modal.hide('program-filters')"
      > &nbsp;
    </div>
    <input
      class="ost-clear-all-btn button"
      type="button"
      :disabled="!hasFilters"
      value="Clear All Filters"
      @click="clearAllFilters(); $modal.hide('program-filters')"
    >
  </div>
</template>

<script>
import axios from 'axios';
import vSelect from 'vue-select';
import accordion from './accordion';
export default {
  components: {
    vSelect,
    accordion,
  },
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
    ostCompetitionFilters: {
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
  data() {
    return {
      zipcodes: [],
      showSection: true,
    };
  },
  created () {
    this.init();
  },

  methods: {
    async init () {
      await this.getOptions();
    },
    getOptions() {
      return axios.get('./zipcodes.json').then(async (result) => {
        this.zipcodes = result.data;
        return true;
      }).catch((error) => {
        console.log(error);
        return false;
      });
    },
    emptySearchBar(){
      this.zipSearch = '';
      return; 
    },
    toggle() {
      this.showSection = !this.showSection;
    },
    /**
    * @desc is checkbox checked
    * @param { String } value
    * @param { String } filter name to eval
    * @returns { Booleaan }
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

    updateFilters (filter, e, name) {

      let newFilters = this[filter];

      //handle zip dropdown
      if (typeof e === 'number'){

        let s = e.toString();
        if (!this[filter].includes(e)) {
          newFilters = [ 'zip', s ];
        }

      }else if( e.target.checked )  {
        if (!this[filter].includes(e.target.value)) {
          newFilters.push(name, e.target.value);
        }
      }else {
        newFilters = this[filter].filter(item => item !== e.target.value);
      }
      this.$emit(`update:${filter}`, newFilters);
      this.updateResultsList();
    },

  },
};
</script>
<style lang="scss">
  @import "vue-select/src/scss/vue-select.scss";
  input[type="search"]{
    height:auto;
  }
  input[type="search"]:focus{
    border: none;
    height: auto;
  }
</style>