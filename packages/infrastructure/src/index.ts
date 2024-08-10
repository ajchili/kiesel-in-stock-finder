import { App, Project, Region } from "@pulumi/digitalocean";

const project = new Project("kiesel-in-stock-finder", {
  name: "kiesel-in-stock-finder",
  description:
    "Third party website for searching the available in stock instruments offered by Kiesel Guitars.",
});

new App("app", {
  projectId: project.id,
  spec: {
    name: "kiesel-in-stock-finder",
    region: Region.NYC1,
    services: [
      {
        name: "website",
        image: {
          registryType: "DOCKER_HUB",
          registry: "ajchili",
          repository: "kiesel-in-stock-finder",
          tag: "latest",
        },
        instanceCount: 1,
        httpPort: 80,
      },
    ],
  },
});
