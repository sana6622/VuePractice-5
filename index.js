import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "sana-teashop";

const UserModal = {
  props: ["tempProduct","addProductToCart"],
  data() {
    return {
      productModal: "",
      quantity:1
    };
  },
  template: "#userProductModal",
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.productModalRef);
  },
  methods: {
    openUserModal() {
      this.productModal.show();
      console.log("temp", this.tempProduct);
    },
    closeUserModal() {
      this.productModal.hide();
      console.log("temp", this.tempProduct);
    },
  },
  //彈窗的數量會保留上一次的數字，所以要每次彈開數量都顯示1
  //所以監聽tempProduct 有沒有改變
  watch:{
     tempProduct(){
        this.quantity = 1
     }
  }
};



const app = createApp({
  components: {
    UserModal,
  },

  data() {
    return {
      products: [],
      tempProduct: {},
      addToCartLoading: "",
      cartChangeLoading:"",
      carts:{},
      
    };
  },

  mounted() {
    this.getProducts();
    this.getCart();
  },

  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products;         
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    openModal(product) {
      this.tempProduct = product;
      console.log("open", this.tempProduct);
      this.$refs.userModalRef.openUserModal();
    },

    //加入購物車
    addToCart(product_id, qty = 1) {
      this.addToCartLoading = product_id;
      const order = {
        product_id,
        qty,
      };

      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data: order })
        .then((res) => {         
          this.addToCartLoading = '';
          this.$refs.userModalRef.closeUserModal()
          this.getCart()
        });
    },

    //取得購物車
    getCart(){
        axios
        .get(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          this.carts = res.data.data;
          this.cartChangeLoading = ""         
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    
    //修改購物車商品數量
    // changeCartQuantity(item, qty = 1){
    //     this.cartChangeLoading = item.id
    //     const orderChange = {
    //         product_id:item.product.id,
    //         qty,
    //       };

    //       axios
    //         .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data: orderChange })
    //         .then((res) => {
    //           console.log("chagne res", res);
    //           this.getCart()
    //           this.cartChangeLoading = ""
    //         });
    // },

  //修改購物車商品數量
    clickCartQuantity(item, qty = 1, state){    
        this.cartChangeLoading = item.id
        if(state==="minus"){
            qty>1?qty--:qty     
        }else {
            qty++    
        }

        const orderChange = {
            product_id:item.product.id,
            qty,
          };

          axios
            .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data: orderChange })
            .then((res) => {
              console.log("chagne res", res);
              this.getCart()
              
            });
    },

    //刪除購物車
    deleteCartItem(id){
        this.cartChangeLoading = id
        console.log('dele',id)
        axios
            .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
            .then((res) => {              
              this.getCart()              
            });
    },

    //刪除所有購物車商品
    deleteAllCart(){
      axios
      .delete(`${apiUrl}/api/${apiPath}/carts`)
      .then((res) => {              
        this.getCart()
        alert(res.data.message)
        
      }).catch((e)=>{
        console.log('error',error)
      });
    },
    
    clickNext(){
      window.location="orderInfo.html"
    }

  },
});

app.mount("#app");
