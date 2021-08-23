export class RallyClient {
  token: string;
  baseUrl: string;

  constructor(
    token: string,
    baseUrl: string = "https://rally1.rallydev.com/slm/webservice/v2.x/"
  ) {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  get headers(): HeadersInit {
    return {
      Authorization: "Bearer " + this.token,
      Accept: "application/json",
    };
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
      this.baseUrl + path + "?" + new URLSearchParams(params),
      {
        headers: this.headers,
      }
    );

    return (await response.json()) as T;
  }
}
