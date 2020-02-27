<template>
  <div class="app-footer anchor">
    <footer>
      <div class="row expanded">
        <div class="columns">
          <nav>
            <ul class="inline-list">
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSehlWKBdFmfhox8bXzU8UD7pCfiIaCUXjuHGg1k6imWmn1CvA/viewform" 
                  class="external"
                  target="_blank"
                >Give us feedback</a>
              </li>
              <li>
                <a 
                  href="#"
                  @click="$modal.show('disclaimerModal')"
                >
                  Read our disclaimer</a>
              </li>
              <li>
                <a 
                  href="https://www.phila.gov/programs/out-of-school-time-ost/"
                >
                  Learn about Out-of-School Time</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import VModal from 'vue-js-modal';

export default {


}; 
</script>
