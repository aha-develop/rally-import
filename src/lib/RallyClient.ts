export class RallyClient {
  token: string;
  baseUrl: string;
  wsPath: string = "/slm/webservice/v2.x/";

  constructor(token: string, baseUrl: string = "https://rally1.rallydev.com") {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  get headers(): HeadersInit {
    return {
      Authorization: "Bearer " + this.token,
      Accept: "application/json",
    };
  }

  idFromRef(ref: string) {
    return ref.split("/").slice(-1)[0];
  }

  recordUrl(projectId: string, recordId: string) {
    return [
      `${this.baseUrl}/#`,
      `${projectId}d`,
      "detail",
      "userstory",
      recordId,
    ].join("/");
  }

  async user<P extends keyof Rally.UserAttributes>(fetch: P[]) {
    return (
      await this.get<{ User: Rally.User & Pick<Rally.UserAttributes, P> }>(
        "user",
        {
          fetch: fetch.join(","),
        }
      )
    )["User"];
  }

  async hierachicalRequirements<
    P extends keyof Rally.HierarchicalRequirementAttributes
  >(fetch: P[], params: object = {}) {
    const response = await this.get<
      Rally.QueryResultResponse<
        Rally.HierarchicalRequirement &
          Pick<Rally.HierarchicalRequirementAttributes, P>
      >
    >("hierarchicalrequirement", {
      fetch: fetch.join(","),
      ...params,
    });

    return response.QueryResult;
  }

  async byRef<T>(ref: string) {
    const response = await fetch(ref, { headers: this.headers });
    const object = await response.json();

    const keys = Object.keys(object);
    if (keys[0] === "QueryResult") return object as T;

    return object[keys[0]] as T;
  }

  async projects() {
    const response = await this.get<Rally.QueryResultResponse<Rally.Project>>(
      "project",
      {
        query: "",
        fetch: "Name",
      }
    );

    return response.QueryResult;
  }

  async schema(projectId: string) {
    const response = await fetch(
      this.baseUrl + `/slm/schema/v2.0/project/${projectId}`,
      {
        headers: this.headers,
      }
    );

    return await response.json();
  }

  async typeDefinition(type: string, fetch?: string[]) {
    const response = await this.get<Rally.QueryResultResponse<Rally.TypeDef>>(
      "typedefinition",
      {
        query: `(Name = "${type}")`,
        fetch: fetch ? fetch.join(",") : "true",
      }
    );
    return response.QueryResult.Results[0];
  }

  async typeAttributes(typeDefObjectUUID: string, fetch?: string[]) {
    const response = await this.get<Rally.QueryResultResponse<Rally.Attribute>>(
      `typedefinition/${typeDefObjectUUID}/Attributes`,
      {
        fetch: fetch ? fetch.join(",") : "true",
      }
    );
    return response.QueryResult;
  }

  async iterations<P extends keyof Rally.IterationAttributes>(
    fetch: P[],
    params: object = {}
  ) {
    const response = await this.get<
      Rally.QueryResultResponse<
        Rally.Iteration & Pick<Rally.IterationAttributes, P>
      >
    >("iteration", {
      fetch: fetch.join(","),
      ...params,
    });

    return response.QueryResult;
  }

  async get<T>(path: string, params = {}) {
    const response = await fetch(
      this.baseUrl + this.wsPath + path + "?" + new URLSearchParams(params),
      {
        headers: this.headers,
      }
    );

    return (await response.json()) as T;
  }
}
