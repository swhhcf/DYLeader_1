namespace Btc.NewCommon
{
    /// <summary>
    /// 操作权限 依次为超级管理员，销售，客服，销售助理，管理层
    /// </summary>
    public enum RoleType
    {
        none,
        admin, sellor, service, techMgr, manager, agency, agencyMgr, invoiceCheck, invoiceFinish, itemMgr, nextGenSeq,
        alowEditPrice, viewReport, assistant = 18, priceMgr = 20, deptMgr = 30, sciAllMgr = 1000, sciProjectMgr, sciProjectMember, areaMgr = 21, regionalMgr = 31, companyMgr = 41
    }
}