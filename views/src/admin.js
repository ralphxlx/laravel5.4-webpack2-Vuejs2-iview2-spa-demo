import Vue from "vue";
import vueResource from 'vue-resource';
import VueRouter from "vue-router";
import iview from 'iview';
import App from "./views/admin/App.vue";
import routes from "../src/router/admin-router";
import 'iview/dist/styles/iview.css';
import config from '../src/config/admin-config';

Vue.use(vueResource);
Vue.use(VueRouter);
Vue.use(iview);
window.config = config;
Vue.config.productionTip = config.productionTip;
// 开启debug模式
Vue.config.debug = config.debug;

Vue.http.interceptors.push(function (request, next) {
  this.$Loading.start();

  request.headers.set('Authorization', config.getToken());

  next(function (response) {

    if (response.headers.map.Authorization !== undefined) {
      config.setToken(response.headers.map.Authorization[0]);
    }

    // 全局错误处理
    if (response.status === 401 && response.body.code !== 4010) {
      window.location.href = config.login_url;
    } else if (response.status === 422) {
      this.$Loading.error();
      var errorObj = response.body.data;
      for (var field in errorObj) {
        for (var key in errorObj[field]) {
          this.$Notice.error({title: errorObj[field][key]})
        }
      }
    } else if (response.status !== 200) {
      this.$Loading.error();
      this.$Message.error(response.data.msg);
    } else {
      this.$Loading.finish();
    }
  });
});

// 路由配置
let router = new VueRouter({
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    return {"x": 0, "y": 0};
  }
});
router.beforeEach((to, from, next) => {
  iview.LoadingBar.start();
  next();
});
router.afterEach((to, from, next) => {
  iview.LoadingBar.finish();
});

new Vue({
  el: '#app',  //vue实例的根元素
  router,    //在vue实例中,引入定义的路由
  render: h => h(App)    //渲染App组件
});
