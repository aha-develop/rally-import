import { IDENTIFIER } from "../extension";
import { RallyClient } from "../lib/RallyClient";

interface RallyCandidate
  extends Aha.ImportRecord,
    Partial<Rally.HierarchicalRequirementAttributes> {}

const importer = aha.getImporter<RallyCandidate>(`${IDENTIFIER}.importer`);

async function authedRally() {
  const rallyToken = await aha.auth("rally", { useCachedRetry: true });
  return new RallyClient(rallyToken.token);
}

const SEP = "::";

/**
 * Aha! Develop filters can only hold a string reference, but rally needs some
 * more information to load the allowed values. Therefore the filter name is
 * "packed" with the attribute name and a ref to it's allowed values API
 * endpoint.
 */
function packStateFilter(state: Rally.Attribute) {
  return ["state", state.ElementName, state.AllowedValues?._ref].join(SEP);
}

function unpackStateFilter(name: string) {
  const [_, Name, ref] = name.split(SEP);
  return { Name, ref };
}

importer.on({ action: "listCandidates" }, async ({ filters, nextPage }) => {
  const rally = await authedRally();

  const params: any = {};
  const query: string[] = [];

  params.project = filters.project;
  const projectId = rally.idFromRef(filters.project);

  // Find the state filter and apply it. Currently only one will be shown, but
  // this code would work with many.
  Object.keys(filters)
    .filter((f) => f.startsWith(`state${SEP}`))
    .forEach((filter) => {
      const { Name, ref } = unpackStateFilter(filter);
      const value = filters[filter];

      if (value && value !== "") {
        query.push(`(${Name} = "${value}")`);
      }
    });

  if (filters.query && filters.query.length > 0) {
    query.push(filters.query);
  }

  // Rally is picky about the query syntax. You cannot put double brackets
  // around the query unless it has multiple statements
  if (query.length > 1) {
    params.query = "(" + query.join(" AND ") + ")";
  } else if (query.length > 0) {
    params.query = query[0];
  }

  const results = (
    await rally.hierachicalRequirements(
      ["Name", "Description", "ObjectID"],
      params
    )
  ).Results;

  const records = results.map((r) => ({
    name: r.Name,
    uniqueId: r._refObjectUUID,
    url: rally.recordUrl(projectId, String(r.ObjectID)),
    ...r,
  })) as RallyCandidate[];

  return { records, nextPage: null };
});

importer.on({ action: "listFilters" }, async () => {
  // Get the type definiton for Hierarchical Requirement from rally and find the
  // state field so we can create a filter for it.
  const rally = await authedRally();
  const typedef = await rally.typeDefinition("Hierarchical Requirement");
  const attrs = await rally.typeAttributes(typedef.ObjectUUID);
  const stateAttr = attrs.Results.find((r) => r.AttributeType === "STATE");

  const filters: Aha.ListFilters = {
    project: {
      title: "Project",
      required: true,
      type: "select",
    },
  };

  if (stateAttr) {
    filters[packStateFilter(stateAttr)] = {
      title: stateAttr.Name,
      required: false,
      type: "select",
    };
  }

  filters.query = {
    title: "Query",
    required: false,
    type: "text",
  };

  return filters;
});

importer.on({ action: "filterValues" }, async ({ filterName, filters }) => {
  const rally = await authedRally();

  switch (filterName) {
    case "project":
      const projects = (await rally.projects()).Results;
      return projects.map((p) => ({ text: p.Name, value: p._ref }));
  }

  if (filterName.startsWith(`state${SEP}`)) {
    const { ref } = unpackStateFilter(filterName);
    const allowedValues = await rally.byRef<
      Rally.QueryResultResponse<Rally.AllowedAttributeValue>
    >(ref);
    return allowedValues.QueryResult.Results.map((allowedValue) => ({
      text: allowedValue.LocalizedStringValue,
      value: allowedValue.StringValue,
    }));
  }

  return [];
});

importer.on({ action: "importRecord" }, async ({ importRecord, ahaRecord }) => {
  ahaRecord.description = importRecord.Description;
  await ahaRecord.save();
});
