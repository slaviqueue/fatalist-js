export default mappings => ({
  withDefault(value) {
      return message => mappings[message] || value
  }
})