import { expect, it } from "vitest";
import { buildStudioTools, collectStudioLookScene } from "@hyperframes/studio";

it("exports Studio's agent tools for a host's own edit session", () => {
  const tools = buildStudioTools({ current: {} as never });
  const names = tools.map((tool) => tool.name);
  expect(names).toEqual(expect.arrayContaining(["kinevyn_studio_look", "kinevyn_studio_seek"]));
  expect(names).toHaveLength(5);
  expect(names.every(name => name.startsWith("kinevyn_studio_"))).toBe(true);
  expect(JSON.stringify(tools.map(({ description, inputSchema }) => ({ description, inputSchema }))))
    .not.toMatch(/\bstudio_[a-z_]+/);
  expect(typeof collectStudioLookScene).toBe("function");
});
