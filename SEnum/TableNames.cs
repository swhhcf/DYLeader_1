namespace DyLeader
{
public enum TableNames{SysTableFieldName,Addr,SysTableRight,SysUser,AnnualAppraisal,TrainingLearning,DemocraticEvaluation,DemocraticRecommendation,ViolatingLaw,DivisionWork,ViolationHouse,EduExperience,FamilyMember,Filing,Healthy,InspectorInspection,Institutions,KeyProjectAndWork,MajorDegree,MaritalStatus,OrdinaryInspection,PatrolInspection,Personal,Petition,PlaneAppointRemove,Politics,PostsAndStaffInspection,RewardPunish,SpecialInspection,SysArea,SysDepartment,SysDuty,SysDutyDegree,SysEthnicity,SysMajorDegree,WorkExperience,SysMenu,SysPolitics,SysRight}
 #region Ã¶¾Ù 
 public enum SysTableFieldName { IsTable,TableName,CnName,EnName,SheetName}
 public enum Addr { ID,Addr,Tel,PersonalIdCard,IsUsing}
 public enum SysTableRight { ID,Tablename,ReadCodes,InsertCodes,UpdateCodes,IsUsing}
 public enum SysUser { ID,Username,Fullname,RightCodes,IsUsing,Password}
 public enum AnnualAppraisal { ID,WorkUnit,Date,Degree,PersonalIdCard,IsUsing}
 public enum TrainingLearning { ID,TrainingSchool,TrainingContent,StartDate,EndDate,Effect,PersonalIdCard,IsUsing}
 public enum DemocraticEvaluation { ID,content,Number,Conclusion,Date,PersonalIdCard,IsUsing}
 public enum DemocraticRecommendation { ID,Date,Content,PersonalIdCard,IsUsing}
 public enum ViolatingLaw { ID,PersonalIdCard,Date,Place,Content,IsUsing}
 public enum DivisionWork { ID,DividedContent,StartDate,EndDate,Effect,PersonalIdCard,IsUsing}
 public enum ViolationHouse { ID,PersonalIdCard,Date,Place,Content,IsUsing}
 public enum EduExperience { ID,IsFullTime,School,Department,Major,StartDate,EndDate,Status,EduBackground,Degree,IsHighest,PersonalIdCard,IsUsing}
 public enum FamilyMember { ID,Relation,Fullname,PoliticsStatus,WorkUnit,Duty,PersonalIdCard,FmBirthday,IsUsing}
 public enum Filing { ID,PersonalIdCard,Date,Place,Content,IsUsing}
 public enum Healthy { ID,Status,Date,PersonalIdCard,IsUsing}
 public enum InspectorInspection { ID,PersonalIdCard,Date,Content,IsUsing}
 public enum Institutions { ID,WorkUnit,Leadership ,LeaderDeputy,MiddleLvel ,DeptID,IsUsing}
 public enum KeyProjectAndWork { ID,Name,StartDate,EndDate,Effect,PersonalIdCard,IsUsing}
 public enum MajorDegree { ID,Major,Speciality,Degree,Date,PersonalIdCard,IsUsing}
 public enum MaritalStatus { ID,Status,StartDate,EndDate,PersonalIdCard,IsUsing}
 public enum OrdinaryInspection { ID,Date,Effect,PersonalIdCard,IsUsing}
 public enum PatrolInspection { ID,Date,Content,PersonalIdCard,IsUsing}
 public enum Personal { ID,Fullname,PersonalIdCard,Gender,Birthday,Ethnicity,NativeOrigin,NativePlace,WorkDate,UsedName,Identity,IsUsing}
 public enum Petition { ID,PersonalIdCard,Date,UserName,Content,IsUsing}
 public enum PlaneAppointRemove { ID,Appoint,Remove,Memo,ReportingDate,ExaminationAuthority,ExaminationDate,AppointmentOpinion,AppointmentDate,FillFormName,ReportingUnit,PersonalIdCard,IsUsing}
 public enum Politics { ID,PoliticsStatus,JoinDate,PersonalIdCard,IsUsing}
 public enum PostsAndStaffInspection { ID,Date,Content,PersonalIdCard,IsUsing}
 public enum RewardPunish { ID,WorkUnit,IsReward,Date,ReleaseUnit,Degree,Memo,PersonalIdCard,IsUsing}
 public enum SpecialInspection { ID,InspectionContent,Superior,Date,Conclusion,PersonalIdCard,IsUsing}
 public enum SysArea { ID,PersonalIdCard,Name,IsUsing}
 public enum SysDepartment { name,id,pId,IsUsing}
 public enum SysDuty { ID,Name,IsUsing}
 public enum SysDutyDegree { ID,Name,IsUsing}
 public enum SysEthnicity { Ethnicity,IsUsing}
 public enum SysMajorDegree { ID,Name,IsUsing}
 public enum WorkExperience { ID,WorkUnit,StartDate,EndDate,Duty,Degree,Status,SectionName ,DeptID,SectionID,PersonalIdCard,Identity,IsUsing}
 public enum SysMenu { id,name,parentId,tableId,tableName,url,orderIndex,isUsing,roleIds,icon}
 public enum SysPolitics { ID,Status,IsUsing}
 public enum SysRight { ID,Code,Name,IsUsing,IsGlobal}
 #endregion
}