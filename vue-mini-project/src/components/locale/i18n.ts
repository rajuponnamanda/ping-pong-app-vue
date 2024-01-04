import { createI18n } from '../../../node_modules/vue-i18n'
import en from './en.json';
import du from './du.json'


const i18n = createI18n({
    locale: 'En',
    messages: {
      En: en,
      Du: du
    }
  })

  export default i18n;