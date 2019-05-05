<template>
    <!--全部菜品页-->
    <view class="dishes-content">
        <!--头部搜索-->
        <view class="top">
            <!--打电话-->
            <view class="top-left top-con">
                <uni-icon @click="phone" type="phone-filled" size="28"></uni-icon>
            </view>
            <!--搜索框-->
            <view class="top-search top-con">
                <uni-icon type="search" size="22" class="top-search-icon"></uni-icon>
                <input class="uni-input" @focus="searchFocus" @input="search" confirm-type="search" placeholder="搜索菜品名称"/>
                <scroll-view scroll-with-animation scroll-y class="ti-shi" v-if="inputTipsShow">
                    <view v-for="(item,index) in tips" :key="index">
                        <view class="search-tips" v-for="(val,index2) in item.foods" :key="index2" @click="tipsClick(item,val)">
                            {{val.name}}<uni-badge class="search-tips-name" :text="item.name"></uni-badge>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <!--福利红包-->
            <view class="top-right top-con">
                <min-badge :dot="dot">
                    <img src="../../static/dishes/hongbao2.png" alt="">
                </min-badge>
            </view>
        </view>
        <!--轮播-->
        <view class="dishes-main">
            <view class="dishes-swiper">
                <uni-swiper-dot :height="3" :info="info" :current="current" field="content">
                    <swiper class="swiper-box" @change="change">
                        <swiper-item v-for="(item ,index) in info" :key="index">
                            <img :src="item.content" alt="活动轮播图">
                        </swiper-item>
                    </swiper>
                </uni-swiper-dot>
            </view>
        </view>
        <!--大分类-->
        <!--<view class="big-sort">
            <view class="big-sort-arrow" @click="arrowClick">
                <uni-icon :type="arrowdown" size="24"></uni-icon>
            </view>
            <view class="bid-sort-con" v-show="arrowdown!='arrowdown'">
                <view class="bid-item" @click="bigItem(index)" v-for="(item,index) in bigSort" :key="index" :class="index==bigActive?'active2':''">
                    {{item}}
                </view>
            </view>
            <scroll-view scroll-x class="big-sort-con">
                <view :style="'width:'+(bigSort.length*100)+'px'">
                    <view class="bid-item" @click="bigItem(index)" v-for="(item,index) in bigSort" :key="index" :class="index==bigActive?'active2':''">
                        {{item}}
                    </view>
                </view>
            </scroll-view>
        </view>-->
        <!--分类导航-->
        <view class="dishes-body">
            <view class="page-body" :style="'height:'+height+'px'">
                <!--左侧导航-->
                <scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'" :scroll-top="scrollLeftTop"
                             scroll-with-animation>
                    <view class="nav-left-item" @click="categoryClickMain(index)" :key="index"
                          :class="index==categoryActive?'active':''"
                          v-for="(item,index) in classifyData">
                        {{item.name}}
                    </view>
                </scroll-view>
                <!--右侧商品-->
                <scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll"
                             :style="'height:'+height+'px'" scroll-with-animation>
                    <view v-for="(foods,index) in classifyData" :key="index" class="box">
                        <view :id="i==0?'first':''" class="nav-right-item" v-for="(item,i) in foods.foods" :key="i"
                              @click="cart(item.name)">
                            <image :src="item.icon" :lazy-load="true" @load="loaded(item)" @error="imageError(item)"/>
                            <view class="name-price">
                                <view class="name-price-item item-name">{{item.name}}</view><!--名字-->
                                <view class="name-price-item item-tradePrice">{{item.tradePrice}}</view><!--批发价-->
                                <view class="name-price-item item-price"><!--现价--原价-->
                                    <view class="price new-price">{{item.price}}</view>
                                    <view class="price old-price">{{item.oldPrice}}</view>
                                </view>

                                <view class="name-price-item item-sort" v-if="item.sort">
                                    {{item.sort}}
                                </view><!--分类:降价....-->
                            </view>
                            <uni-icon class="add-goods" :type="item.addGoods" size="30"
                                      @click="addGoods(item)"></uni-icon>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
    import classifyData from '../../common/classify.data.js';
    import classifyData2 from '../../common/classify.data2.js';
    import {uniIcon, uniSwiperDot, uniBadge,uniCollapse,uniCollapseItem} from '@dcloudio/uni-ui'
    import minBadge from '../../components/min-badge'
    import Fuse from 'fuse.js';
    import { mapGetters, mapActions } from 'vuex'

    export default {
        components: {
            uniIcon,
            uniSwiperDot,
            minBadge,
            uniBadge,
            uniCollapse,
            uniCollapseItem
        },
        computed: {
            ...mapGetters([
                'classifyData'
            ])
        },
        name: "index",
        data() {
            return {
                arrowdown:'arrowdown',
                bigActive:0,//大分类样式绑定
                bigSort:['新鲜蔬菜','时令水果','肉禽类','方便速食','加工调理','开封菜类','川菜火锅','羊肉泡馍'],//大的菜品分类
                inputTipsShow:false,//显示搜索提示
                inputValue: '',//输入框内容
                dot: true,//显示圆点或者是数字
                info: [{//轮播详情
                    content: '../../static/dishes/swiper.png'
                }, {
                    content: '../../static/dishes/swiper.png'
                }, {
                    content: '../../static/dishes/swiper.png'
                }],
                current: 0,
                name: "wkiwi",
                height: 0,
                categoryActive: 0,
                scrollTop: 0,
                scrollLeftTop: 0,
                // scrollHeight: 0,
                //classifyData: classifyData,//数据
                arr: [0, 584, 1168, 1752, 2336, 2805, 3274, 3858, 4442, 4911, 5380, 5734, 6203, 6672, 7017],//初始值，后边计算会根据手机适配覆盖
                leftItemHeight: 51,//左侧单个导航高度，会计算出新值进行覆盖
                rightItemHeight: 120,//右侧单个物品高度，会计算出新值进行覆盖
                navLeftHeight: 0,//左边scroll-view 内层nav的总高度
                diff: 0,//左边scroll-view 内层nav的总高度与视口之差
                tabBarHeight: 0,//如果此页面为Tab页面，自己改变高度值,,一般tab高度为51
                car: [],//添加的购物车内容
                foodsArray:[],
                tips:[],//搜索提示
            }
        },
        methods: {
            ...mapActions([
                'setCar',
                'setClassifyData'
            ]),
            //打电话
            phone(){
                uni.makePhoneCall({
                    phoneNumber: '114' //仅为示例
                });
            },
            //搜索提示点击事件
            tipsClick(item,val){
                //搜索提示点击事件;item:大的分类，val：当前大的分类里面的当前具体的哪个。
                //获取两个索引，一个是当前点击所属于的左侧导航栏的索引i，一个是当前归类的当前点击索引j
                //先循环找出大的分类的索引，
                for (let i = 0; i < this.classifyData.length; i++) {
                    if (item.name == this.classifyData[i].name){
                        //样式调整并滚动到当前分类
                        this.categoryActive = i;
                        //this.scrollTop = this.arr[i];
                        //然后找出当前归类的索引
                        for (let j = 0; j < this.classifyData[i].foods.length; j++){
                            if (this.classifyData[i].foods[j] == val) {
                                this.scrollTop = this.arr[i] + j * this.rightItemHeight;
                                this.inputTipsShow=false;
                            }
                        }
                    }
                }
            },
            //大的分类点击事件
            bigItem(index){
                this.bigActive=index;
                uni.showToast({
                    title: '随机数据：' + this.bigSort[index]+'(只有两种数据)',
                    icon:'none'
                });
                if (Math.random()>0.5){
                    this.setClassifyData(classifyData2);
                } else {
                    this.setClassifyData(classifyData);
                }

            },
            //大分类下拉箭头点击事件
            arrowClick(){
                if (this.arrowdown=='arrowdown'){
                    this.arrowdown='arrowup'
                }else {
                    this.arrowdown='arrowdown'
                }
            },
            //图片加载完成
            loaded(item){//图片加载完成
                //懒加载打印测试
                //console.log(item.icon)
            },
            //图片错误
            imageError(item){//图片错误
                console.log(item.icon);
                item.icon='https://czy-1257069199.cos.ap-beijing.myqcloud.com/my-website/imgs/ganlan.png'
            },
            //删除数组中的一个对象_arr:数组,
            removeAaary(_arr, _obj) {
                var length = _arr.length;
                for (let i = 0; i < length; i++) {
                    if (_arr[i] == _obj) {
                        if (i == 0) {
                            _arr.shift(); //删除并返回数组的第一个元素
                            return _arr;
                        }
                        else if (i == length - 1) {
                            _arr.pop();  //删除并返回数组的最后一个元素
                            return _arr;
                        }
                        else {
                            _arr.splice(i, 1); //删除下标为i的元素
                            return _arr;
                        }
                    }
                }
            },
            //输入框聚焦时
            searchFocus(event){
                //console.log(event)
                this.inputTipsShow=true;
            },
            //实时获取当前输入的内容
            search(event,name2) {
                this.inputValue = event.target.value || name2;
                //console.log(this.inputValue)
                //搜索的所有信息数据
                let books = this.classifyData;
                let result=[];//结果信息
                let tiShi=[];//搜索提示
                function searchFoodsArray(){
                    return new Promise((resolve, reject) => {
                        //需要搜索哪个？，分配的权重？
                        let options = {
                            keys: [{
                                name: 'foods.name',
                                weight: 0.8
                            }]
                        };
                        //创建新的fuse
                        let fuse =new Fuse(books, options);
                        //先搜索得到大的分类
                        result = fuse.search(event.target.value);
                        resolve(result)
                    })
                }
                function searchDetail(){
                    return new Promise((resolve, reject) => {
                        //console.log(result);
                        for (let i = 0; i < result.length; i++) {
                            tiShi[i]={};
                            tiShi[i].name = result[i].name;
                            let books = result[i].foods;
                            let options = {
                                keys: [{
                                    name: 'name',
                                    weight: 0.8
                                }]
                            };
                            let fuse = new Fuse(books, options);
                            tiShi[i].foods=fuse.search(event.target.value);
                            resolve()
                        }
                    })
                }
                searchFoodsArray().then(searchDetail()).then( () =>{
                    console.log(tiShi);
                    this.tips=tiShi;
                    this.inputTipsShow=true;
                });
            },
            //轮播
            change(e) {
                this.current = e.detail.current;
            },
            scroll(e) {
                let _this = this
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                }
                this.timeoutId = setTimeout(function () { //节流
                    _this.scrollHeight = e.detail.scrollTop + _this.height / 2;
                    for (let i = 0; i < _this.arr.length; i++) {
                        let height1 = _this.arr[i];
                        let height2 = _this.arr[i + 1];
                        if (!height2 || (_this.scrollHeight >= height1 && _this.scrollHeight < height2)) {
                            _this.categoryActive = i;
                            (_this.diff > 0) && (_this.scrollLeftTop = Math.round((_this.categoryActive * _this.diff) / (classifyData.length - 1)));
                            return false;
                        }
                    }
                    _this.categoryActive = 0;
                    _this.timeoutId = undefined;
                }, 10)
            },
            //滚动到点击点的导航对应位置
            categoryClickMain(index) {
                this.categoryActive = index;
                //console.log(index);
                this.scrollTop = this.arr[index]
            },
            cart(text) {
                /*uni.showToast({
                    title: text,
                    icon: "none",
                })*/
            },
            //添加商品
            addGoods(item) {
                if (item.addGoods == "plus-filled") {//如果当前是没有添加状态就添加到购物车
                    item.addGoods = "checkbox-filled";
                    item.number=1;
                    this.car.push(item)
                } else if (item.addGoods == "checkbox-filled") {
                    item.addGoods = "plus-filled";
                    this.car=this.removeAaary(this.car,item);
                }
                console.log(this.car)
                this.setCar(this.car)
            }
        },
        //下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
        onPullDownRefresh() {
            setTimeout(function () {
                uni.stopPullDownRefresh();
            }, 1000);
            uni.showToast({
                title:'下拉刷新并重新获取数据',
                icon:'none'
            });
        },
        onLoad: function () {
            this.height = uni.getSystemInfoSync().windowHeight - this.tabBarHeight - 130 - 60;
            this.setClassifyData(classifyData);
        },
        onReady() {
            //一些高度的调整
            let _this = this;
            let selectorQuery = uni.createSelectorQuery();
            selectorQuery.selectAll('.nav-left-item').boundingClientRect(function (rects) {
                _this.leftItemHeight = rects[0].height;//51
                _this.navLeftHeight = _this.leftItemHeight * classifyData.length;
                _this.diff = _this.navLeftHeight - _this.height;
            });
            selectorQuery.selectAll('.box').boundingClientRect(function (rects) {
                //console.log(rects[0].height)
                let arr = [0];
                let top = 0;
                rects.forEach(function (rect) {
// 					rect.id      // 节点的ID
// 					rect.dataset // 节点的dataset
// 					rect.left    // 节点的左边界坐标
// 					rect.right   // 节点的右边界坐标
// 					rect.top     // 节点的上边界坐标
// 					rect.bottom  // 节点的下边界坐标
// 					rect.width   // 节点的宽度
// 					rect.height  // 节点的高度
                    top += rect.height;
                    arr.push(top)
                })
                //console.log(arr)
                _this.arr = arr
            }).exec();
            //rightItemHeight
            selectorQuery.selectAll('.nav-right-item').boundingClientRect(function (rects) {
                _this.rightItemHeight = rects[0].height;//120.5
                console.log(rects[0].height)
            }).exec();
        },

    }
</script>

<style scoped>
    uni-swiper{
        height: 130px !important;
    }

    page {
        height: 100%;
        overflow: hidden;
    }

    /*头部搜索*/
    .top {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 120upx;
        z-index: 10;
        background-color: #ffffff;
    }

    .top-con {
        height: 80upx;
        float: left;
        margin-top: 20upx;
    }

    .top-left {
        width: 15%;
        text-align: center;
        line-height: 80upx;
    }

    .top-search {
        width: 70%;
        background-color: #efefef;
        border-radius: 10upx;
        font-size: 32upx;
        line-height: 80upx;
        position: relative;
    }

    .ti-shi{
        position: absolute;
        top: 80upx;
        left: 0;
        width: 100%;
        z-index: 11;
        border-radius: 10upx;
        max-height: 400upx;
        overflow-y: scroll;
    }

    .search-tips{
        height: 80upx;
        font-size: 32upx;
        font-weight: normal;
        font-family: "Microsoft YaHei";
        padding-left: 1.5em;
        line-height: 80upx;
        background-color: #fff;
        border-bottom: 1px solid #666;
    }
    .search-tips-name{
        margin-left: 32upx;
    }
    .top-right {
        width: 15%;
        line-height: 80upx;
        text-align: center;
    }

    .top-right img {
        height: 48upx;
        width: 48upx;
    }

    .uni-input {
        margin-top: 14upx;
    }

    .top-search-icon {
        font-weight: bold;
        margin-top: 18upx;
        margin-left: 8upx;
        float: left;
    }

    .dishes-main {
        margin-top: 120upx;
        height: calc(100% - 120upx);
    }

    .dishes-swiper img {
        height: 100%;
        width: 100%;
    }

    .page-body {
        display: flex;
        background: #fff;
        overflow: hidden;
    }

    .big-sort{
        height: 80upx;
        line-height: 80upx;
        border-bottom: 1px solid #e9e9e9;
        position: relative;
    }
    .big-sort-arrow{
        position: absolute;
        top: 0upx;
        right: 0upx;
        height: 80upx;
        width: 92upx;
        background-color: white;
        text-align: center;
        z-index:12;
    }
    .bid-sort-con{
        position: absolute;
        top: 80upx;
        right: 10upx;
        width: 100%;
        background-color: white;
        z-index:12;
        border-top: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
    }
    .big-sort-arrow>.uni-icon{
        color: #18a851 !important;
    }
    .big-sort-con{
        height: 80upx;
        width: auto;
    }

    .bid-item{
        color: #808080;
        font-size: 28upx;
        display: inline-block;
        margin-left: 40upx;
        padding: 4upx 16upx;
        border-radius: 20upx;
        line-height: 1.5;
        background-color: lavenderblush;
    }
    .active2{
        background-color: #0fb053;
        color: white;
    }

    .nav {
        display: flex;
        width: 100%;
    }

    .nav-left {
        width: 25%;
        background: #fff;
        color: #bbbbbb;
    }

    .nav-left-item {
        height: 100upx;
        border-right: solid 1px #f1f1f1;
        border-bottom: solid 1px #f1f1f1;
        font-size: 30upx;
        display: flex;
        align-items: center;
        justify-content: left;
        text-indent: 1em;
    }

    .nav-left-item:last-child {
        border-bottom: none;
    }

    .nav-right {
        width: 75%;
    }

    .box {
        display: block;
        overflow: hidden;
        border-bottom: 20upx solid #f3f3f3;
    }

    .box:last-child {
        border: none;
    }

    .nav-right-item {
        width: 100%;
        height: 220upx;
        float: left;
        text-align: center;
        padding: 11upx;
        font-size: 28upx;
        background: #fff;
        border-bottom: 1upx solid #f6f6f6;
        clear: both;
        line-height: 220upx;
        position: relative;
    }

    .nav-right-item image {
        width: 150upx;
        height: 150upx;
        float: left;
        margin-top: 35upx;
    }

    .name-price {
        float: left;
        width: calc(100% - 200upx);
        margin-left: 20upx;
        height: 160upx;
        margin-top: 30upx;
        text-align: left;
        line-height: 1.5;
    }

    .active {
        color: #2d2d2d;
        background: #fff;
        border-right: 0;
        font-weight: bold;
    }

    ::-webkit-scrollbar { /*取消小程序的默认导航条样式*/
        width: 0;
        height: 0;
        color: transparent;
    }

    .name-price-item {
        padding-top: 4upx 0;
    }

    .item-tradePrice {
        color: #a4a4a4;
        font-size: 20upx;
    }

    .item-price {
        color: #fa7212;
        font-weight: 500;
    }

    .price {
        display: inline-block;
    }

    .price.old-price {
        color: #a4a4a4;
        font-size: 20upx;
        text-decoration: line-through;
    }

    .item-sort {
        font-size: 20upx;
        color: #fa7212;
        padding: 0upx 4upx;
        border: 1px solid #fa7212;
        display: inline-block;
        border-radius: 4upx;
    }

    .add-goods {
        position: absolute;
        top: 95upx;
        right: 30upx;
        color: #0fb053 !important;
    }
</style>
