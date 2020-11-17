<template>
  <div id="app">
    <work-flow
      :node.sync="node" 
      :design="form" 
      :conditionsList.sync="conditionsList" />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      node: null,
      form: {
        list: []
      },
      conditionsList: []
    }
  }
}
</script>

<style></style>
