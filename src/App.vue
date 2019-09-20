<template>
  <div id="ost-app">
    <div class="row">
      <div class="small-24 columns">
        <div
          v-if="ready"
          class="row columns"
        >
          <div class="row columns">
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
                    placeholder="Search by keyword, services offered, focus areas, or zip code"
                    @keydown.enter="updateResultsList();"
                    @keyup.enter="hideMobileKeyboard($event); updateResultsList()"
                  ><input
                    ref="jb-search-bar"
                    type="submit"
                    class="search-submit"
                    value="Search"
                    @click="updateResultsList();"
                  >
                  <button
                    v-if="search.length > 0"
                    class="jb-clear-search-btn"
                    @click="clearSearchBar"
                  >
                    <i class="fal fa-times-square" />
                  </button>
                </label>
            </div>
          </div>
          <div class="row">
            <!-- Filters -->
            <template v-if="isMq(['md', 'lg'])">
              <div class="columns small-24 medium-7">
                <program-filters
                  :update-results-list="updateResultsList"
                  :clear-all-filters="clearAllFilters"
                  :programage.sync="programage"
                  :programgrade.sync="programgrade"
                  :programterm.sync="programterm"
                  :programfocus.sync="programfocus"
                  :programtransit.sync="programtransit"
                  v-bind="{ 
                    programTransportationFilters, 
                    programAgeFilters, 
                    programGradeFilters,
                    programTermFilters,
                    programFocusFilters,
                    hasFilters, 
                    vModal: false }"
                />
              </div>
            </template>
            <template v-if="isMq(['sm'])">
              <div class="columns small-24">
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
                      class="jb-clear-all-filters-btn-link"
                      :disabled="!hasFilters"
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
                <program-filters
                  :class="isMobile.Android() ? 'os-android' : ''"
                  :update-results-list="updateResultsList"
                  :clear-all-filters="clearAllFilters"
                  :programage.sync="programage"
                  :programgrade.sync="programgrade"
                  :programterm.sync="programterm"
                  :programfocus.sync="programfocus"
                  :programtransit.sync="programtransit"
                  v-bind="{ jobTranportationFilters, 
                    programAgeFilters,
                    programGradeFilters, 
                    programTermFilters,
                    programFocusFilters,
                    hasFilters, 
                    vModal: true }"
                />
              </modal>
            </template>

            <!-- Results -->
            <div class="columns small-24 medium-17">
              <div
                v-if="!hasFilters"
                class="row"
              >
              </div>
              <div class="grid-x align-top">
                <!-- Results Count -->
                <div class="cell small-24 medium-14 small-order-2 medium-order-1">
                  <div
                    class="jb-results-count"
                    v-html="programCount"
                  />
                </div>
              </div>
              <!-- Program List -->
              <ul class="jb-programs no-bullet">
                <li
                  v-for="program in results"
                  :key="program.id"
                >
                  <!-- Program -->
                  <div class="jb-job">
                    <!-- Program Title -->
                    <div class="jb-job-title-wrap bg-ghost-gray clearfix">
                      <div class="jb-job-title h3">
                        <a
                          :href="program.WEBSITE_ADDRESS"
                          target="_blank"
                        >{{ program.name }} - {{ program.agency }}</a>
                      </div>
                    </div>
                    <!-- Program Body -->
                    <div class="ost-location">
                      <div class="ost-address">
                        {{ program.address }}<br>
                        {{ program.city }}, {{ program.state }} {{ program.zip }}

                      </div>
                      <div class="ost-phone">
                        {{program.phone}}
                      </div>
                    </div>
                    <div class="ost-program-contact">
                      {{ program.staff.title }}<br>
                      {{ program.staff.firstName }}<br>
                      {{ program.staff.lastName }}<br>
                      {{ program.staff.email }}<br>
                      {{ program.online.web }}<br>
                      {{ program.online.facebook }}<br>
                      {{ program.online.instagram }}<br>
                      {{ program.online.twitter }}<br>
                    </div>
                    <div class="ost-registration-information">
                      <b>Registration open:</b> {{ program.registration.startDate }} - {{ program.registration.endDate }} <br>
                      <b>Program runs from:</b> {{ program.timeDetails.startDate }} - {{ program.timeDetails.endDate}}<br>
                      <b>Days offered:</b>  {{ program.timeDetails.days }}<br>
                      <b>Times offered:</b> {{ program.timeDetails.startTime }} - {{ program.timeDetails.Endtime }}<br>
                    </div>
                    <div class="ost-focus-areas">
                      <h3>Focus areas</h3>
                      
                      {{ program.focus_isCommunityService }}<br>
                      {{ program.focus_isCharacterDevelopment }}<br>
                      {{ program.focus_isCollegeCareer }}<br>
                      {{ program.focus_isArt }}<br>
                      {{ program.focus_isAcademic }}<br>
                      {{ program.focus_isHealth }}<br>

                      <span v-html="program.subcats"></span>
                    </div>
                    <div class="details">
                      <h3>Details</h3>
                      <b>Ages:</b> 
                        {{program.age_isUnder5 }}<br>
                        {{program.age_is5to10}}  <br>
                        {{program.age_is11to13}}<br>
                        {{program.age_is14to18 }}<br>
                        {{program.age_isAbove18}}
                        <br>
                      <b>Grades:</b>
                        {{program.grade_prek }}<br>
                        {{program.grade_kto4 }}<br>
                        {{program.grade_5to8 }}<br>
                        {{program.grade_9to12 }}<br>

                      <b>Costs:</b> {{ program.costs }} <br>
                      <b>Term: </b> {{program.term}} <br>
                      <b>Services:</b> {{ program.services }}<br>
                      <b>Transportation:</b> {{ program.transport }} <br>
                      <b>Meals:</b> {{ program.meals }}

                    </div>
                    {{ program }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          v-else
          class="row columns text-center"
        >
          <i class="fas fa-spinner fa-spin fa-3x loadingdir" />
        </div>
      </div>
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
import programFilters from './components/programFilters.vue';
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
// Vue.use(VTooltip)

/**
* @desc initializes search component; accessible via this.$search
* @returns { Promise }
*/
Vue.prototype.$search = function (term, list, options) {
  return new Promise(function (resolve, reject) {
    var run = new Fuse(list, options);
    var results = run.search(term);
    console.log(results)
    resolve(results);
  });
};

export default {
  name: 'OST',
  components: {
    programFilters,
  },
  data () {
    return {
      api: {
        // featprograms: 'https://www.phila.gov/wp-json/programs/v1/featured',
        // getAllDepartments: 'https://www.phila.gov/wp-json/departments/v1/list',
        getPrograms: 'https://api.cityspan.com/phillyost/service/getall',
      },
      originalPrograms: [],
      allPrograms: [],
      //departments: [],
      //departmentsWithprograms: [],
      //dept: '',
      // featprograms: [],
      fuseSearchOptions: {
        defaultAll: false,
        keys: [
          'name',
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
          label: 'K - 4',
          matchKey: 'grade_kto4',
          matchValue: 'grade_kto4',
          valueStore: 'programgrade',
        },
        {
          label: '5 - 8',
          matchKey: 'grade_5to8',
          matchValue: 'grade_5to8',
          valueStore: 'programgrade',
        },
        {
          label: '9 - 12',
          matchKey: 'grade_9to12',
          matchValue: 'grade_9to12',
          valueStore: 'programgrade',
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
          label: 'Sports, heath, and wellness activities',
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
      // paginate: [ 'results' ],
      // paginateStepLinks: {
      //   next: 'Next',
      //   prev: 'Previous',
      // },
      ready: false,
      results: [],
      routerQuery: {},
      search: '',
      // sort: 'Most recent',
      // sortByTypes: [
      //   'Most recent',
      //   'Alphabetical',
      //   'Closing soon',
      //   'Salary (high to low)',
      //   'Salary (low to high)',
      // ],
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
        if ([ 'programage', 'programgrade', 'programterm', 'programfocus','programtransit' ].includes(key)) {
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
    // dept (value) {
    //   if (value.length > 0) {
    //     this.updateRouterQuery('dept', value);
    //   } else {
    //     this.updateRouterQuery('dept');
    //   }
    // },
    programage (value) {
      if (value.length > 0) {
        console.log('programage', value)
        this.updateRouterQuery('programage', value);
      } else {
        console.log('programage', value)
        this.updateRouterQuery('programage');
      }
    },
    programgrade (value) {
      if (value.length > 0) {
        console.log('programgrade', value)
        this.updateRouterQuery('programgrade', value);
      } else {
        console.log('programgrade', value)
        this.updateRouterQuery('programgrade');
      }
    },
    programterm (value) {
      if (value.length > 0) {
        console.log('programterm', value)
        this.updateRouterQuery('programterm', value);
      } else {
        console.log('programterm', value)
        this.updateRouterQuery('programterm');
      }
    },
    programfocus (value) {
      if (value.length > 0) {
        console.log('programfocus', value)
        this.updateRouterQuery('programfocus', value);
      } else {
        console.log('programfocus', value)
        this.updateRouterQuery('programfocus');
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
    // sort (value) {
    //   if (value.length > 0 && value !== this.defaultSort) {
    //     this.updateRouterQuery('sort', value);
    //   } else {
    //     this.updateRouterQuery('sort');
    //   }
    // },
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
    },

    /**
    * @desc clears search bar
    */
    clearSearchBar () {
      this.search = '';
      this.updateResultsList();
    },

    /**
    * @desc filters programs by departments (drop-down)
    * @param { Array } programs
    * @returns { Array } of filtered programs
    */
    // departmentFilter (programs) {
    //   if (this.dept !== '') {
    //     return programs.filter((job) => {
    //       return this.dept === job.department;
    //     }, this);
    //   }
    //   return programs;
    // },

    /**
    * @desc join salaries into single string
    * @param { String } salaryStart
    * @param { String } salaryEnd
    * @returns { String }
    */
    // displaySalary (salaryStart, salaryEnd) {
    //   let display = [];
    //   if (salaryStart !== 'Not Available') {
    //     display.push(`$${salaryStart}`);
    //   }
    //   if (salaryEnd !== 'Not Available') {
    //     display.push(` - $${salaryEnd}`);
    //   }
    //   return display.join(' ');
    // },

    /**
    * @desc get official list of departments from phila.gov
    * @returns { Promise }
    */
    // async getAllDepartments () {
    //   let depts = [];
    //   let self = this;
    //   return axios.get(this.api.getAllDepartments).then((result) => {
    //     result.data.forEach((dept) => {
    //       depts.push(dept.short_name || dept.name);
    //     });
    //     depts.push('Multiple departments');
    //     self.departments = depts;
    //     return;
    //   }).catch(error => {
    //     console.log(error);
    //   });
    // },

    /**
    * @desc Get a max of two featured programs from phila.gov
    * Featured programs are only displayed if also available on all programs feed
    * @returns { Promise }
    */
    // getFeatprograms () {
    //   let self = this;
    //   return axios.get(this.api.featprograms).then((response) => {
    //     let fprograms = response.data;
    //     self.featprograms = fprograms.filter((fjob) => {
    //       return self.programs.some((job) => {
    //         let tempUrl = job.url.replace(/https?:\/\//gi, '');
    //         let tempFeatUrl = fjob.link.replace(/https?:\/\//gi, '');
    //         return tempUrl === tempFeatUrl;
    //       });
    //     });
    //   }).catch(error => {
    //     console.log(error);
    //   });
    // },

    /**
    * @desc Get a list of all programs from api
    * @returns { Boolean }
    */
    getPrograms () {
      let self = this;
      let newProgram = {};
      return axios.get(self.api.getPrograms).then(async (result) => {

        self.originalPrograms = result.data

        result.data.forEach((program) => {
          let newProgram = self.cleanPrograms({
            id: program.serviceid,

            age_isUnder5: program.isUnder5,
            age_is5to10: program.is5to10,
            age_is11to13: program.is11to13,
            age_is13to14: program.is13to14,
            age_is14to18: program.is14to18,
            age_isAbove18: program.isAbove18,

            grade_prek: program.serviceGradeLevelPreK || null,
            grade_kto4: program.serviceGradeLevel1 || program.serviceGradeLeve2 || program.serviceGradeLevel3 || program.serviceGradeLevel4 || null,
            grade_5to8: program.serviceGradeLevel5 || program.serviceGradeLevel6 || program.serviceGradeLevel7 || program.serviceGradeLevel8 || null,
            grade_9to12: program.serviceGradeLevel9 || program.serviceGradeLevel10 || program.serviceGradeLevel11 || program.serviceGradeLevel12 || null,
            
            term: program.SchoolYearOrSummer,

            focus_isCommunityService: (program.isCommunityService) ? 'focus_isCommunityService' : null,
            focus_isCharacterDevelopment: (program.isCharacterDevelopment) ? 'focus_isCharacterDevelopment' : null,
            focus_isCollegeCareer: (program.isCollegeCareer) ? 'focus_isCollegeCareer' : null,
            focus_isArt: (program.isArt) ? 'focus_isArt' : null,
            focus_isHealth: (program.isHealth) ? 'focus_isHealth' : null,
            focus_isAcademic: (program.isAcademic) ? 'focus_isAcademic' : null,

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
            categories: program.subcats,
            staff: {
              title: program.staffTitle,
              firstName: program.stafffirstname,
              lastName: program.stafflastname, 
              email: program.staffemail
            },
            online: {
              web: program.WEBSITE_ADDRESS,
              facebook: program.FACEBOOK,
              instagram: program.INSTAGRAM,
              twitter: program.TWITTER 
            },
            registration: {
              startDate: program.RegistrationPeriodStartDate,
              endDate: program.RegistrationPeriodEndDate
            },
            timeDetails: {
              startDate: program.begindate_str,
              endDate: program.enddate_str,
              startTime: program.begintime,
              endTime: program.endtime,
              days: program.daynames
            },
            costs: program.COSTS,
            services: program.SERVICES,
            meals: program.MEALS

          })
          self.allPrograms.push(newProgram)

        })

        self.results = self.allPrograms;
        self.programs = self.allPrograms;


        return true;
      }).catch((error) => {
        console.log(error);
        return false;
      });
    },

    cleanPrograms (program) {

      if ( program.age_isUnder5 ){
        program.age_isUnder5 = 'age_isUnder5'
      }
      if ( program.age_is5to10 ) {
        program.age_is5to10 = 'age_is5to10'
      }
      if ( program.age_is11to13 ) {
        program.age_is11to13 = 'age_is11to13'
      }
      if ( program.age_is14to18 ) {
        program.age_is14to18 = 'age_is14to18'
      }
      if ( program.age_isAbove18 ) {
        program.age_isAbove18 = 'age_isAbove18'
      }

      if ( program.grade_prek ){
        program.grade_prek = 'grade_prek' 
      }
      if ( program.grade_kto4 ){
        program.grade_kto4 = 'grade_kto4' 
      }
      if ( program.grade_5to8 ){
        program.grade_5to8 = 'grade_5to8' 
      }
      if ( program.grade_9to12 ){
        program.grade_9to12 = 'grade_9to12' 
      }
      return program
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
      //await this.getAllDepartments();
      await this.getPrograms();
      //await this.getFeatprograms();
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
          // Vue.set(this, key, this.$route.query[key]);
          // break;
        default:
          Vue.set(this, key, this.returnArray(this.$route.query[key]));
          break;
        }
      }
    },

    /**
    * @desc checks against Invalid Date string (bad output from Date)
    * @param { String } date (from from Date Object in the backend
    * which returns Invalid Date when date is not valid)
    * @returns { Boolean }
    */
    isDateValid (date) {
      if (date !== 'Invalid Date' && typeof date !== 'undefined') {
        return true;
      }
      return false;
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
    * @desc filters programs array. All sidebar checkboxes uses this filter
    * @param { Array } programs
    * @returns { Array } of filtered programs
    */
    programFilters (programs) {
      let programFilters = [
        ...this.programAgeFilters,
        ...this.programGradeFilters,
        ...this.programTermFilters,
        ...this.programFocusFilters,
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
    * @todo part of this functionality has been moved to the server side, could build this list differently now
    * @desc used by @method getPrograms to make list of all departments that have availabe positions.
    * which is displayed on the departments drop-down
    * @param { Array } programs
    */
    // matchDepartments (programs) {
    //   let self = this;
    //   programs.forEach((job, index) => {
    //     if (job.department && !self.departmentsWithprograms.includes(job.department) && self.departments.includes(job.department)) {
    //       self.departmentsWithprograms.push(job.department);
    //     }
    //   });
    //   // self.departmentsWithprograms.sort();
    // },

    /**
    * @desc resets all filters
    */
    resetFilters () {
      //this.dept = '';
      this.programtransit = [];
      this.programage = [];
      this.programgrade = [],
      this.programterm = [],
      this.programfocus = [],
      this.search = '';
      // this.sort = this.defaultSort;
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
        console.log(this.$search(this.search, programs, this.fuseSearchOptions))
        return this.$search(this.search, programs, this.fuseSearchOptions);
      } 
      this.updateRouterQuery('search');
      Vue.delete(this.routerQuery, 'search');
      return programs;
      
    },

    /**
    * @desc sorts programs { Array } by sort drop-down
    */
    // sortResults () {
    //   switch (this.sort) {
    //   case 'Alphabetical':
    //     this.results.sort((a, b) => {
    //       if (a.title < b.title) {
    //         return -1;
    //       }
    //       if (a.title > b.title) {
    //         return 1;
    //       }
    //       return 0;
    //     });
    //     break;
    //   case 'Closing soon':
    //     this.results.sort((a, b) => {
    //       if (a.closeDate === null) {
    //         return 1;
    //       }
    //       if (b.closeDate === null) {
    //         return -1;
    //       }
    //       if (a.closeDate < b.closeDate) {
    //         return -1;
    //       }
    //       if (a.closeDate > b.closeDate) {
    //         return 1;
    //       }
    //       return 0;
    //     });
    //     break;
    //   case 'Salary (high to low)':
    //     this.results.sort((a, b) => {
    //       let aS = parseFloat(a.salaryStart.replace(/,/g, '.'));
    //       let bS = parseFloat(b.salaryStart.replace(/,/g, '.'));

    //       if (isNaN(aS)) {
    //         return 1;
    //       }

    //       if (isNaN(bS)) {
    //         return -1;
    //       }

    //       return bS - aS;
    //     });
    //     break;
    //   case 'Salary (low to high)':
    //     this.results.sort((a, b) => {
    //       let aS = parseFloat(a.salaryStart.replace(/,/g, '.'));
    //       let bS = parseFloat(b.salaryStart.replace(/,/g, '.'));

    //       if (isNaN(aS)) {
    //         return 1;
    //       }

    //       if (isNaN(bS)) {
    //         return -1;
    //       }

    //       return aS - bS;
    //     });
    //     break;
    //   default:
    //     this.results.sort((a, b) => {
    //       if (a.published > b.published) {
    //         return -1;
    //       }
    //       if (a.published < b.published) {
    //         return 1;
    //       }
    //       return 0;
    //     });
    //     break;
    //   }
    // },

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

      //filteredprograms = this.departmentFilter(filteredprograms);
      filteredprograms = await this.searchBarFilter(filteredprograms);
      filteredprograms = this.programFilters(filteredprograms);

      this.results = filteredprograms;

      //this.sortResults();
    },

    /**
    * @desc updates routerQuery which tracks all current filters
    * @param { String } key
    * @param { String } value
    */
    updateRouterQuery (key, value) {
      if (typeof value === 'undefined') {
        Vue.delete(this.routerQuery, key);
        console.log('is this undefined?')
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
  //Scoped Css that depends on Phila.gov Standards
  //@todo remove Standard on prod
  #ost-app {
    overflow: hidden;
    .card.action-panel .panel {
      padding-bottom: 0;
    }
    .combo-search {
      select {
        float: left;
        width: 27.8%;
        margin-bottom: 40px;
      }
      .search {
        float: left;
        width: 72.2%;
        .search-field {
          min-height: 3.15rem;
          border-left: 0;
          padding-right: 5.15rem;
          &:focus {
            min-height: 3.15rem;
            border-left: 0;
          }
        }
        &:after {
          height: 3.15rem;
          width: 3.15rem;
          font-size: 1.5rem;
        }
      }
      @media screen and (max-width: 39.9375em) {
        select {
          width: 100%;
          float: none;
          margin-bottom: 5px;
        }
        .search {
          width: 100%;
          float: none;
          margin-bottom: 5px;
          .search-field {
            border-left: 2px solid #0f4d90 !important;
          }
        }
      }
    }
    .jb-clear-search-btn {
      position: absolute;
      top: 12px;
      right: 52px;
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
    .jb-clear-all-btn {
      margin-top: 30px;
    }
    .jb-clear-all-filters-btn-link {
      background-color: #fff;
      color: #0f4d90;
      text-transform: none;
      &:disabled {
        opacity: 0.5;
      }
    }
    h2.jb-featured-programs-title {
      margin-top: 0;
    }
    .jb-featured-programs {
      margin-bottom: 30px;
    }
    .in-modal {
      .jb-apply-filters-btn {
        position: fixed;
        bottom: 42px;
        width: 100%;
        display: block;
        line-height: 20px;
      }
      .jb-clear-all-btn {
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
    .jb-feat-job {
      margin-bottom: 20px;
      .card {
        h3 {
          font-size: 1.42857rem !important;
          margin: 0;
          font-weight: 400;
        }
      }
    }
    .jb-sidebar-filters {
      .jb-sidebar-header {
        margin-top: 40px;
        text-transform: uppercase;
        color: #444;
        font-size: 17px;
        font-weight: 700;
        padding: 1.15rem 1rem;
        border-bottom: 1px solid #ccc;
        &.jb-first-sidebar-header {
          margin-top: 0;
        }
      }
      @media screen and (max-width: 39.9375em) {
        height: 100vh;
        .jb-sidebar-filters-wrap {
          min-height: auto;
          max-height: calc(100vh - 85px);
          overflow-y: scroll;
          overflow-x: hidden;
          padding-bottom: 20px;
        }
        &.os-android {
          .jb-sidebar-filters-wrap {
            max-height: calc(100vh - 141px);
          }
        }
      }
    }
    .jb-programs ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
    .jb-job {
      margin-bottom: 20px;
    }
    .jb-job-body {
      padding: 10px;
      &:after {
        content: ' ';
        display: table;
        clear: both;
      }
    }
    .jb-job-date {
      margin-bottom: 10px;
    }
    .jb-job-exam {
      margin-bottom: 10px;
    }
    .jb-job-dept {
      margin-bottom: 10px;
    }
    .jb-job-tag {
      display: inline-block;
      line-height: 1;
      padding: 2px 10px;
      background-color: #a1a1a1;
      margin: 3px 2px;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
      font-size: 12px;
    }
    .jb-job-tags {
      margin: 10px 0 15px;
      line-height: 1.1;
    }
    .jb-job-title {
      margin: 0 10px 0 0;
      line-height: 1.2;
    }
    .jb-job-title-wrap {
      padding: 7px 10px;
    }
    .jb-job-url {
      float: right;
    }
    .jb-pagination {
      text-align: right;
      .paginate-links {
        text-align: center;
      }
    }
    .jb-sort-by {
      text-align: right;
      span {
        font-weight: 700;
      }
      select {
        width: auto;
        display: inline-block;
      }
    }
    .jb-job-specialty {
      display: inline-block;
      font-size: 14px;
      color: #444;
      margin: 0 5px;
    }
    .jb-results-count {
      @media screen and (max-width: 39.9375em) {
        line-height: 1.3;
      }
    }
    .tooltip {
      display: block !important;
      z-index: 10000;
      padding: 0;
      border-radius: 5px;

      .tooltip-inner {
        color: white;
        padding: 10px;
      }

      .tooltip-arrow {
        width: 0;
        height: 0;
        border-style: solid;
        position: absolute;
        margin: 5px;
        border-color: black;
        z-index: 1;
      }

      &[x-placement^="top"] {
        margin-bottom: 5px;

        .tooltip-arrow {
          border-width: 5px 5px 0 5px;
          border-left-color: transparent !important;
          border-right-color: transparent !important;
          border-bottom-color: transparent !important;
          bottom: -5px;
          left: calc(50% - 5px);
          margin-top: 0;
          margin-bottom: 0;
        }
      }

      &[x-placement^="bottom"] {
        margin-top: 5px;

        .tooltip-arrow {
          border-width: 0 5px 5px 5px;
          border-left-color: transparent !important;
          border-right-color: transparent !important;
          border-top-color: transparent !important;
          top: -5px;
          left: calc(50% - 5px);
          margin-top: 0;
          margin-bottom: 0;
        }
      }

      &[x-placement^="right"] {
        margin-left: 5px;

        .tooltip-arrow {
          border-width: 5px 5px 5px 0;
          border-left-color: transparent !important;
          border-top-color: transparent !important;
          border-bottom-color: transparent !important;
          left: -5px;
          top: calc(50% - 5px);
          margin-left: 0;
          margin-right: 0;
        }
      }

      &[x-placement^="left"] {
        margin-right: 5px;

        .tooltip-arrow {
          border-width: 5px 0 5px 5px;
          border-top-color: transparent !important;
          border-right-color: transparent !important;
          border-bottom-color: transparent !important;
          right: -5px;
          top: calc(50% - 5px);
          margin-left: 0;
          margin-right: 0;
        }
      }

      &.popover {
        $color: #f9f9f9;

        .popover-inner {
          background: $color;
          color: black;
          padding: 24px;
          border-radius: 5px;
          box-shadow: 0 5px 30px rgba(black, .1);
        }

        .popover-arrow {
          border-color: $color;
        }
      }

      &[aria-hidden='true'] {
        visibility: hidden;
        opacity: 0;
        transition: opacity .15s, visibility .15s;
      }

      &[aria-hidden='false'] {
        visibility: visible;
        opacity: 1;
        transition: opacity .15s;
      }

      &.info {
        $color: #004499;
        .tooltip-inner {
          background: $color;
          color: white;
          border-radius: 5px;
          box-shadow: 0 5px 30px rgba(black, .3);
          max-width: 300px;
          font-size: 14px;
        }
        .tooltip-arrow {
          border-color: $color;
        }
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
        div {
          display: inline-block;
          vertical-align: top;
          max-width: 230px;
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
</style>
