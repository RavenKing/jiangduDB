namespace sap.jiangdu;

using {
    Currency,
    managed,
    sap
} from '@sap/cds/common';

entity users  {
    key user_id              : UUID; // 用户编码
        password              : String(100);
        token               :String(100);
        log_date            :Timestamp;
        validateDate        :Timestamp;
        phone                : String(100); //手机
        level                : String(100); //用户等级
        area                 : String(100); // 行政区
        user_name            : String(100); //用户名
        company_name         : String(100); // 单位名称
        company_code         : String(100); //信用代码
        company_address      : String(500); //地址
        legal_representative : String(100); //法定代表人
        registered_capital   : String(100); // 注册资本
        contact_person       : String(100); //联系人
        contact_phone        : String(100); //联系手机
        term_of_operation    : String(100); //经营期限
        company_type         : String(100); //企业类型
        register_status      : String(100); //登记状态
        hezhun_time          : Timestamp; // 核准日期
        register_number      : String(100); //注册号
        register_currency    : String(100); //注册货币
        business_scope       : String; //经营范围
        certificate_url      : String(1000); //营业执照
        created_at           : Timestamp;
        updated_at           : Timestamp;
        country_code         : String(10);
        dengji_jiguan        : String(100); //登记机关
        industry              : String(100);
        cap                  : String(100);
}

entity tag_users{
    tag_id: UUID;
    company_code:UUID;
}

entity jinronghuiqis {
    key fin_id               : UUID; // primary key
        logo_url             : String(1000); //logo URL
        name                 : String(100); //产品名称
        description          : String(500); //介绍
        url                  : String(1000); //产品链接
        apply_url            : String(1000); // 申请链接
        danbao_method        : String(100); // 担保方式
        haikuanfangshi       : String(100); //还款方式
        rate                 : String(100); // 年利率
        fin_code             : String(100); //产品代码 
        bank_name            : String(100); //银行名称
        bank_id              : String(100); //银行代码
        target               : String(100); //适用对象
        loan_method          : String(100); // 贷款方式
        loan_date            : String(100); //贷款期限
        status               : String(100); // 状态
        fin_start_date       : Timestamp; //产品开始时间
        fin_end_date         : Timestamp; // 产品结束时间
        created_at           : Timestamp; //创建时间
        update_at            : Timestamp; //更新时间
        user_id              : Association to one users{user_id} ; //操作人id
        user_name            : String(100); //操作人
        rongqian_type        : String(100); //融资类型
        workflow_url         : String(100); // 流程截图
}


entity  company_portraits {
    key company_code         : Association to one users{company_code}; 
        overall_ranking      : Double; //综合评分
        basic_ability        : Double; //基础能力
        jingying_management  : Double; //经营管理
        tech_inno            : Double; // 创新科技
        iot                  : Double; // 智能制造
        continous_develop    : Double; //可持续发展
        credit_risk          : Double; //信用风险
        created_at           : Timestamp; //创建时间
        updated_at           : Timestamp;  //更新时间

}

entity  jinrong_items {
    key fin_id               : Association to jinronghuiqis{fin_id};
    key fin_special_key      : Integer;
        description          : String(500); 
        fin_special_value    : String(100); 
        type                 : String(100);
}

entity  tech_innos {
    key tech_id              : UUID;    // primary key
        tech_code            : String(100);  //科技代码
        name                 : String(100);  //产品名称
        description          : String(500);  //介绍
        type                 : String(100);  //类型
        area                 : String(100);  // 所属领域
        company_code         : Association to one users{company_code};  // 信用代码
        company_name         : String(100);  //公司名称
        status               : String(100);  // 状态
        industry             : String(100);  //行业 
        new_industry         : String(100);  //新兴行业分类
        target_price         : String(100);  //意向金额
        quanshu_area         : String(100);  //权属地域
        ipc_category         : String(100);  // IPC 分类
        patent_category      : String(100);  //专利类别
        PCT                  : Boolean; //是否PCT
        hezuo_type           : String(100);  // 合作方式
        created_at           : Timestamp; //创建时间
        update_at            : Timestamp; //更新时间
        patent_description   : String(500);  //专利摘要
        user_name            : String(100);  //联系人
        phone                : String(30);  //联系方式
        email                : String(100);  //联系方式
        department           : String(100);  //部门
}

entity  talents  {
    key talent_id            : UUID;   // primary key
        talent_name          : String(100); //人民
        position             : String(100); //职位
        degree               : String(100); //学历
        type                 : String(100); //类型
        university           : String(100); // 毕业学员
        career_year          : String(100); // 工作年限
        company_name         : String(100); //公司名称
        salary               : String(100); // 期望薪资
        area                 : String(100); //期望地区 
        resume_url           : String(1000); //简历地址
        created_at           : Timestamp; //创建时间
        update_at            : Timestamp; //更新时间
}

entity  assets  {
    key asset_id             : UUID;    // primary key
        asset_name           : String(100);  // 设备名称
        asset_country        : String(100);  //产地国别
        service_area         : String(100);  //服务领域
        maker                : String(100);  //生产制造商
        asset_count          : Integer; //  设备数量
        start_date           : Timestamp; // 启用时间
        user_id              : Association to one users{user_id};
        user_name            : String(100);  //发布人 
        status               : String(100);  //状态 上架/下架
        area                 : String(100);  //所在地区
}

entity  tags  {
    key tag_id              : UUID;   // primary key
        tag_name            : String(100); // 标签名称
        tag_value           : String(100); //标签值
        type                : String(2); //类型
        description         : String(100); //备注
        created_at          : Timestamp; //创建时间
        update_at           : Timestamp; // 更新时间
        user_id             : Association to one users{user_id};
        user_name           : String(100); //操作人 
        tag_category        : String(100);//分类
}

entity  tag_fins  {
        tag_id              : Association to one tags{tag_id};
        fin_id              : Association to one jinronghuiqis{fin_id}; 
}

entity  tag_talents  {
        tag_id              : Association to one tags{tag_id};
        talent_id           : Association to one talents{talent_id};  
}

entity  tag_assets  {
        tag_id              : Association to one tags{tag_id};
        asset_id            : Association to one assets{asset_id};  
}

entity policys {
    key policy_id            : UUID;
        policy_title         : String(200);
        created_at           : Timestamp;
        updated_at           : Timestamp;
        policy_url           : String(1000);
        user                 : Association to one users{user_id};
        user_name            : String(100);
        cdata                 : LargeString; 
}


entity  tag_policys  {
        tag_id              : Association to one tags{tag_id};
        policy_id           : Association to one policys{policy_id};  
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
