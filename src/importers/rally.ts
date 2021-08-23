import { RallyClient } from "../lib/RallyClient";

interface RallyCandidate
  extends Aha.ImportRecord,
    Partial<Rally.HierarchicalRequirementAttributes> {}

const importer = aha.getImporter<RallyCandidate>(
  "aha-develop.rally-importer.importer"
);

importer.on({ action: "listCandidates" }, async ({ filters, nextPage }) => {
  const rallyToken = await aha.auth("rally", { useCachedRetry: true });
  const rally = new RallyClient(rallyToken.token);
  const params: any = {};
  if (filters.project) {
    params.project = filters.project;
  }
  if (filters.iteration) {
    params.query = `(Iteration.Name = "${filters.iteration}")`;
  }
  const us = (
    await rally.hierachicalRequirements(["Name", "Description"], params)
  ).Results;

  const records = us.map((r) => ({
    name: r.Name,
    uniqueId: r._refObjectUUID,
    url: r._ref,
    ...r,
  })) as RallyCandidate[];

  return { records, nextPage: null };
});

importer.on({ action: "listFilters" }, (): Aha.ListFilters => {
  return {
    project: {
      title: "Project",
      required: false,
      type: "select",
    },
    iteration: {
      title: "Iteration",
      required: false,
      type: "autocomplete",
    },
  };
});

importer.on({ action: "filterValues" }, async ({ filterName, filters }) => {
  const rallyToken = await aha.auth("rally", { useCachedRetry: true });
  const rally = new RallyClient(rallyToken.token);

  switch (filterName) {
    case "project":
      const projects = (await rally.projects()).Results;
      return projects.map((p) => ({ text: p.Name, value: p._ref }));

    case "iteration":
      const params: any = {};
      if (filters.project) {
        params.project = filters.project;
      }

      const iterations = (await rally.iterations(["Name"], params)).Results;
      return iterations.map((i) => ({ text: i.Name, value: i._refObjectName }));
  }

  return [];
});

//Optional
//importer.on({ action: "renderRecord" }, ({ record, onUnmounted }, { identifier, settings }) => {
//  onUnmounted(() => {
//    console.log("Un-mounting component for", record.identifier);
//  });
//
//  return `${record.identifier} ${record.name}`;
//});

importer.on({ action: "importRecord" }, async ({ importRecord, ahaRecord }) => {
  ahaRecord.description = importRecord.Description;
  await ahaRecord.save();
});
