import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'boxingbat';

const ProductModal ={
    props : ['id', 'addToCart'],
    data() {
        return {
            modal: {},
            tempProduct : {},
            qty: 1,
        };
    },
    template : '#userProductModal',
    watch : {
        id () {
            console.log('productModal:', this.id)
            axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
                .then(res => {
                    console.log('Single Product List:', res.data.product);
                    this.tempProduct = res.data.product
                    this.modal.show();
                });
        }
    },
    methods: {
        hide(){
            this.modal.hide();
        }
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);
        
    },
};

const app = createApp ({
    data() {
        return {
            products: [],
            productId : '',
            cart : {},
            loadingItem: "",
            product: {},
            form: {
            user: {
                name: '',
                email: '',
                tel: '',
                address: '',
                },
            message: '',
            },
        }
    },

    methods: {
        getProducts () {
            axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
                .then(res => {
                    console.log('Product List:',res.data.products);
                    this.products = res.data.products
                })
        },
        openModal(id){
            this.productId = id;
            console.log('外層帶入 productId:', id);
        },
        // QTY帶入預設值
        addToCart(product_id, qty = 1) { 
            const data ={
                product_id,
                qty,
            };
            axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, { data })
                .then((res) => {
                    console.log('Add in Cart:', res.data);
                    this.products = res.data.products
                    this.$refs.productModal.hide()
                    this.getCarts() ;
                })
        },
        getCarts () {
            axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
                .then((res) => {
                    console.log('Cart :',res.data);
                    this.cart = res.data.data;    
                });
        },
        updateCartItem(item) { //Cart id , product id 
            const data = {
                    product_id: "item.product.id",
                    qty: item.qty,
                };
            this.loadingItem = item.id
            axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`, {data})
                .then((res) => {
                    console.log('Update Cart :',res.data);
                    this.getCarts() ;
                    this.loadingItem = " "  
                });
        },
        deleteCartItem(item) { 
            const data = {
                    product_id: "item.product.id",
                    qty: item.qty,
                };
            console.log(data, item.id);
            axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)
                .then((res) => {
                    console.log('delete Cart :',res.data);
                    this.getCarts() ;  
                });
        }
        
        
    },
    components : {
        ProductModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    mounted() {
        this.getProducts();
        this.getCarts();
    }
});


app.mount('#app')
