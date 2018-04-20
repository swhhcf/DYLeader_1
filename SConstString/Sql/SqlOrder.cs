namespace Btc.NewCommon
{
    /// <summary>
    /// 订单用
    /// </summary>
    public partial class SqlOrder
    {
        #region 新建订单时更新相关表信息

        /// <summary>
        /// 更新订单中每个检测位点的sn
        /// </summary>
        public static string UpdateSn =>
            "update sellorder set id=1000000000000+sn where orderNo='{0}'";

        /// <summary>
        /// 更新订单位点表的患者和医生信息，format(orderNo)
        /// </summary>
        public static string UpdatePatientDoctorInfo =>
            " update s" +
                " set s.illnessDiagnose=p.illnessDiagnose," +
                " s.medHistory=p.medHistory," +
                " s.hospitalId=p.hospitalId," +
                " s.bedId=p.bedId," +
                " s.reportCount=p.reportCount" +
            " from" +
                " sellorder s left join patient p on s.patientId=p.id" +
            " WHERE" +
                " s.orderNo='{0}'" +
            " and" +
                " s.statusNo>0";

        /// <summary>
        /// 更新订单位点表的检测类型, format(orderNo)
        /// </summary>
        public static string UpdateTestType =>
            "update s" +
            " set s.testType=sl.testType," +
            " s.orderType=sl.orderType" +
            " from sellorder s left join sellorder_list sl on s.orderNo=sl.orderNo" +
            " where" +
            " s.orderNo='{0}'" +
            " and s.statusNo>0";

        /// <summary>
        /// 更新订单位点表的送检地、检测地和出报告地相同与否的编码, format(orderNo)
        /// </summary>
        public static string UpdateTestNo =>
            "update sellorder" +
            " SET testNo=" +
            " CASE" +
            " WHEN (" +
            " userAreaCode=testAreaCode" +
            " AND testAreaCode=reportAreaCode" +
            " ) THEN 1" +
            " WHEN (" +
            " userAreaCode!=testAreaCode" +
            " AND testAreaCode=reportAreaCode" +
            " ) THEN 2" +
            " WHEN (" +
            " userAreaCode=testAreaCode" +
            " AND testAreaCode!=reportAreaCode" +
            " ) THEN 3" +
            " WHEN (" +
            " userAreaCode!=testAreaCode" +
            " AND testAreaCode!=reportAreaCode" +
            " ) THEN 4" +
            " END" +
            " where orderNo='{0}'" +
            " and statusNo>0";

        #endregion 新建订单时更新相关表信息

        #region 删除订单 或 修改订单用

        /// <summary>
        /// 把修改前的订单移动到sellorder_list_deleted
        /// </summary>
        public static string EditedToDeleted =>
            "insert into sellorder_list_deleted select * from sellorder_list where id='{0}';" +
            "delete from sellorder_list where id='{0}';" +
            "update sellorder_list_deleted set delTime=getdate(),delReason='修改订单',statusNo=-1 where id={0}";

        /// <summary>
        /// 移动删除的订单到sellorder_list_deleted
        /// </summary>
        public static string MoveDeleted =>
            "insert into sellorder_list_deleted select * from sellorder_list where id={0};" +
            "delete from sellorder_list where  id='{0}';" +
            "delete from sellorder where orderNo='{1}';" +
            "delete from sellorder_mainitem where orderNo='{1}';" +
            "update sellorder_list_deleted set delTime=getdate(),delReason='{2}',statusNo=0 where id={0}";

        #endregion 删除订单 或 修改订单用

        /// <summary>
        /// 快速新建时获取项目信息, format(mainItemId)
        /// </summary>
        public static string MainItemForQuick =>
            "select * from(select top 1 mainItemId,name,mainPrice,sampleTypeCodeList" +
            " from v_get_item_for_quick" +
            " where mainItemId='{0}'" +
            " order by submittime desc) v";
    }
}