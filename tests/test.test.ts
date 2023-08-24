import { test, expect } from "vitest";
import getHeaders from "../src/getHeaders";
import html from "../fixtures/html";
import markdown from "../fixtures/md";
let url =
  "https://blog.surveyplanet.com/decision-making-surveys-using-data-driven-info";

test("getHeadersFromMarkdown", async () => {
  const headers = await getHeaders[1](markdown);
});

test("getHeadersFromHTML", async () => {
  const headers = await getHeaders[2](html);
});

test("getHeadersFromURL", async () => {
  const headers = await getHeaders[0](url);
});
