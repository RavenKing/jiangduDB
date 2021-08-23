namespace sap.jiangdu;

using {
    Currency,
    managed,
    sap
} from '@sap/cds/common';

entity users : managed {
    key user_id              : String; // 用户编码
        phone                : String; //手机
        level                : String; //用户等级
        area                 : String; // 行政区
        user_name            : String; //用户名
        company_name         : String; // 单位名称
        company_code         : String; //信用代码
        company_address      : String; //地址
        legal_representative : String; //法定代表人
        registered_capital   : String; // 注册资本
        contact_person       : String; //联系人
        contact_phone        : String; //联系手机
        term_of_operation    : String; //经营期限
        company_type         : String; //企业类型
        register_status      : String; //登记状态
        hezhun_time          : String; // 核准日期
        register_number      : String; //注册号
        register_currency    : String; //注册货币
        business_scope       : String; //经营范围
        certificate_url      : String; //营业执照
        created_at           : Timestamp;
        updated_at           : Timestamp;
        country_code         : String;
        dengji_jiguan        : String; //登记机关
}

entity policys {
    key policy_id:String(10);
    policy_title:String(200);
    created_at:Timestamp;
    updated_at:Timestamp;
    policy_url:String;
    user:Association to users;
}

// entity Authors : managed
// {
//     key ID : Integer;
//     name : String(111);
//     books : Association to many Books on books.author = $self;
// }

// /**
//  * Hierarchically organized Code List for Genres
//  */
// entity Genres : sap.common.CodeList
// {
//     key ID : Integer;
//     parent : Association to one Genres;
//     children : Composition of many Genres on children.parent = $self;
// }

// entity Feedbacks : managed
// {
//     key feedbackID : UUID ;
//     source : localized String(111);
//     target : localized String(111);
//     userID : String(10);
//     comment : String(300);
//     realtedOrNot : Boolean;
//     similarity : Decimal(9,2);
// }
