class QueryResultError extends Error {}

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
    return await this.query<
      Rally.HierarchicalRequirement &
        Pick<Rally.HierarchicalRequirementAttributes, P>
    >("hierarchicalrequirement", {
      fetch: fetch.join(","),
      ...params,
    });
  }

  async projects() {
    return await this.query<Rally.Project>("project", {
      query: "",
      fetch: "Name",
    });
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
    const response = await this.query<Rally.TypeDef>("typedefinition", {
      query: `(Name = "${type}")`,
      fetch: fetch ? fetch.join(",") : "true",
    });
    return response.Results[0];
  }

  async typeAttributes(typeDefObjectUUID: string, fetch?: string[]) {
    return await this.query<Rally.Attribute>(
      `typedefinition/${typeDefObjectUUID}/Attributes`,
      {
        fetch: fetch ? fetch.join(",") : "true",
        pagesize: 200,
      }
    );
  }

  async iterations<P extends keyof Rally.IterationAttributes>(
    fetch: P[],
    params: object = {}
  ) {
    return await this.query<
      Rally.Iteration & Pick<Rally.IterationAttributes, P>
    >("iteration", {
      fetch: fetch.join(","),
      ...params,
    });
  }

  async query<T>(path: string, params = {}) {
    const { QueryResult } = await this.get<Rally.QueryResultResponse<T>>(
      path,
      params
    );

    if (QueryResult.Errors.length > 0) {
      throw new aha.ConfigError(QueryResult.Errors.join(", "));
    }

    return QueryResult;
  }

  async get<T>(path: string, params = {}) {
    const url = path.includes(this.baseUrl)
      ? path
      : this.baseUrl + this.wsPath + path;

    const response = await fetch(url + "?" + new URLSearchParams(params), {
      headers: this.headers,
    });

    return (await response.json()) as T;
  }
}
