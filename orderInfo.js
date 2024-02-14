import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "sana-teashop";

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  data() {
    return {
      formData: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },

  methods: {
    phoneRule(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "請填寫正確的手機號碼";
    },

    onSubmit() {
      const datas = { ...this.formData };

      axios
        .post(`${apiUrl}/api/${apiPath}/order`, { data: datas })
        .then((res) => {
          console.log("res", res);
          alert(res.data.message);
          //清空表單
          this.$refs.form.resetForm();
        })
        .catch((e) => {
          console.log("error", e);
        });
    },

    clickPrev() {
      window.location = "index.html";
    },
  },
});

app.mount("#app");
