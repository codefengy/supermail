<template>
  <div id='detail'>
    <!-- 导航栏 -->
    <detail-nav-bar @titleClick='titleClick' ref='nav'/>
    <scroll class='content' ref='scroll' :probe-type=3 @scroll='contentScroll'>
      <!-- 除了事件监听,解析时属性不区分大小写 发出事件时,不需要区分大小写-->
      <!-- 展示数据测试 -->
      <!-- <ul>
        <li v-for='(item,index) in $store.state.cartList' v-bind:key="index">
          {{item}}
        </li>
      </ul> -->
      <detail-swiper :top-images='topImages'></detail-swiper>
      <detail-base-info :goods='goods'></detail-base-info>
      <detail-shop-info :shop='shop'/>
      <detail-goods-info :detail-info='detailInfo' @imageLoad='imageLoad'/>
      <detail-param-info ref='parmas' :param-info='paramInfo'/>
      <detail-comment-info ref='comment' :comment-info='commentInfo'/>
      <goods-list :goods="recommends" ref='recommends'></goods-list>
    </scroll>
    <back-top @click.native='backClick' v-show='isShowBackTop'></back-top>
    <detail-buttom-bar @addCart='addToCart'/>
    <!-- 要是直接传字符串，不需要加: -->
    <!-- <toast :message='message' :show='show'/> -->
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailButtomBar from './childComps/DetailButtomBar'

import Scroll from 'components/common/scroll/Scroll'


//直接用封装好的组件
import GoodsList from 'components/content/goods/GoodsList'
// import Toast from 'components/common/toast/Toast'



import {getDetail,Goods,Shop,GoodsParams,getRecommend} from 'network/detail'
import {debuonce} from 'common/utils'
import {itemListenerMixin,backTopMixin} from 'common/mixin'

//Actions 辅助函数，映射关系
import {mapActions} from 'vuex'


export default {
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailButtomBar,

    GoodsList,

    Scroll
    // Toast

  },
  mixins:[itemListenerMixin,backTopMixin],
  data(){
    return {
      id:null,
      topImages:[],
      goods:{},
      shop:{},
      detailInfo:{},
      paramInfo:{},
      //评论模块
      commentInfo:{},
      //保存推荐数据
      recommends:[],
      // homeImgListener:null
      //滚动的Y的值
      themeTopYs:[],
      //做防抖
      getThemeTopYs:null,
      //记录滚动时位置，获取index
      currentIndex:0
      // message:'',
      // show:false
    }
  },
  created(){
    // console.log(this.$route)
    //1.保存传入的id
    this.id=this.$route.params.id
    //2.根据id查找数据
    getDetail(this.id).then(res=>{
      // console.log(res)
    //3.数据分离
        //3.1  获取顶部的图片轮播数据
        this.topImages=['http://m.360buyimg.com/mobilecms/s750x750_jfs/t1/151834/25/9796/403675/5fd4f374Eb9fad594/4297001b640c88c1.jpg!q80.dpg.webp','http://m.360buyimg.com/mobilecms/s843x843_jfs/t1/118469/24/16485/241226/5f4c96b2E4cc8741c/b3f4daffb3f875f6.jpg!q70.dpg.webp','http://m.360buyimg.com/mobilecms/s843x843_jfs/t1/87355/8/19357/155360/5f4c96b2Efc9da9ec/9c9f77451f8c9ee6.jpg!q70.dpg.webp','http://m.360buyimg.com/mobilecms/s843x843_jfs/t1/134697/15/8731/135406/5f4c96b3Ebe5e4e97/5fc90ae42b7a6b57.jpg!q70.dpg.webp','http://m.360buyimg.com/mobilecms/s843x843_jfs/t1/130415/19/8693/129113/5f4c96b2E087314c6/26211ae3d487d28e.jpg!q70.dpg.webp','http://m.360buyimg.com/mobilecms/s843x843_jfs/t1/120344/21/11459/230133/5f4c96b4Ee75c5dfc/9bfa09c187db3b47.jpg!q70.dpg.webp']
        //3.2获取我们的商品信息
        this.goods=new Goods()
        //3.3 创建店铺信息的对象
        this.shop=new Shop()
        //3.4 保存商品的详情数据
        this.detailInfo={desc:'新品上市',detailImage:[{anchor:'model_img',desc:'',key:'穿着效果',list:[
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/146293/29/7157/161921/5f4c9975Ed6effd77/11d3a2b480e12839.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/118239/35/16793/262818/5f4c99c6E9b957c8a/00e8ad839f0a681a.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/114789/36/16542/106013/5f4c9975Ec95ece72/621e205cc5d49f27.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/128517/32/11233/158858/5f4c9975E674febc0/e2fa99eddb5895bf.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/144435/40/7175/276525/5f4c9976Ea5b38888/1cca21530ddc5eef.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/128218/7/11289/182976/5f4c9976E59a25bd0/63ce067e055a64e5.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/115546/37/16606/176927/5f4c9976E9a411b3b/e07e368820060806.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/135694/30/8786/162097/5f4c9977E0580f04a/2720c55aa49e01ff.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/137677/40/7122/169546/5f4c9977E00e00a46/3b21500b82650c9c.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/141807/36/7182/312409/5f4c9977E494abab5/a6f7d399f4302dd3.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/129186/8/11421/104684/5f4c9978E74fb8d4c/5443978175054602.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/127310/1/11378/188575/5f4c9978E8630c3a5/3406b338ad4d8c87.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/140733/37/7179/224302/5f4c9978E9c0ada00/db3bf33448f6bd15.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/117635/33/16912/136177/5f4c9978E4aa51ae5/b60df537f93341f0.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/135496/40/8731/235941/5f4c9979E30130cdf/ed608391159d8101.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/124522/7/11452/223503/5f4c997aE566f47ba/bbacc65f106d7fb3.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/126835/28/11301/253305/5f4c997aEb091b770/f62903d80467a489.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/116405/22/16645/165965/5f4c997aEfd2e9279/81a6576400355cdf.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/124381/39/11283/202866/5f4c997aE685a4a97/d683ec63dcc85815.jpg!q70.dpg.webp',
          'http://img30.360buyimg.com/popWareDetail/jfs/t1/137233/15/8925/177205/5f4c997aE1b536d4b/44a1e09b1cc22642.jpg!q70.dpg.webp'
        ]}]},
        this.paramInfo=new  GoodsParams()
        //3.5取出评论信息
        // 做个判断  是否有信息
        // 假数据写死的
        if(res){
          this.commentInfo={
              user:{avatar:'http://storage.360buyimg.com/i.imageUpload/6a645f3666623763313366633331333731343838303232383935363033_sma.jpg',name:'棒棒糖闯江湖'},
              content:'手表质量很好，做工精致，工艺精良，细节处理的很好，防水性能好，走时精准，外观美观大方，客服服务态度好，耐心解答问题，很满意。',
              created:'1535694719',
              style:'颜色:上衣+裤子 尺码:M',
              images:['http://img30.360buyimg.com/shaidan/s128x96_jfs/t1/142783/3/9532/53857/5f72919fEad944a94/7567a780f83e51c2.jpg!cc_100x100!q70.dpg.webp','http://img30.360buyimg.com/shaidan/s128x96_jfs/t1/111083/29/19096/65655/5f7291a0E4ac5d08c/8983307cfbf07973.jpg!cc_100x100!q70.dpg.webp','http://img30.360buyimg.com/shaidan/s128x96_jfs/t1/152099/22/1113/80816/5f7291a0Eca44fab1/1a77776bf306aa3d.jpg!cc_100x100!q70.dpg.webp']
          }
        }
    }),
    // 3. 请求推荐数据
    getRecommend().then(res=>{
      // console.log('请求推荐数据')
      this.recommends=[{img:'http://img14.360buyimg.com/mobilecms/s270x270_jfs/t1/150391/23/11687/380579/5fdc0547Ed5e64af2/3d4dac92f79ed95b.jpg!q70.dpg.webp'},{img:'http://img14.360buyimg.com/mobilecms/s270x270_jfs/t1/154891/21/10382/264279/5fdbba45Eaa4fff99/3e412ce1cb271e7f.jpg!q70.dpg.webp'},{img:'http://img14.360buyimg.com/mobilecms/s270x270_jfs/t18325/65/199693094/405715/6f845190/5a61d111N0e4f0567.jpg!q70.dpg.webp'},{img:'http://img14.360buyimg.com/mobilecms/s270x270_jfs/t1/145306/32/15357/233157/5fb9eb5eEec1062c3/1a0ee25bcd66c544.jpg!q70.dpg.webp'},{img:'http://img14.360buyimg.com/mobilecms/s270x270_jfs/t1/147240/26/1802/246082/5efbfe75E8e81f7bd/dad511fa9851f79f.jpg!q70.dpg.webp'},{img:'http://img14.360buyimg.com/mobilecms/s270x270_jfs/t1/143293/37/18645/335700/5fdbba4dE0c7af7e1/02bcd50f8c4ec0e9.jpg!q70.dpg.webp'},{img:'http://img14.360buyimg.com/mobilecms/s270x270_jfs/t1/150021/34/18241/548309/5fd5f516E387c882c/61a3cbbab69d2152.jpg!q70.dpg.webp'},{img:'http://img14.360buyimg.com/mobilecms/s270x270_jfs/t1/51806/31/10868/174560/5d7dfc6fE02965d93/c4a5bc481635f8d0.jpg!q70.dpg.webp'},{img:'http://img14.360buyimg.com/mobilecms/s270x270_jfs/t1/148181/32/7160/170489/5f4ca31cE63655fb2/4af1676de5627cbd.jpg!q70.dpg.webp'},{img:'http://img14.360buyimg.com/mobilecms/s270x270_jfs/t1/120632/9/4127/126488/5ed9c291Ecd68f259/92d589ca97daf47a.jpg!q70.dpg.webp'}]
    /*
    //1.第一次获取，值不对
      //值不对的原因：this.$refs.parmas.$el 压根没有渲染 
      this.themeTopYs=[]
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.parmas.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
      console.log(this.themeTopYs)
       

       

       //2.第二次渲染：值不对
       //值不对的原因：图片
       //根据最新的数据，对应的DOM是已经被渲染出来了
       //但是图片依旧是没有加载完的，（目前获取到offsetTop不包含其中的图片）
       //offsetTop值不对的时候都是因为图片的问题
      this.$nextTick(()=>{
      this.themeTopYs=[]
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.parmas.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
      console.log(this.themeTopYs)
    })

      */



  
    })
   // 4.给getThemeTopYs赋值  对this.themeTopYs 赋值的操作进行防抖
   this.getThemeTopYs=debuonce(()=>{
      this.themeTopYs=[]
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.parmas.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
      //hack做法
      this.themeTopYs.push(Number.MAX_VALUE)
      console.log(this.themeTopYs)
   },100)
  },
  mounted(){
    // this.homeImgListener=()=>{
     
    //    refresh()
    // }
    // const refresh=debuonce(this.$refs.scroll.refresh,500)
    // this.$bus.$on('itemImgLoad', this.homeImgListener)

    //获取对应的Y值  拿到数据不正确的，不确定数据是否请求完,还在渲染，拿不到$el
    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.parmas.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
    
  },
  updated(){
    
    // this.themeTopYs=[]
    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.parmas.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
    // console.log(this.themeTopYs)
  },
  destroyed(){
     this.$bus.$off('itemImageLoad',this. homeImgListener)    
  },
  methods:{
    ...mapActions(['addCart']), //可以是对象   也可以是数组
    imageLoad(){
      console.log('图片加载完了')
      this.$refs.scroll.refresh()
  /*
      this.themeTopYs=[]
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.parmas.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
      console.log(this.themeTopYs)
  */
      //操作太频繁了要做防抖
      this.getThemeTopYs()
    },
    titleClick(index){
      // console.log(index)
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],500)
    },
    //监听scroll 
    contentScroll(position){
    
      //获取Y值
      const  positionY=-position.y
      // console.log(positionY)
      //主题中的y值 :[0, 11251, 12138, 12452]
      let length=this.themeTopYs.length
      for(let i=0;i<length-1;i++){

       //普通做法
     /*   if(this.currentIndex!== i  && ((i<length-1 &&positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1] )||(i===length-1 && positionY >= this.themeTopYs[i] ))){
         this.currentIndex=i
        //  console.log( this.currentIndex)
         this.$refs.nav.currentIndex=this.currentIndex
        }

      */

     //hack做法
        // Number.MAX_VALUE 加一个最大的值  同时遍历的时候要减去1  要不然 越界了
        if( this.currentIndex !== i && (positionY>=this.themeTopYs[i] && positionY< this.themeTopYs[i+1])){
             this.currentIndex=i
        //  console.log( this.currentIndex)
         this.$refs.nav.currentIndex=this.currentIndex
        }
      }

      //是否显示回到顶部
      this.isShowBackTop=-position.y >1000
    },
    addToCart(){
      console.log('发出了添加购物车事件了');
      //1.获取购物车展示商品信息
      const product={}
      product.id=this.$route.params.id;
      product.image=this.topImages[0];
      product.title=this.goods.title;
      product.desc=this.goods.desc;
      product.price=this.goods.realPrice;
      product.lid=this.id;
      console.log(product)
      
      //2.将数据添加到购物车中
          // this.$Store.cartList.push(product)  //不要用这种方法
          // mutations 
      // this.$store.commit('addCart',product)
      this.addCart(product).then(res=>{
        this.$Toast.show(res,1500)
        //  console.log(res)
        //  this.show=true
        //  this.message=res
        //  setTimeout(()=>{
        //   this.show=false
        //   this.message=''
        //  },1500)
      })
      //  上面是用了辅助函数
      // this.$store.dispatch('addCart',product).then(res=>{
      //   console.log(res)
      // })
    }
    
  }
}
</script>

<style scoped>
  #detail{
    position: relative;
    z-index:101;
    background-color: #ffffff;
    height: 100vh;
  }
  .content{
    /* 用better-scroll必须给定高度 */
    /* 1.父亲要 height: 100vh;   height: calc(100% - 44px);  */
    /* 2.定位 */
    height: calc(100% - 44px - 58px);
    overflow: hidden;
  }
</style>