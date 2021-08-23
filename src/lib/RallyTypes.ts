declare namespace Rally {
  interface RallyObject {
    _rallyAPIMajor: string;
    _rallyAPIMinor: string;
    _ref: string;
    _refObjectUUID: string;
    _refObjectName: string;
    _type: string;
  }

  interface Project extends RallyObject {
    _refObjectName: string;
    _type: "Project";
    Name: string;
  }

  interface QueryResultResponse<T> {
    QueryResult: QueryResult<T>;
  }

  interface QueryResult<T> {
    _rallyAPIMajor: string;
    _rallyAPIMinor: string;
    Errors: string[];
    Warnings: string[];
    TotalResultCount: number;
    StartIndex: number;
    PageSize: number;
    Results: T[];
  }

  interface UserAttributes {
    CreationDate: Date;
    ObjectID: number;
    ObjectUUID: string;
    VersionId: string;
    CostCenter: string;
    DateFormat: null;
    DateTimeFormat: null;
    DefaultDetailPageToViewingMode: boolean;
    DefaultProject: null;
    Deleted: boolean;
    Department: string;
    Disabled: boolean;
    DisplayName: null;
    EmailAddress: string;
    EmailNotificationEnabled: boolean;
    FirstName: null;
    InvestmentAdmin: boolean;
    LandingPage: string;
    Language: string;
    LastActiveDate: Date;
    LastLoginDate: Date;
    LastName: null;
    LastPasswordUpdateDate: Date;
    LastSystemTimeZoneName: string;
    Locale: string;
    MiddleName: null;
    NetworkID: null;
    OfficeLocation: string;
    OnpremLdapUsername: null;
    PasswordExpires: number;
    Phone: null;
    Planner: boolean;
    ProfileImage: null;
    ProjectScopeDown: boolean;
    ProjectScopeUp: boolean;
    Role: string;
    sessionTimeout: number;
    SessionTimeoutWarning: boolean;
    ShortDisplayName: null;
    SubscriptionAdmin: boolean;
    SubscriptionID: number;
    SubscriptionPermission: string;
    UserName: string;
    WorkspacePermission: string;
    ZuulID: string;
  }

  interface User extends RallyObject {
    _type: "User";
  }

  interface IterationAttributes {
    CreationDate: Date;
    ObjectID: number;
    ObjectUUID: string;
    VersionId: string;
    Subscription: Project;
    Workspace: Project;
    CascadedToChildren: boolean;
    EndDate: Date;
    Name: string;
    Notes: string;
    PlanEstimate: number | null;
    PlannedVelocity: number;
    Project: Project;
    RevisionHistory: Project;
    StartDate: Date;
    State: string;
    SyncedWithParent: boolean;
    TaskActualTotal: number | null;
    TaskEstimateTotal: number | null;
    TaskRemainingTotal: number | null;
    Theme: string;
    UserIterationCapacities: Project;
    WorkProducts: Project;
  }

  interface Iteration extends RallyObject {
    _type: "Iteration";
  }

  interface HierarchicalRequirement extends RallyObject {
    _type: "HierarchicalRequirement";
  }

  interface HierarchicalRequirementAttributes {
    CreationDate: Date;
    ObjectID: number;
    ObjectUUID: string;
    VersionId: string;
    Description: string;
    DisplayColor: string;
    Expedite: boolean;
    FormattedID: string;
    LastUpdateDate: Date;
    LatestDiscussionAgeInMinutes: null;
    Name: string;
    Notes: string;
    Owner: null;
    Ready: boolean;
    FlowStateChangedDate: Date;
    LastBuild: null;
    LastRun: null;
    PassingTestCaseCount: number;
    ScheduleState: string;
    ScheduleStatePrefix: string;
    TestCaseCount: number;
    Package: null;
    AcceptedDate: null;
    Blocked: boolean;
    BlockedReason: null;
    Blocker: null;
    DefectStatus: null;
    DirectChildrenCount: number;
    DragAndDropRank: string;
    HasParent: boolean;
    InProgressDate: null;
    Iteration: null;
    Parent: null;
    PlanEstimate: number;
    Recycled: boolean;
    Release: null;
    TaskActualTotal: number;
    TaskEstimateTotal: number;
    TaskRemainingTotal: number;
    TaskStatus: null;
    TestCaseStatus: null;
    UnifiedParent: null;
    c_AnimalVegetableMineral: null;
  }
}
