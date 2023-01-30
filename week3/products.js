import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = {};
let delProductModal = {};

const site = 'https://vue3-course-api.hexschool.io/v2'
const api_path ='boxingbat'

const app = createApp({
  data() {
    return {
      products: [],
      status: false,//確認是編輯或是新增
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  // mounted() {
  //   productModal = new bootstrap.Modal(document.getElementById('productModal'), {
  //     keyboard: false
  //   });

  //   delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
  //     keyboard: false
  //   });

  //   // 取出 Token
  //   const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
  //   axios.defaults.headers.common.Authorization = token;

  //   this.checkAdmin();
  // },
  methods: {
    checkAdmin() {
      const url = `${site}/api/user/check`;
      axios.post(url)
      .then((res) => {
        this.products = res.data.products;
      })
      .catch((err) => {
        alert(err.response.data.message);
      })
    },

    getProducts() {
      const url =`${site}/api/${api_path}/admin/products/all`;
      console.log(url);
      axios.get(url)
        .then((res)=>{
          console.log(res)
          this.products = res.data.products;
          console.log(this.products)
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
        
        
    },

    openModal(status, item) {
      if (status === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.status = true;
        productModal.show();
        //帶入初始化資料
      } else if (status === 'edit') {

        this.status = false;
        productModal.show();
        this.tempProduct = { ...item };
        //帶入當前要編輯的資料
      } else if (status === 'delete') {
        this.tempProduct = { ...item };//取得ＩＤ使用
        delProductModal.show()
      }
    },
    

    updateProduct() {
      let url =`${site}/api/${api_path}/admin/product`;
      //use status 判斷API如何進行
      let method = 'post'
      if (!this.status){
        url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = 'put';
      }
      axios[method](url, { data: this.tempProduct })
        .then(res => {
          console.log(res);
          this.getProducts();
          productModal.hide();
        })


    },
    delProduct(){
        const url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
       
      axios.delete(url).then(() =>{
        this.getProducts();
        delProductModal.hide();


      })
       
    },
    
    // getData() {
    //   const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
    //   axios.get(url).then((response) => {
    //     this.products = response.data.products;
    //   }).catch((err) => {
    //     alert(err.response.data.message);
    //   })
    // },
  
 
    // delProduct() {
    //   const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

    //   axios.delete(url).then((response) => {
    //     alert(response.data.message);
    //     delProductModal.hide();
    //     this.getData();
    //   }).catch((err) => {
    //     alert(err.response.data.message);
    //   })
    // },
    // createImages() {
    //   this.tempProduct.imagesUrl = [];
    //   this.tempProduct.imagesUrl.push('');
    // },
  },
  mounted() {
    // console.log(`${site}api/${api_path}/admin.products`)
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)boxingBatToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    //axios headers
    axios.defaults.headers.common['Authorization'] = token;
    this.getProducts()

    // Bootstrap 方法
    //1 初始化 2.呼叫方法 show, hide
    // console.log(bootstrap);
    productModal = new bootstrap.Modal('#productModal',);
    // productModal.show();// 確保可以執行
    delProductModal = new bootstrap.Modal('#delProductModal')

  },
});
app.mount('#app');