<template>
  <div class="accordion-wrap">
    <div 
      :id="makeID(accordionTitle)"
      :class="{open : showContent}"
      class="accordion-title bg-ghost-gray"
      tabindex="0"
      role="region"
      :aria-expanded="showContent"
      @click="toggle"
      @keyup.enter="toggle"
    >
      <slot name="title">
        {{ accordionTitle }}
      </slot>
    </div>
    <div 
      v-show="showContent"
      class="accordion-content"
      tabindex="0"
      :aria-labelledby="makeID(accordionTitle)"
    >
      <slot name="content">
        Content
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accordionTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showContent: false,
    };
  },
  computed: {

  },
  methods: {
    toggle() {
      this.showContent = !this.showContent;
    },
    makeID(){
      return this.accordionTitle.replace(/\s+/g, '-').toLowerCase();
    },
  },
};
</script>
<style lang="scss" scoped>
.accordion-title {
  cursor: pointer;
  text-transform: uppercase;
  color: #444;
  font-size: 17px;
  font-weight: 700;
  padding: 1.15rem 1rem;
  border-bottom: 1px solid #ccc;
  position: relative;
  &:after {
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
.accordion-content {
  padding: 1rem;
}
</style>