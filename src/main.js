import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Icons
import { fa } from 'vuetify/iconsets/fa';
import { md } from 'vuetify/iconsets/md';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    iconfonts: 'mdi',
    values: {
      dropdown: 'mdi-chevron-down',
    },
    aliases,
    sets: {
      mdi,
      fa,
      md,
    },
  },
});

const app = createApp(App);
app.use(vuetify);

app.mount('#app');
