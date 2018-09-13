package com.sumixer.ys.manager.config;

public class AppConst {
    //用户登录无操作后session失效时间
    public static final int SESSION_ACTIVE = 9*60*60;

    /**
     * 库存最大位数
     */
    public static final int DIGIT = 14;

    //后台用户账号的默认密码
    public static final String DEFAULT_ADMIN_PWD = "123";
    //商品状态
    public static final int PUBLISHED = 1;
    public static final int UNPUBLISHED = 2;
    public static final int DELETED = 3;

    //门店状态
    public static final int STORE_NORMAL = 1;
    public static final int STORE_FREEZED = 2;
    public static final int STORE_DELETE = 3;
    public static final int STORE_HOLIDAY = 4 ;

    //代理商状态
    public static final int AGENT_NORMAL = 1;
    public static final int AGENT_FREEZED = 2;
    public static final int AGENT_DELETE = 3;

    public static String ROOTCATEGORY = "00000001";


    //状态码
    public static final int SUCCESS = 200;
    public static final int ERROR = 400;

    //后台用户类型
    public static final class AdminType {
        public static final int BRAND_ADMIN = 1;
        public static final int AGENT_ADMIN = 2;
        public static final int STORE_ADMIN = 3;
    }

    //用户状态
    public static final class AdminStatus {
        public static final int ADMIN_NORMAL = 1;
    }


    /**
     * 发货状态就是1未确认 2未发货 3已确认
     支付状态1已支付 2未支付 3取消支付 4到货付款 5申请退款 6已退款 7拒绝退款

     */


    public static final class SendType{
        public static final int UNSURE = 1;
        public static final int NON_SEND = 2;
        public static final int FINISH_SEND = 3;

        public static final String getPaywayStr(int sendType) {
            switch (sendType) {
                case UNSURE:
                    return "未确认";
                case NON_SEND:
                    return "未发货";
                case FINISH_SEND:
                    return "已确认";
                default:
                    throw new IllegalArgumentException("pay type with sendType="+sendType+" is not exist");
            }
        }

    }

    /*
    发货方式：
    1、在线支付
    2、货到付款
    3、钱包支付
    */
    public static final class PayType {
        public static final int ONLINE_PAY = 1;
        public static final int PAY_WHEN_ARRIVE = 2;
        public static final int WALLET_PAY = 3;

        /**
         * 根据支付类型获取支付类型的说明字符串
         * @param payType
         * @return
         */
        public static final String getPaywayStr(int payType) {
            switch (payType) {
                case ONLINE_PAY:
                    return "在线支付";
                case PAY_WHEN_ARRIVE:
                    return "货到付款";
                case WALLET_PAY:
                    return "钱包支付";
                default:
                    throw new IllegalArgumentException("pay type with payType="+payType+" is not exist");
            }
        }
    }

    /*订单状态：
    1、已支付
    2、未支付
    3、取消支付
    4、货到付款
    5、申请退款
    6、已退款
    7、拒绝退款*/
    public static final class OrderStatus {
        public static final int FINISH_PAY = 1;
        public static final int NON_PAYMENT = 2;
        public static final int CANCEL_PAY = 3;
        public static final int PAY_WHEN_ARRIVE = 4;
        public static final int APPLY_DRAWBACK = 5;
        public static final int FINISH_DRAWBACK = 6;
        public static final int REFUSE_DRAWBACK = 7;

        /**
         * 根据支付类型获取支付类型的说明字符串
         * @param payStatus
         * @return
         */
        public static final String getPaywayStr(int payStatus) {
            switch (payStatus) {
                case FINISH_PAY:
                    return "已支付";
                case NON_PAYMENT:
                    return "未支付";
                case CANCEL_PAY:
                    return "取消支付";
                case PAY_WHEN_ARRIVE:
                    return "货到付款";
                case APPLY_DRAWBACK:
                    return "申请退款";
                case FINISH_DRAWBACK:
                    return "已退款";
                case REFUSE_DRAWBACK:
                    return "拒绝退款";
                default:
                    throw new IllegalArgumentException("pay type with payStatus="+payStatus+" is not exist");
            }
        }
    }

    public static final class QiNiuCloud {
        //public static final String BASE_BASE = "http://pa5o8t6ay.bkt.clouddn.com/";
        public static final String BASE_BASE = "http://pcbva8fqa.bkt.clouddn.com/";
        public static final String ACCESS_KEY = "cNBVaFgErju4VIdixhlenVENAVMR3HHUTQvkFI0H";
        public static final String SECRET_KEY = "fpuufJJ23tMgitKCz2yoN_k1hbOfiqcsZQ-eWhY3";
        public static final String BUCKET_NAME = "web-static";
    }



    //暂定只有高级，后期需根据需求修改
    public static final class MemberLevel{
        public static final int HIGHN = 1;

        /**
         * 根据会员级别获取会员级别的说明字符串
         * @param levelType
         * @return
         */
        public static final String getMemberLevelType(int levelType) {
            switch (levelType) {
                case HIGHN:
                    return "高级";
                default:
                    throw new IllegalArgumentException("level type with levelType="+levelType+" is not exist");
            }
        }

    }


    //会员状态说明
    public static final class MemberStatus{
        public static final int NORMAL = 1;
        public static final int FROZEN = 2;

        public static final String getMemberStatusType(int statusType) {
            switch (statusType) {
                case NORMAL:
                    return "正常";
                case FROZEN:
                    return "冻结";
                default:
                    throw new IllegalArgumentException("status type with statusType="+statusType+" is not exist");
            }
        }

    }
}
