// src/boot/pinia.js
import { boot } from 'quasar/wrappers'
import createPinia from 'src/stores'

export default boot(({ app }) => {
  app.use(createPinia())
})
