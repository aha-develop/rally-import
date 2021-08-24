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
    ObjectID: string;
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
    FormattedID: string;
    Name: string;
  }

  interface TypeDef extends RallyObject {
    CreationDate: Date;
    _CreatedAt: string;
    ObjectID: number;
    ObjectUUID: string;
    VersionId: string;
    Subscription: RallyObject;
    Workspace: RallyObject;
    Abstract: boolean;
    Copyable: boolean;
    Creatable: boolean;
    Deletable: boolean;
    DisplayName: string;
    ElementName: string;
    IDPrefix: string;
    Name: string;
    Note: string;
    Ordinal: number;
    Parent: RallyObject;
    Queryable: boolean;
    ReadOnly: boolean;
    Restorable: boolean;
    RevisionHistory: RallyObject;
    TypePath: string;
    UserListable: boolean;
  }
  interface Attribute extends RallyObject {
    CreationDate: Date;
    _CreatedAt: string;
    ObjectID: number;
    ObjectUUID: string;
    VersionId: string;
    Subscription: null;
    Workspace: null;
    AllowedQueryOperators: RallyPartialList;
    AllowedValueType: null;
    AllowedValues: RallyPartialList;
    AttributeType: string;
    Constrained: boolean;
    Custom: boolean;
    DetailedType: null;
    ElementName: string;
    Filterable: boolean;
    Hidden: boolean;
    Hideable: boolean;
    MaxFractionalDigits: number;
    MaxLength: number;
    Name: string;
    Note: string;
    Owned: boolean;
    ReadOnly: boolean;
    RealAttributeType: string;
    Required: boolean;
    Sortable: boolean;
    SystemRequired: boolean;
    Type: string;
    TypeDefinition: RallyObject;
    VisibleOnlyToAdmins: boolean;
  }

  interface RallyPartialList {
    _rallyAPIMajor: string;
    _rallyAPIMinor: string;
    _ref: string;
    _type: string;
    Count: number;
  }

  interface AllowedAttributeValue extends RallyObject {
    CreationDate: null;
    ObjectID: null;
    ObjectUUID: string;
    VersionId: string;
    AttributeDefinition: RallyObject;
    IntegerValue: null;
    LocalizedStringValue: string;
    StringValue: string;
    ValueIndex: null;
    _type: "AllowedAttributeValue";
  }
}
