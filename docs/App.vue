<template>
  <div class="demo">

    <Demo/>
  </div>
</template>

<script>
import Demo from './Demo.vue';

export default {
  name: 'App',
  components: { Demo },
};
</script>

<style scoped>
.demo {
  padding: 24px;
}
</style>

