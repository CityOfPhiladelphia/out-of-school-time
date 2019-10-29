<template>
  <div id="ost-app">
    <app-header />
    <div class="row columns">
      <div class="intro-text">
      <p><a href="https://www.phila.gov/programs/out-of-school-time-ost/">Out-of-School Time (OST)</a> (OST) programs are an important resource for child and youth development. In Philadelphia, a wide variety of quality programs are available before school, after school, and throughout the summer.</p><p> Use this tool to find programs near you. To apply to a particular program, use its contact information or visit its website.
        </p></div>
        </div>
    <div
      v-if="ready"
      class="row"
    >
      <!-- Filters -->
      <template v-if="isMq(['md', 'lg'])">
        <div class="columns small-24 medium-7 ost-sidebar-filters">
          <div class="search">
            <label 
              for="search-bar"
              aria-label="Search Bar"
            >
              <input
                id="search-bar"
                v-model="search"
                class="search-field"
                type="text"
                placeholder="Search by keyword"
                @keydown.enter="updateResultsList();"
                @keyup.enter="hideMobileKeyboard($event); updateResultsList()"
              ><input
                ref="ost-search-bar"
                type="submit"
                class="search-submit"
                value="Search"
                @click="updateResultsList();"
              >
              <button
                v-if="search.length > 0"
                class="ost-clear-search-btn"
                @click="clearSearchBar"
              >
                <i class="fal fa-times-square" />
              </button>
            </label>
          </div>
          <program-filters
            :update-results-list="updateResultsList"
            :clear-all-filters="clearAllFilters"
            :scroll-to-top="scrollToTop"
            :programage.sync="programage"
            :programgrade.sync="programgrade"
            :programterm.sync="programterm"
            :programzip.sync="programzip"
            :programfocus.sync="programfocus"
            :programdays.sync="programdays"
            :programfees.sync="programfees"
            :programtransit.sync="programtransit"
            v-bind="{ 
              programTransportationFilters, 
              programAgeFilters, 
              programGradeFilters,
              programTermFilters,
              programZipFilters,
              programFocusFilters,
              programDaysFilters,
              programFeesFilters, 
              hasFilters, 
              vModal: false }"
          />
        </div>
      </template>
      <template v-if="isMq(['sm'])">
        <div class="columns small-24 ost-mobile-filters">
          <div class="grid-x align-middle">
            <div class="cell small-12">
              <button @click="$modal.show('program-filters')">
                <i
                  class="fa-filter"
                  :class="filterCount > 0 ? 'fas' : 'fal'"
                /> Filters {{ filterCount > 0 ? `(${filterCount})` : `` }}
              </button>
            </div>
            <div class="cell small-12 text-right">
              <button
                class="ost-clear-all-filters-btn-link"
                :disabled="!hasFilters"
                :aria-disabled="!hasFilters"
                @click="clearAllFilters()"
              >
                Clear All Filters
              </button> &nbsp;
            </div>
          </div>
        </div>
        <modal
          name="program-filters"
          adaptive
          click-to-close
          height="auto"
          @before-open="vModalBeforeOpen"
          @before-close="vModalBeforeClose"
        >
          <div class="search">
            <label 
              for="search-bar"
              aria-label="Search Bar"
            >
              <input
                id="search-bar"
                v-model="search"
                class="search-field"
                type="text"
                placeholder="Search by keyword"
                @keydown.enter="updateResultsList();"
                @keyup.enter="hideMobileKeyboard($event); updateResultsList()"
              ><input
                ref="ost-search-bar"
                type="submit"
                class="search-submit"
                value="Search"
                @click="updateResultsList();"
              >
              <button
                v-if="search.length > 0"
                class="ost-clear-search-btn"
                @click="clearSearchBar"
              >
                <i class="fal fa-times-square" />
              </button>
            </label>
          </div>
          <program-filters
            :class="isMobile.Android() ? 'os-android' : ''"
            :update-results-list="updateResultsList"
            :clear-all-filters="clearAllFilters"
            :programage.sync="programage"
            :programgrade.sync="programgrade"
            :programterm.sync="programterm"
            :programzip.sync="programzip"
            :programfocus.sync="programfocus"
            :programdays.sync="programdays"
            :programfees.sync="programfees"
            :programtransit.sync="programtransit"
            v-bind="{ programAgeFilters,
                      programGradeFilters, 
                      programTermFilters,
                      programZipFilters,
                      programFocusFilters,
                      programDaysFilters,
                      programFeesFilters,
                      hasFilters, 
                      vModal: true }"
          />
        </modal>
      </template>

      <!-- Results -->
      <div class="columns small-24 medium-17 ost-results">
        <div
          v-if="!hasFilters"
          class="row"
        />
        <div class="grid-x align-top">
          <!-- Results Count -->
          <div class="cell small-24 medium-13">
            <div
              class="ost-results-count"
              v-html="programCount"
            />
          </div>
          <div
            v-if="results.length > 0"
            class="pagination cell medium-10"
          >
            Showing page:
            <paginate-links
              for="results"
              :show-step-links="true"
              :async="true"
              :limit="3"
              :step-links="paginateStepLinks"
            />
          </div>
          <div class="cell medium-1 ost-print hide-for-small-only">
            <a href="javascript:window.print()"><i class="fas fa-print fa-lg" /><span class="accessible">Print this page</span></a>
          </div>
        </div>
        <!-- Program List -->
        <ul class="ost-programs no-bullet">
          <paginate
            :ref="'resultsPagination'"
            name="results"
            :list="results"
            :per="25"
          >
            <li
              v-for="program in paginated('results')"
              :key="program.id"
            >
              <!-- Program -->
              <div class="ost-program mtl">
                <!-- Program Title -->
                <div class="ost-program-title-wrap bg-ghost-gray clearfix">
                  <div class="ost-program-title h3 phs mas">
                    <b>{{ program.name }}</b>  -  <span class="ost-program-agency">{{ program.agency }}</span>
                  </div>
                </div>
                <!-- Program Body -->
                <div class="row phm">
                  <div class="grid-x grid-margin-x grid-padding-x mtl">
                    <div class="ost-contact cell medium-12">
                      <div 
                        v-if="program.address"
                        class="program-address group mbl"
                      >
                        <i class="fas fa-map-marker-alt fa-fw" />
                        <div class="program-icon-content">
                          <a 
                            :href="`https://www.google.com/maps/place/${program.address}+${program.city}+${program.zip}`"
                            target="_blank"
                            class="external"
                          >{{ program.address }}<br>
                            {{ program.city }}, {{ program.state }} {{ program.zip }}</a>
                        </div>
                      </div>
                      <div 
                        v-if="program.phone"
                        class="program-phone group mbl"
                      >
                        <i class="fas fa-phone fa-fw" />
                        <div class="program-icon-content">
                          {{ program.phone }}
                        </div>
                      </div>
                      <div 
                        v-if="program.staff.firstName"
                        class="program-contact group mbl"
                      >
                        <i class="fas fa-user fa-fw" />
                        <div class="program-icon-content">
                          <span v-if="program.staff.firstName">
                            {{ program.staff.firstName }}
                            {{ program.staff.lastName }}</span>
                          <span v-if="program.staff.title">, {{ program.staff.title }}</span>
                        </div>
                      </div>
                      <div 
                        v-if="program.staff.email"
                        class="program-email group mbl"
                      >
                        <i class="fas fa-envelope fa-fw" />
                        <div class="program-icon-content">
                          <a :href="`mailto:${program.staff.email}`">{{ program.staff.email }}</a><br>
                        </div>
                      </div>
                      <div 
                        v-if="program.online.web"
                        class="program-website group mbl"
                      >
                        <i class="fas fa-globe fa-fw" />
                        <div class="program-icon-content">
                          <a
                            :href="program.online.web"
                            class="external"
                            target="_blank"
                          >Website</a>
                        </div>
                      </div>
                      <div class="social-media">
                        <span 
                          v-if="program.online.facebook"
                          class="facebook"
                        ><a :href="program.online.facebook"><i class="fab fa-facebook fa-fw" /></a></span>
                        <span
                          v-if="program.online.instagram"
                          class="instagram"
                        ><a :href="program.online.instagram"><i class="fab fa-instagram fa-fw" /></a></span>
                        <span 
                          v-if="program.online.twitter"
                          class="twitter"
                        ><a :href="program.online.twitter"><i class="fab fa-twitter fa-fw" /></a></span>
                      </div>
                    </div>
                    <div class="ost-registration-information cell medium-12">
                      <div 
                        v-if="program.registration.startDate"
                        class="mbl"
                      >
                        <b>Registration open:</b> {{ program.registration.startDate }} - {{ program.registration.endDate }}
                      </div>
                      <div 
                        v-if="program.timeDetails.startDate"
                        class="mbl"
                      >
                        <b>Program runs from:</b> {{ program.timeDetails.startDate }} - {{ program.timeDetails.endDate }}
                      </div>
                      <div class="mbl">
                        <b>Days offered: </b>  
                        {{ program.daynames }}
                      </div>
                      <div 
                        v-if="program.timeDetails.genericStartTime || program.timeDetails.startTime"
                        class="mbl"
                      >                       
                        <b>Time offered:</b> 
                        <span 
                          v-if="program.timeDetails.genericStartTime && program.timeDetails.genericEndTime">
                          {{ program.timeDetails.genericStartTime }} - {{ program.timeDetails.genericEndTime }}
                        </span>
                        <span v-else>{{ program.timeDetails.startTime }} - {{ program.timeDetails.endTime }} </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="phm mtm">
                  <div 
                    v-if="program.focus_areas"
                    class="ost-focus-areas mbm"
                  >
                    <h3><b>Focus areas</b></h3>
                    <span 
                      v-html="stripBrTag(program.focus_areas)"
                    />
                  </div>
                  <div class="details">
                    <h3><b>Details</b></h3>
                      <div 
                        v-if="program.description">
                        <b>Program description: </b> {{program.description}}
                      </div>
                    <div v-if="program.ages">
                      <b>Ages: </b> 
                      <span 
                        v-for="(age, index) in program.ages"
                        :key="age"
                      ><span v-if="age != ''">{{ age }}<span v-if="index + 1 != program.ages.length">, </span></span> </span>
                    </div>
                    <div 
                      v-if="program.grades"
                    >
                      <b>Grades: </b>
                      <span 
                        v-for="(grade, index) in program.grades"
                        :key="grade"
                      ><span v-if="grade != ''">{{ grade }}<span v-if="index + 1 != program.grades.length">, </span></span> </span>
                    </div>
                    <div v-if="program.costs">
                      <b>Costs:</b> {{ program.costs }}
                      <div v-if="program.costs != 'Free' && program.fee_amount">
                        <b>Fee amount:</b> ${{program.fee_amount}}
                        <div v-if="program.fee_freq"><b>Fee frequencey: </b> {{program.fee_freq}}</div>
                        <div v-if="program.fee_desc"><b>Fee description: </b> {{program.fee_desc}}</div>

                      </div>
                    </div>
                    <div v-if="program.term">
                      <b>Term: </b> {{ program.term }}
                    </div>
                    <div v-if="program.services">
                      <b>Services:</b> {{ program.services }}
                    </div>
                    <div v-if="program.transport">
                      <b>Transportation:</b> {{ program.transport }}
                    </div>
                    <div v-if="program.meals">
                      <b>Meals:</b> {{ program.meals }}
                    </div>
                    <div v-if="program.special_pop">
                      <b>Special populations: </b> {{program.special_pop}}
                    </div>
                  </div>
                  <!-- {{ program }} -->
                </div>
              </div>
            </li>
          </paginate>
        </ul>
      </div>
    </div>
    <div
      v-else
      class="row columns text-center"
    >
      <i class="fas fa-spinner fa-spin fa-3x loadingdir" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import Fuse from 'fuse.js';
import VuePaginate from 'vue-paginate';
//import VueAnalytics from 'vue-analytics';
import VueMq from 'vue-mq';
import ProgramFilters from './components/ProgramFilters';
import AppHeader from './components/AppHeader';
import VModal from 'vue-js-modal';

/**
* @desc VModal is used for mobile filters only
* @todo Only import it when needed
*/
Vue.use(VModal);

/**
* @desc MediaMatch component, helper for responsive states
*/
Vue.use(VueMq, {
  breakpoints: {
    sm: 640,
    md: 1024,
    lg: 'Infinity',
  },
  defaultBreakpoint: 'sm',
});

/**
* @desc google analytics, only enabled in production
*/
// Vue.use(VueAnalytics, {
//   id: 'UA-860026-1',
//   debug: {
//     enabled: process.env.NODE_ENV === 'development',
//     sendHitTask: process.env.NODE_ENV === 'production',
//   },
// });

/**
* @desc pagination component
*/
Vue.use(VuePaginate);

/**
* @desc initializes search component; accessible via this.$search
* @returns { Promise }
*/
Vue.prototype.$search = function (term, list, options) {
  return new Promise(function (resolve, reject) {
    var run = new Fuse(list, options);
    var results = run.search(term);
    resolve(results);
  });
};

export default {
  name: 'OST',
  components: {
    AppHeader, 
    ProgramFilters,
  },
  data () {
    return {
      api: {
        getPrograms: 'https://api.cityspan.com/phillyost/service/getall',
      },
      originalPrograms: [],
      allPrograms: [],
      paginate: [ 'results' ],
      paginateStepLinks: {
        next: 'Next',
        prev: 'Previous',
      },
      fuseSearchOptions: {
        defaultAll: false,
        keys: [
          'name',
          'agency',
          'services',
          'focus_areas',
        ],
        matchAllTokens: true,
        threshold: 0.2,
        tokenize: true,
      },
      isMobile: {
        Android: function() {
          return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
          return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
          return navigator.userAgent.match(/IEMobile/i);
        },
      },
      programs: [],
      programage: [],
      programAgeFilters: [
        {
          label: 'Under 5',
          matchKey: 'age_isUnder5',
          matchValue: 'age_isUnder5',
          valueStore: 'programage',
        },
        {
          label: '5 - 10',
          matchKey: 'age_is5to10',
          matchValue: 'age_is5to10',
          valueStore: 'programage',
        },
        {
          label: '11 - 13',
          matchKey: 'age_is11to13',
          matchValue: 'age_is11to13',
          valueStore: 'programage',
        },
        {
          label: '14 - 18',
          matchKey: 'age_is14to18',
          matchValue: 'age_is14to18',
          valueStore: 'programage',
        },
        {
          label: 'Above 18',
          matchKey: 'age_isAbove18',
          matchValue: 'age_isAbove18',
          valueStore: 'programage',
        },
      ],
      programgrade: [],
      programGradeFilters: [
        {
          label: 'Pre-K',
          matchKey: 'grade_prek',
          matchValue: 'grade_prek',
          valueStore: 'programgrade',
        },
        {
          label: 'K - 5',
          matchKey: 'grade_kto5',
          matchValue: 'grade_kto5',
          valueStore: 'programgrade',
        },
        {
          label: '6 - 8',
          matchKey: 'grade_6to8',
          matchValue: 'grade_6to8',
          valueStore: 'programgrade',
        },
        {
          label: '9 - 12',
          matchKey: 'grade_9to12',
          matchValue: 'grade_9to12',
          valueStore: 'programgrade',
        },
      ],
      programterm: [],
      programTermFilters: [
        {
          label: 'School Year',
          matchKey: 'term',
          matchValue: 'School Year',
          valueStore: 'programterm',
        },
        {
          label: 'Summer',
          matchKey: 'term',
          matchValue: 'Summer',
          valueStore: 'programterm',
        },
      ],
      programzip: [],
      programZipFilters: [
        {
          label: 'Search by zip',
          matchKey: 'zip',
          matchValue: 'zip',
          valueStore: 'programzip',
        },
      ],
      programfocus: [],
      programFocusFilters: [
        {
          label: 'Academic',
          matchKey: 'focus_isAcademic',
          matchValue: 'focus_isAcademic',
          valueStore: 'programfocus',
        },
        {
          label: 'Sports, heath and wellness activities',
          matchKey: 'focus_isHealth',
          matchValue: 'focus_isHealth',
          valueStore: 'programfocus',
        },
        {
          label: 'Arts and culture',
          matchKey: 'focus_isArt',
          matchValue: 'focus_isArt',
          valueStore: 'programfocus',
        },
        {
          label: 'College and career readiness',
          matchKey: 'focus_isCollegeCareer',
          matchValue: 'focus_isCollegeCareer',
          valueStore: 'programfocus',
        },
        {
          label: 'Character education/positive youth development',
          matchKey: 'focus_isCharacterDevelopment',
          matchValue: 'focus_isCharacterDevelopment',
          valueStore: 'programfocus',
        },
        {
          label: 'Community service learning',
          matchKey: 'focus_isCommunityService',
          matchValue: 'focus_isCommunityService',
          valueStore: 'programfocus',
        },
      ],
      programdays: [],
      programDaysFilters: [
        {
          label: 'Monday',
          matchKey: 'day_mon',
          matchValue: 'day_mon',
          valueStore: 'programdays',
        },
        {
          label: 'Tuesday',
          matchKey: 'day_tues',
          matchValue: 'day_tues',
          valueStore: 'programdays',
        },
        {
          label: 'Wednesday',
          matchKey: 'day_wed',
          matchValue: 'day_wed',
          valueStore: 'programdays',
        },
        {
          label: 'Thursday',
          matchKey: 'day_thurs',
          matchValue: 'day_thurs',
          valueStore: 'programdays',
        },
        {
          label: 'Friday',
          matchKey: 'day_fri',
          matchValue: 'day_fri',
          valueStore: 'programdays',
        },
        {
          label: 'Saturday',
          matchKey: 'day_sat',
          matchValue: 'day_sat',
          valueStore: 'programdays',
        },
        {
          label: 'Sunday',
          matchKey: 'day_sun',
          matchValue: 'day_sun',
          valueStore: 'programdays',
        },
      ],
      programfees: [],
      programFeesFilters: [
        {
          label: 'Free',
          matchKey: 'fee_free',
          matchValue: 'fee_free',
          valueStore: 'programfees',
        },
        {
          label: 'CCIS approved',
          matchKey: 'fee_ccis',
          matchValue: 'fee_ccis',
          valueStore: 'programfees',
        },
        {
          label: 'Fee based',
          matchKey: 'fee_has_fee',
          matchValue: 'fee_has_fee',
          valueStore: 'programfees',
        },
        {
          label: 'Scholarships/financial assistance',
          matchKey: 'fee_scholarship',
          matchValue: 'fee_scholarship',
          valueStore: 'programfees',
        },
      ],
      programtransit: [],
      programTransportationFilters: [
        {
          label: 'No transportation provided',
          matchKey: 'transport',
          matchValue: 'No transportation provided',
          valueStore: 'programtransit',
        },
        {
          label: 'Accesible bus/Subway Stops',
          matchKey: 'transport',
          matchValue: 'Accesible bus/Subway Stops',
          valueStore: 'programtransit',
        },
        {
          label: 'Transportation provided to site',
          matchKey: 'transport',
          matchValue: 'Transportation Provided to Site',
          valueStore: 'programtransit',
        },
        {
          label: 'Transportation provided from site to home',
          matchKey: 'transport',
          matchValue: 'Transportation Provided from Site to Home',
          valueStore: 'programtransit',
        },
      ],
      ready: false,
      results: [],
      routerQuery: {},
      search: '',
    };
  },

  computed: {
    /**
    * @desc checks if ready for display
    * @return { Boolean }
    */
    isReady () {
      return this.ready;
    },

    /**
    * @desc mobile only active filter counter
    * @return { Number }
    */
    filterCount () {
      let count = 0;
      for (let key in this.routerQuery) {
        if ([ 'programage', 'programgrade', 'programterm', 'programzip', 'programfocus', 'programdays', 'programfees', 'programtransit' ].includes(key)) {
          count = parseInt(count) + this.returnArray(this.routerQuery[key]).length;
        }
      }
      return count;
    },

    /**
    * @desc checks if url has filters
    * @returns { Boolean }
    */
    hasFilters () {
      if (Object.keys(this.routerQuery).length > 0) {
        return true;
      }
      return false;
    },


    /**
    * @desc generates available positions text
    * @returns { String }
    */
    programCount () {
      if (this.programs.length === this.results.length) {
        return `Showing all ${this.programs.length} available programs.`;
      }
      if (this.results.length === 0) {
        return '<p>No programs found. Try adjusting your filters or using different keywords. To start a new search, select Clear All Filters.</p>';
      }
      return `<p>Showing ${this.results.length} out of ${this.programs.length} programs.</p>`;
    },
  },

  
  watch: {
    programage (value) {
      if (value.length > 0) {
        this.updateRouterQuery('programage', value);
      } else {
        this.updateRouterQuery('programage');
      }
    },
    programgrade (value) {
      if (value.length > 0) {
        this.updateRouterQuery('programgrade', value);
      } else {
        this.updateRouterQuery('programgrade');
      }
    },
    programterm (value) {
      if (value.length > 0) {
        this.updateRouterQuery('programterm', value);
      } else {
        this.updateRouterQuery('programterm');
      }
    },
    programzip (value) {
      if (value.length > 0) {
        this.updateRouterQuery('programzip', value);
      } else {
        this.updateRouterQuery('programzip');
      }
    },
    programfocus (value) {
      if (value.length > 0) {
        this.updateRouterQuery('programfocus', value);
      } else {
        this.updateRouterQuery('programfocus');
      }
    },
    programdays (value) {
      if (value.length > 0) {
        this.updateRouterQuery('programdays', value);
      } else {
        this.updateRouterQuery('programdays');
      }
    },
    programfees (value) {
      if (value.length > 0) {
        this.updateRouterQuery('programfees', value);
      } else {
        this.updateRouterQuery('programfees');
      }
    },
    programtransit (value) {
      if (value.length > 0) {
        this.updateRouterQuery('programtransit', value);
      } else {
        this.updateRouterQuery('programtransit');
      }
    },
    routerQuery: {
      handler: function () {
        this.updateRouter();
      },
      deep: true,
    },
  },
  created () {
    this.init();
  },
  methods: {
    /**
    * @desc clears all filters.
    * Triggered by clear filters button
    */
    clearAllFilters () {
      //this.$ga.event('ost-prgrams', 'click', 'Clear All Filters');
      this.resetFilters();
      this.resetRouterQuery();
      this.updateResultsList();
      this.scrollToTop();
    },

    /**
    * @desc clears search bar
    */
    clearSearchBar () {
      this.search = '';
      this.updateResultsList();
    },

    /**
    * @desc Get a list of all programs from api
    * @returns { Boolean }
    */
    getPrograms () {
      let self = this;
      let newProgram = {};
      return axios.get(self.api.getPrograms).then(async (result) => {

        self.originalPrograms = result.data;

        result.data.forEach((program) => {
          let newProgram = self.cleanPrograms({
            id: program.serviceid,

            age_isUnder5: program.isUnder5,
            age_is5to10: program.is5to10,
            age_is11to13: program.is11to13,
            age_is13to14: program.is13to14,
            age_is14to18: program.is14to18,
            age_isAbove18: program.isAbove18,

            ages: [
              program.isUnder5 ? 'Under 5' : null,
              program.is5to10 ? '5 - 10' : null,
              program.is11to13 ? '11 - 13' : null,
              program.is13to14 ? '13 - 14' : null,
              program.is14to18 ? '14 - 18' : null,
              program.isAbove18 ? 'Above 18' : null,
            ],

            description: program.programdescription,
            
            grades: [
              program.serviceGradeLevelPreK ? 'Pre-k' : null,
              program.serviceGradeLevel1 || program.serviceGradeLeve2 || program.serviceGradeLevel3 || program.serviceGradeLevel4 || program.serviceGradeLevel5 ? 'K - 5' : null,
              program.serviceGradeLevel6 || program.serviceGradeLevel7 || program.serviceGradeLevel8 ? '6 - 8' : null,
              program.serviceGradeLevel9 || program.serviceGradeLevel10 || program.serviceGradeLevel11 || program.serviceGradeLevel12 ? '9 - 12' : null,
            ],

            grade_prek: program.serviceGradeLevelPreK || null,
            grade_kto5: program.serviceGradeLevel1 || program.serviceGradeLeve2 || program.serviceGradeLevel3 || program.serviceGradeLevel4 || program.serviceGradeLevel5 || null,
            grade_6to8: program.serviceGradeLevel6 || program.serviceGradeLevel7 || program.serviceGradeLevel8 || null,
            grade_9to12: program.serviceGradeLevel9 || program.serviceGradeLevel10 || program.serviceGradeLevel11 || program.serviceGradeLevel12 || null,
            
            term: program.SchoolYearOrSummer,

            focus_isCommunityService: (program.isCommunityService) ? 'focus_isCommunityService' : null,
            focus_isCharacterDevelopment: (program.isCharacterDevelopment) ? 'focus_isCharacterDevelopment' : null,
            focus_isCollegeCareer: (program.isCollegeCareer) ? 'focus_isCollegeCareer' : null,
            focus_isArt: (program.isArt) ? 'focus_isArt' : null,
            focus_isHealth: (program.isHealth) ? 'focus_isHealth' : null,
            focus_isAcademic: (program.isAcademic) ? 'focus_isAcademic' : null,

            daynames: program.daynames, 
            day_mon: null,
            day_tues: null, 
            day_wed: null, 
            day_thurs: null, 
            day_fri: null, 
            day_sat: null, 
            day_sun: null,

            costs: program.COSTS,
            
            //check for null values
            fee_free: (program.COSTS) ? program.COSTS : '',
            fee_ccis:(program.COSTS) ? program.COSTS : '',
            fee_has_fee:(program.COSTS) ? program.COSTS : '',
            fee_scholarship: (program.COSTS) ? program.COSTS : '',
            fee_amount: (program.FEE_AMOUNT),
            fee_freq: (program.FEE_FREQUENCY),
            fee_desc: (program.FEE_DESCRIPTION),

            transit_none: (program.TRANSPORTATION) ? program.TRANSPORTATION : '',
            transit_bus:(program.TRANSPORTATION) ? program.TRANSPORTATION : '',
            transit_to_site:(program.TRANSPORTATION) ? program.TRANSPORTATION : '',
            transit_from_home: (program.TRANSPORTATION) ? program.TRANSPORTATION : '',

            focus_areas: program.subcats,

            special_pop: program.SPECIAL_POPULATION_SERVED,
            lat: program.latitude,
            long: program.longitude,
            name: program.programname,
            transport: program.TRANSPORTATION,
            agency: program.agencyname, 
            address: program.address, 
            city: program.city, 
            state: program.state, 
            zip: program.zip, 
            phone: program.program_phone,
            staff: {
              title: program.staffTitle,
              firstName: program.stafffirstname,
              lastName: program.stafflastname, 
              email: program.staffemail,
            },
            online: {
              web: program.WEBSITE_ADDRESS,
              facebook: program.FACEBOOK,
              instagram: program.INSTAGRAM,
              twitter: program.TWITTER, 
            },
            registration: {
              startDate: program.RegistrationPeriodStartDate,
              endDate: program.RegistrationPeriodEndDate,
            },
            timeDetails: {
              startDate: program.begindate_str,
              endDate: program.enddate_str,
              startTime: program.begintime_str,
              endTime: program.endtime_str,
              genericStartTime: (program.ProgramDirectoryStartTimeSelect) ? program.ProgramDirectoryStartTimeSelect : '',
              genericEndTime: (program.ProgramDirectoryEndTimeSelect) ? program.ProgramDirectoryEndTimeSelect : '',
            },
            services: program.SERVICES,
            meals: program.MEALS,

          });
          self.allPrograms.push(newProgram);

        });

        self.results = self.allPrograms;
        self.programs = self.allPrograms;

        return true;
      }).catch((error) => {
        console.log(error);
        return false;
      });
    },

    cleanPrograms (program) {

      program.age_isUnder5 = (program.age_isUnder5) ? 'age_isUnder5' : null;
      program.age_is5to10 = (program.age_is5to10) ? 'age_is5to10' : null;
      program.age_is11to13 = (program.age_is11to13) ? 'age_is11to13' : null;
      program.age_is14to18 = (program.age_is14to18) ? 'age_is14to18' : null;
      program.age_isAbove18 = (program.age_isAbove18) ? 'age_isAbove18' : null;

      program.grade_prek = (program.grade_prek) ? 'grade_prek' : null;
      program.grade_kto5 = (program.grade_kto5) ? 'grade_kto5' : null;
      program.grade_6to8 = (program.grade_6to8) ? 'grade_6to8' : null;
      program.grade_9to12 = (program.grade_9to12) ? 'grade_9to12' : null;

      program.day_mon = program.daynames.includes('M') ? 'day_mon' : null;
      program.day_tues = program.daynames.includes('Tu') ? 'day_tues' : null;
      program.day_wed = program.daynames.includes('W') ? 'day_wed' : null;
      program.day_thurs = program.daynames.includes('Th') ? 'day_thurs' : null;
      program.day_fri = program.daynames.includes('F') ? 'day_fri' : null;
      program.day_sat = program.daynames.includes('Sa') ? 'day_sat' : null;
      program.day_sun = program.daynames.includes('Su') ? 'day_sun' : null;

      program.daynames = program.daynames.replace('M','Monday').replace('Tu', 'Tuesday').replace('W', 'Wednesday').replace('Th', 'Thursday').replace('F', 'Friday').replace('Sa', 'Saturday').replace('Su', 'Sunday');

      program.fee_free = (program.fee_free.includes('Free')) ? 'fee_free' : null;
      program.fee_ccis = (program.fee_ccis.includes('CCIS') )? 'fee_ccis' : null;
      program.fee_has_fee =  (program.fee_has_fee.includes('based') )  ? 'fee_has_fee' : null;
      program.fee_scholarship =  (program.fee_scholarship.includes('Scholarships')) ? 'fee_scholarship' : null;

      let startDate =  new Date(program.timeDetails.startDate);
      let endDate =  new Date(program.timeDetails.endDate);
      let registrationStart = new Date(program.timeDetails.startDate);
      let registrationEnd = new Date(program.timeDetails.endDate);

      let options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

      program.ages = program.ages.filter(Boolean);
      program.grades = program.grades.filter(Boolean);

      program.registration.startDate = registrationStart.toLocaleDateString('en-US', options);
      program.registration.endDate = registrationEnd.toLocaleDateString('en-US', options);

      program.timeDetails.startDate = startDate.toLocaleDateString('en-US', options);
      program.timeDetails.endDate = endDate.toLocaleDateString('en-US', options);

      return program;
    },

    /**
    * @desc trick to hide mobile keyboard on "enter"
    * Works by shifting focus to another element
    */
    hideMobileKeyboard (e) {
      if (e.type === 'keyup' && e.keyCode === 13) {
        document.getElementsByClassName('search-submit')[0].focus();
      }
    },
    

    /**
    * @desc initializes app
    */
    async init () {
      this.initFilterState();
      await this.getPrograms();
      await this.updateResultsList();
      this.ready = true;
    },

    /**
    * @desc gets filters values from url and updates $route
    */
    initFilterState () {
      for (let key in this.$route.query) {
        switch (key) {
        case 'search':
          Vue.set(this, key, this.$route.query[key]);
          break;
        case 'page':
          if (this.$refs.resultsPagination) {
            this.$refs.resultsPagination.goToPage(this.routerQuery.page);
          }
          break;
        default:
          Vue.set(this, key, this.returnArray(this.$route.query[key]));
          break;
        }
      }
    },

    /**
    * @desc uses $mq value to determine responsive size
    * @param { Array } sizes $mq defined sizes
    * @returns { Boolean }
    */
    isMq (sizes) {
      if (!Array.isArray(sizes)) {
        sizes = [ sizes ];
      }
      return sizes.includes(this.$mq);
    },

    /**
  * @desc Strip HTML from source
  */
    stripBrTag(content) {
      let regex = /(<(\/br>?)>)/i;
      return content.replace(regex, '');
    },


    /**
    * @desc filters programs array. All sidebar checkboxes uses this filter
    * @param { Array } programs
    * @returns { Array } of filtered programs
    */
    programFilters (programs) {
      let programFilters = [
        ...this.programAgeFilters,
        ...this.programGradeFilters,
        ...this.programTermFilters,
        ...this.programZipFilters,
        ...this.programFocusFilters,
        ...this.programDaysFilters,
        ...this.programFeesFilters,
        ...this.programTransportationFilters,
      ];

      programFilters.forEach(programFilter => {
        if (this[programFilter.valueStore].length > 0 && 
        this[programFilter.valueStore].includes(programFilter.matchValue)) {
          programs = programs.filter(program => {
            return this[programFilter.valueStore].includes(program[programFilter.matchKey]);
          });
        }
      });

      return programs;
    },

    /**
    * @desc resets all filters
    */
    resetFilters () {
      //this.dept = '';
      this.programtransit = [];
      this.programage = [];
      this.programgrade = [],
      this.programterm = [],
      this.programzip = [],
      this.programfocus = [],
      this.programdays = [],
      this.programfees = [],
      this.programzip = [],
      this.search = '';
    },

    /**
    * @desc resets router query
    */
    resetRouterQuery () {
      for (let key in this.$route.query) {
        Vue.delete(this.routerQuery, key);
      }
    },

    /**
    * @desc always returns an array
    * @param { String || Array }
    * @returns { Array }
    */
    returnArray (value) {
      if (Array.isArray(value)) {
        return value;
      } 
      if (value !== '') {
        return [ value ];
      } 
      return [];
    },

    /**
    * @desc uses Fuse $search to filter programs
    * @param { Array } programs
    * @returns { Array } filtered programs
    */
    searchBarFilter (programs) {
      if (this.search.length >= 3) {
        this.updateRouterQuery('search', this.search);
        //doesn't even get here
        return this.$search(this.search, programs, this.fuseSearchOptions);
      } 
      this.updateRouterQuery('search');
      Vue.delete(this.routerQuery, 'search');
      return programs;
      
    },
    /**
    * @desc it does what it says it does.
    */
    scrollToTop () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    /**
    * @desc Filters & sorts all programs.
    * Every filter and sort action runs through this method.
    */
    async updateResultsList () {
      let filteredprograms = this.programs;

      filteredprograms = await this.searchBarFilter(filteredprograms);
      filteredprograms = this.programFilters(filteredprograms);

      this.results = filteredprograms;
      this.scrollToTop();
    },

    /**
    * @desc updates routerQuery which tracks all current filters
    * @param { String } key
    * @param { String } value
    */
    updateRouterQuery (key, value) {
      if (typeof value === 'undefined') {
        Vue.delete(this.routerQuery, key);
      } else {
        //this.$ga.event('ost-programs', key, this.returnArray(value).join('|'));
        Vue.set(this.routerQuery, key, value);
      }
    },

    /**
    * @desc updates $router
    */
    updateRouter () {
      this.$router.push({
        name: 'main',
        query: this.routerQuery,
      });
    },

    vModalBeforeOpen () {
      window.document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    },

    vModalBeforeClose () {
      window.document.getElementsByTagName('body')[0].style.overflow = 'auto';
    },
  },
};
</script>

<style lang="scss">
  //override maxwidth on app 
  .row {
    max-width:90rem;
  }
  @media screen and (min-width: 40em) {
    header.site-header{
      border-bottom: 3px solid #25cef7;
      position: sticky;
      top:0;
      z-index: 5;
    }
  }
  //Scoped Css that depends on Phila.gov Standards
  #ost-app {
    display:block;
    
    .intro-text{
      padding: 2rem 0;
    }
    .search-row{
      position: sticky;
      top: 76px;
      width: 100%;
      z-index: 10;
      padding: 1rem 0;
      background: white;
    }
    .card.action-panel .panel {
      padding-bottom: 0;
    }
    .ost-clear-search-btn {
      position: absolute;
      top: 16px;
      right: 68px;
      padding: 0;
      font-size: 20px;
      background-color: #fff;
      opacity: 0.8;
      z-index: 999;
      cursor: pointer;
      &:hover{
        color: #444;
      }
    }
    .ost-clear-all-btn {
      margin-top: 30px;
    }
    .ost-clear-all-filters-btn-link {
      background-color: #fff;
      color: #0f4d90;
      text-transform: none;
      &:disabled {
        opacity: 0.5;
      }
    }
    h2.ost-featured-programs-title {
      margin-top: 0;
    }
    .ost-featured-programs {
      margin-bottom: 30px;
    }
    .in-modal {
      .ost-apply-filters-btn {
        position: fixed;
        bottom: 42px;
        width: 100%;
        display: block;
        line-height: 20px;
      }
      .ost-clear-all-btn {
        width: 100%;
        display: block;
        background-color: #fff;
        color: #0f4d90;
        text-decoration: underline;
        text-transform: uppercase;
        text-align: center;
        position: fixed;
        bottom: 0px;
        line-height: 20px;
        &:disabled {
          opacity: 1 !important;
          color: rgba(15, 77, 144, 0.4) !important;
        }
      }
    }
    .ost-sidebar-filters {
      position: sticky; 
      top: 100px;
      height: 100vh;
      overflow: scroll;
      padding: 0 1rem 10rem 0;
      border-right:1px solid #ccc;

      h2.ost-sidebar-header {
        margin: 0;
        text-transform: uppercase;
        font-size: 17px;
        font-weight: 700;
      }
    }
    @media screen and (max-width: 39.9375em) {
      .ost-sidebar-filters{
        position: relative;
        height: 100vh;
      }
      .ost-sidebar-filters-wrap {
        min-height: auto;
        max-height: calc(100vh - 12rem);
        overflow-y: scroll;
        overflow-x: hidden;
        padding-bottom: 2rem;
      }
      &.os-android {
        .ost-sidebar-filters-wrap {
          max-height: calc(100vh - 141px);
        }
      }
    }
    .ost-contact{
      border-right: 1px solid #ccc;
    }
    .ost-program-agency{
      font-size: 1rem;
      font-style: italic;
    }
    .program-icon-content{
      width: calc(100% - 45px);
      float:right;
    }
    .ost-programs ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
    .ost-pagination {
      text-align: right;
      .paginate-links {
        text-align: center;
      }
    }
    .ost-sort-by {
      text-align: right;
      span {
        font-weight: 700;
      }
      select {
        width: auto;
        display: inline-block;
      }
    }
    .ost-results-count {
      @media screen and (max-width: 39.9375em) {
        line-height: 1.3;
      }
    }
    input[type=checkbox] {
      &:disabled {
        + label {
          opacity: 0.4
        }
      }
    }
    .v--modal-overlay {
      z-index: 999999 !important;
      // overflow: auto;
      // background-color: #fff;
    }
    .v-modal-btns {
      background-color: #fff;
      z-index: 999;
    }
    .checkbox-wrap {
      label {
        line-height: 1.2;
        margin-bottom: 10px;
        width: 100%;
        div {
          display: inline-block;
          vertical-align: top;
          padding: 0 0 0 1rem;
          max-width: calc(100% - 23px);
        }
      }
      @media screen and (max-width: 39.9375em) {
        margin: 10px 0 0 10px;
        label {
          font-size: 18px;
          width: 100%;
          margin-right: 0;
          div {
            max-width: 280px;
          }
        }
      }
    }
  }

  ul.paginate-links,
  .pagination,
  .pagination-wrapper{
    display: inline-block;
    margin:0;
    padding:0;

  li{
    display: inline-block;
    border-right: 2px solid white;
    margin-bottom:1rem;
    &.disabled{
      display: none;
    }
  }
  a{
    display: block;
    padding: 0 .5rem;
    background: #0f4d90;
    color:white;
  }
  a{
    color:white;
  }
  li.active a{
    background: white;
    color: #444;
  }
}
section ul.pagination-wrapper,
section ul.pagination-wrapper ul {
  overflow: initial;
}

[class*=" next-"]{
  display: none;
}
[class*=" disabled"]{
  display: none !important;
}
.pagination-wrapper{
  float:right;
  .next, .prev{
    &.disabled{
      display: none;
    }
  }
}

.no-results {
  font-weight: bold;
  display: none;
}

.app-footer.anchor{
  position: sticky;
  bottom:0;
}
//TODO: move to phila-ui
//add outline to checkboxes 
input[type=checkbox]:focus + label::before {
  outline: rgb(59, 153, 252) auto 5px;
  padding: 0;
}
input[type=checkbox] + label::after {
  padding: 0 0 0 1rem;
}

input[type=checkbox]:checked+label::before,
input[type=checkbox]+label::before{
  padding: 0
}

input[type=checkbox] {
  display: block;
  opacity: 0;
  height: 0;
  margin: 0;
}

@media print{
  .ost-sidebar-filters,
  .ost-mobile-filters,
  a[href]:after,
  .pagination, 
  .ost-print,
  .app-footer{
    display: none;
  }
  .ost-results{
    width: 100%;
  }
}
</style>
