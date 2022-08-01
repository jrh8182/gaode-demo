import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/views/index';

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'首页',
    component:Index,
    // component: () => import(/* webpackChunkName: "about" */ '../components/MapContainer')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
