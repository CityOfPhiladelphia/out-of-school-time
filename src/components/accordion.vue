<template>
  <div class="accordion-wrap">
    <div 
      @click="toggle"
      class="accordion-title bg-ghost-gray"
      tabindex="0">
      <slot name="title">Title</slot>
    </div>
    <div 
      v-show="showSection"
      class="accordion-content"
      tabindex="0">
      <slot name="content">Content</slot>
    </div>
  </div>
</template>

<script>
//TODO: add aria controls + make insides tabable + open on enter
export default {
  data() {
    return {
      showSection: false,
    }
  },
  methods: {
    toggle() {
      this.showSection = !this.showSection
    }
  },
}
</script>
<style scoped>
.accordion-title{
  cursor: pointer;
  margin-top: 40px;
  text-transform: uppercase;
  color: #444;
  font-size: 17px;
  font-weight: 700;
  padding: 1.15rem 1rem;
  border-bottom: 1px solid #ccc;
}
</style>