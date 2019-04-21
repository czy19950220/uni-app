import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

const state = {
  car:[],//购物车内容
};
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
