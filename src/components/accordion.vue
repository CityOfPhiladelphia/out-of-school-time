<template>
  <div class="accordion-wrap">
    <div 
      @click="toggle"
      @keyup.enter="toggle"
      :class="{open : showContent}"
      class="accordion-title bg-ghost-gray"
      tabindex="0">
      <slot name="title">Title</slot>
    </div>
    <div 
      v-show="showContent"
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
      showContent: false,
    }
  },
  methods: {
    toggle() {
      this.showContent = !this.showContent
    }
  },
}
</script>
<style lang="scss" scoped>
.accordion-title{
  cursor: pointer;
  margin-top: 40px;
  text-transform: uppercase;
  color: #444;
  font-size: 17px;
  font-weight: 700;
  padding: 1.15rem 1rem;
  border-bottom: 1px solid #ccc;
  position: relative;
  &:after{
    content: '\f078';
    font-family: 'Font Awesome 5 Pro';
    font-weight: 900;
    position: absolute;
    top: calc(50% - 13px);
    right: 2rem;
  }
  &.open {
    &:after{
      content: '\f077'
    }
  }
}
</style>