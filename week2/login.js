import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const site = 'https://vue3-course-api.hexschool.io/v2/'

const app = createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',    
      }
    }
  },



// createApp({
//   data() {
//     return {
//       user: {
//         username: '',
//         password: '',
//       },
//     }
//   },
  methods :{
    login() {
      console.log(this.user)
      const url = `${site}admin/signin`;
      axios.post(url, this.user)
        .then((res) => {
         const { expired, token} = res.data;
         console.log(expired, token);
         document.cookie = `boxingBatToken=${token}; expires=${new Date(expired)};`;
         window.location = './products.html';
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  mounted() {
    console.log('mounted');

    console.log(`${site}admin/signin`);
    ;
  },

})
  // methods: {
  //   login() {
  //     const api = 'https://vue3-course-api.hexshchool.io/v2/admin/signin';
  //     axios.post(api, this.user).then((response) => {
  //       const { token, expired } = response.data;
  //       // 寫入 cookie token
  //       // expires 設置有效時間
  //       document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
  //       window.location = 'products.html';
  //     }).catch((err) => {
  //       alert(err.response.data.message);
  //     });
  //   },
  // },
app.mount('#app');