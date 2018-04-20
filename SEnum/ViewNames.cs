namespace DyLeader
{public enum ViewNames{v_AgeStructure,v_EducationStructure,v_GenderStructure,v_get_sysarea,v_LeaderStructure,v_MajorStructure,v_temp_reward,VAddr,VAnnualAppraisal,VDemocraticEvaluation,VDemocraticRecommendation,VDeptAndSection,VDivisionWork,VEduExperience,VFamilyMember,VFiling,VInspectorInspection,VKeyProjectAndWork,VMajorDegree,VMaritalStatus,VPatrolInspection,VPersonal,VPetition,VPlaneAppointRemove,VPolitics,VPostsAndStaffInspection,VPsntForQuery,VRewardPunish,VSpecialInspection,vv_LeaderStructure,vvdivisionwork,vvdivisionwork0,vvdivisionwork1,vvInspection,vvInstitutions,vvInvestigate,vvInvestigate0,vvInvestigate1,vvInvestigate2,vvInvestigate3,vvInvestigate4,VViolatingLaw,VViolationHouse,vvSpecialsupervision,vvTrainLearn,VWorkExperience}
 #region 枚举 
 public enum v_AgeStructure { WorkUnit,DeptId,Under35,Between36_45,Between46_55,Up56}
 public enum v_EducationStructure { WorkUnit,DeptID,UpMaster,Undergraduate,JuniorCollege,UnderJuniorCollete}
 public enum v_GenderStructure { WorkUnit,DeptId,man,women}
 public enum v_get_sysarea { ID,PersonalIdCard,Name}
 public enum v_LeaderStructure { WorkUnit,DeptID,Leadership,LeaderDeputy,MiddleLvelShip,MiddleLvelDeputy}
 public enum v_MajorStructure { WorkUnit,DeptID,Senior,Middle,Primary}
 public enum v_temp_reward { PersonalIdCard,mainName}
 public enum VAddr { Fullname,PersonalIdCard,Addr,Tel}
 public enum VAnnualAppraisal { Fullname,PersonalIdCard,WorkUnit,Date,Degree}
 public enum VDemocraticEvaluation { Fullname,PersonalIdCard,content,Number,Conclusion,Date}
 public enum VDemocraticRecommendation { Fullname,PersonalIdCard,Date,Content}
 public enum VDeptAndSection { ID,DeptName,SectionName}
 public enum VDivisionWork { Fullname,PersonalIdCard,DividedContent,StartDate,EndDate,Effect}
 public enum VEduExperience { Fullname,PersonalIdCard,IsFullTime,School,Department,Major,StartDate,EndDate,Status,EduBackground,Degree,IsHighest}
 public enum VFamilyMember { Fullname,PersonalIdCard,ID,Relation,FMembeName,FmBirthday,PoliticsStatus,WorkUnit,Duty}
 public enum VFiling { Fullname,PersonalIdCard,Date,Place,Content}
 public enum VInspectorInspection { Fullname,PersonalIdCard,Date,Content}
 public enum VKeyProjectAndWork { Fullname,PersonalIdCard,Name,StartDate,EndDate,Effect}
 public enum VMajorDegree { Fullname,PersonalIdCard,Major,Speciality,Degree,Date}
 public enum VMaritalStatus { Fullname,PersonalIdCard,Status,StartDate,EndDate}
 public enum VPatrolInspection { Fullname,PersonalIdCard,DeptID,SectionID,Date,Content}
 public enum VPersonal { ID,Fullname,PersonalIdCard,Gender,Birthday,Ethnicity,WorkDate,PoliticsStatus,NativePlace,NativeOrigin,politicsId,IsUsing,addrId,Status,workExperienceId,DeptID,SectionID,WorkUnit,Identity,SectionName,Duty,WorkDegree,MajorDegree,Speciality,EduDegree,School,Department,EduMajor,StartDate,EndDate,EduStatus,EduBackground,IsHighest,FullSchoolMajor,FullBackgroundDegree,FullMajor,IsFullTime,GoOnSchoolMajor,GoOnBackgroundDegree}
 public enum VPetition { Fullname,PersonalIdCard,Date,UserName,Content}
 public enum VPlaneAppointRemove { Fullname,PersonalIdCard,Appoint,Remove,Memo,ReportingUnit,ReportingDate,ExaminationAuthority,ExaminationDate,AppointmentOpinion,AppointmentDate,FillFormName}
 public enum VPolitics { Fullname,ID,PersonalIdCard,PoliticsStatus,JoinDate}
 public enum VPostsAndStaffInspection { Fullname,PersonalIdCard,DeptID,SectionID,Date,Content}
 public enum VPsntForQuery { ID,Fullname,PersonalIdCard,Gender,WorkUnit,Duty,WorkDate,SectionName,EduBackground,Major,IsReward,RewardCount,Degree,ProjectName}
 public enum VRewardPunish { Fullname,PersonalIdCard,WorkUnit,IsReward,Date,ReleaseUnit,Degree,Memo,RewardOrPunish}
 public enum VSpecialInspection { Fullname,PersonalIdCard,InspectionContent,Superior,Date,Conclusion}
 public enum vv_LeaderStructure { WorkUnit,DeptID,hdLeadership,hdLeaderDeputy,hdMiddleLvel,sjLeadership,sjLeaderDeputy,sjMiddleLvel}
 public enum vvdivisionwork { Fullname,PersonalIdCard,DeptID,SectionID,DividedContent,DivisionWorkStartDate,DivisionWorkEndDate,DivisionWork,Name,KeyProjectAndWorkStartDate,KeyProjectAndWorkEndDate,KeyProjectAndWorkEffect}
 public enum vvdivisionwork0 { Fullname,PersonalIdCard,DeptID,SectionID,WorkUnit,DividedContent,StartDate,EndDate,Effect}
 public enum vvdivisionwork1 { Fullname,PersonalIdCard,DeptID,SectionID,WorkUnit,Name,StartDate,EndDate,Effect}
 public enum vvInspection { Fullname,PersonalIdCard,DeptID,WorkUnit,SectionID,Date,Place,Content}
 public enum vvInstitutions { WorkUnit,DeptID,hdLeadership,hdLeaderDeputy,hdMiddleLvel,sjLeadership,sjLeaderDeputy,sjMiddleLvel,ls,ld,ml}
 public enum vvInvestigate { Fullname,PersonalIdCard,OrdinaryDate,Effect,DeptID,SectionID,InspectionContent,Superior,SpecialDate,SpecialConclusion,Democraticcontent,Number,Conclusion,DemocraticDate,DemocraticRecDate,Content}
 public enum vvInvestigate0 { Fullname,PersonalIdCard,DeptID,SectionID,WorkUnit,Date,Effect}
 public enum vvInvestigate1 { Fullname,PersonalIdCard,DeptID,SectionID,WorkUnit,InspectionContent,Superior,Date,Conclusion}
 public enum vvInvestigate2 { Fullname,PersonalIdCard,DeptID,SectionID,WorkUnit,Content,Number,Conclusion,Date}
 public enum vvInvestigate3 { Fullname,PersonalIdCard,DeptID,SectionID,WorkUnit,content,Number,Conclusion,Date}
 public enum vvInvestigate4 { Fullname,PersonalIdCard,DeptID,SectionID,WorkUnit,Date,Content}
 public enum VViolatingLaw { Fullname,PersonalIdCard,Date,Place,Content}
 public enum VViolationHouse { Fullname,PersonalIdCard,Date,Place,Content}
 public enum vvSpecialsupervision { Fullname,PersonalIdCard,PatrolInspectionDate,PatrolInspectionContent,PostsAndStaffInspectionDate,PostsAndStaffInspectionContent,DeptId,WorkUnit,SectionID}
 public enum vvTrainLearn { Fullname,PersonalIdCard,WorkUnit,DeptID,SectionID,TrainingSchool,TrainingContent,StartDate,EndDate,Effect}
 public enum VWorkExperience { Fullname,PersonalIdCard,WorkUnit,SectionName,StartDate,EndDate,Duty,Degree,Status}
 #endregion
}