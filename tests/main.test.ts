import { test, expect } from "vitest";
import html from "../fixtures/html";
import markdown from "../fixtures/md";

import { tableOfContents } from "../src/index";

let url =
  "https://blog.surveyplanet.com/decision-making-surveys-using-data-driven-info";

test("nestHeaders", async () => {
  console.log(await tableOfContents(url, "url"));
  console.log("⬆️  ⬆️  ⬆️   URL   ⬆️  ⬆️  ⬆️");

  console.log(await tableOfContents(html, "html"));
  console.log("⬆️  ⬆️  ⬆️   HTML   ⬆️  ⬆️  ⬆️");
  console.log(await tableOfContents(markdown, "md"));
  console.log("⬆️  ⬆️  ⬆️   MD   ⬆️  ⬆️  ⬆️");
});
