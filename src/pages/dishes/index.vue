<template>
    <!--全部菜品页-->
    <view class="dishes-content">
        <!--头部搜索-->
        <view class="top">
            <!--打电话-->
            <view class="top-left top-con">
                <uni-icon type="phone-filled" size="28"></uni-icon>
            </view>
            <!--搜索框-->
            <view class="top-search top-con">
                <uni-icon type="search" size="22" class="top-search-icon"></uni-icon>
                <input class="uni-input" @input="onKeyInput" confirm-type="search" placeholder="搜索菜品名称"/>
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
                <uni-swiper-dot :info="info" :current="current" field="content">
                    <swiper class="swiper-box" @change="change">
                        <swiper-item v-for="(item ,index) in info" :key="index">
                            <img :src="item.content" alt="活动轮播图">
                        </swiper-item>
                    </swiper>
                </uni-swiper-dot>
            </view>
        </view>
    </view>
</template>

<script>
    import {uniIcon,uniSwiperDot} from '@dcloudio/uni-ui'
    import minBadge from '../../components/min-badge'
    export default {
        components: {
            uniIcon,
            uniSwiperDot,
            minBadge
        },
        name: "index",
        data() {
            return {
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
            }
        },
        methods: {
            onKeyInput(event) {//实时获取当前输入的内容
                this.inputValue = event.target.value
                console.log(this.inputValue)
            },
            change(e) {//轮播
                this.current = e.detail.current;
            }
        }
    }
</script>

<style scoped>
    page{
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
    }

    .top-right {
        width: 15%;
        line-height: 80upx;
        text-align: center;
    }

    .top-right img{
        height: 48upx;
        width: 48upx;
    }

    .uni-input{
        margin-top: 14upx;
    }

    .top-search-icon{
        font-weight: bold;
        margin-top: 18upx;
        margin-left: 8upx;
        float: left;
    }

    .dishes-main{
        margin-top: 120upx;
        height: calc(100% - 120upx);
    }

    .dishes-swiper img{
        height: 100%;
        width: 100%;
    }
</style>
