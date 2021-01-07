<template>
  <div>
    <div>示例</div>
    <div id="abc"></div>
  </div>
</template>
<script>
import mix from './mix'
export default {
  mixins: [mix],
  data(){
    return {
      id: 'abc'
    }
  }
}
</script>