import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Home = ()=>import('views/home/Home')
const Cart = ()=>import('views/cart/Cart')
const Profile = ()=>import('views/profile/Profile')
const Category = ()=>import('views/category/Category')
//2.创建路由对象
const routes=[
  {
    path:'',
    redirect:'/home'
  },
  {
    path:'/home',
    component:Home
  },
  {
    path:'/cart',
    component:Cart
  },
  {
    path:'/profile',
    component:Profile
  },
  {
    path:'/category',
    component:Category
  }
]
const router=new Router({
  routes,
  mode:'history'
})

export default router