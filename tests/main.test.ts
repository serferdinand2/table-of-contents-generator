import { it, describe, expect } from "vitest";
import {inspect} from 'util';
import { readFile } from 'node:fs/promises';
import {
	tableOfContents,
	nestedArrayToHtmlList,
	parseHeaders,
} from '../src/index';


describe("Parse html string to headers", () => {

	it("should parse empty html string", () => {
		const res = parseHeaders('', "html");
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);
	});

	it("should parse empty markdown string", () => {
		const res = parseHeaders('', "md");
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);
	});

	it("should parse html without headers", () => {
		const html = '<p>Some html!</p>';
		const res = parseHeaders(html, 'html');
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);

	});

	it("should parse markdown without headers", () => {
		const markdown = 'Some Markdown!!';
		const res = parseHeaders(markdown, 'md');
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);
	});

	it("should parse a single H1 header", async () => {
		const html = `<h1>Some header</h1>
		<p>Some html!</p>`;
		const res = parseHeaders(html, 'html');
		// console.log(res);
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(1);
		expect(res[0].headerText).toBe('Some header');
		expect(res[0].children.length).toBe(0);
	});

	it.only("should parse a nested h2 header", async () => {
		const html = `<h1>Headline 1</h1>
		<p>Some html!</p>
		<h2>Headline 2</h2>
		<p>Some more html.</p>
		`;
		const res = parseHeaders(html, 'html');
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(1);
		expect(res[0].headerText).toBe('Headline 1');
		expect(res[0].children.length).toBe(1);
		expect(res[0].children[0].headerText).toBe('Headline 2');
		expect(res[0].children[0].children.length).toBe(0);
	});

	it("should parse a single h3 header", async () => {
		const html = `<h3>Headline 3</h3>`;
		const res = parseHeaders(html, 'html');
		// console.log(res);
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(1);
		expect(res[0].headerText).toBe('Headline 3');
		expect(res[0].children.length).toBe(0);
	});

	it("should parse all html headers", async () => {
		const html = await readFile("tests/fixtures/test.html", "utf-8");
		const res = parseHeaders(html, 'html');
		console.log( inspect(res, {colors: true, depth: 10}) );
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(1);
		expect(res[0].headerText).toBe(
			'Decision-making surveys: Using data-driven info'
		);
		expect(res[0].children?.length).toBe(5);
		

	});

	it.skip("should parse markdown table of contents", async () => {
		const markdown = await readFile("tests/fixtures/test.md", "utf-8");
		const res = parseHeaders(markdown, 'md');
		expect(res).toBe([]);

	});
});

describe.skip("Nest array to html", () => {


});

describe.skip("Table of contents", () => {

	it("should parse empty string", async () => {
		const res = await tableOfContents('', "html")
		expect(res).toBe([]);
	});

	it("should parse html without headers", async () => {
		const html = '<p>Some html!</p>';
		const res = await tableOfContents(html, "html");
	});

	it("should parse html table of contents", async () => {
		const html = await readFile("tests/fixtures/test.html", "utf-8");
		console.log(await tableOfContents(html, "html"));
	});


	it("should parse markdown table of contents", async () => {
		const markdown = await readFile("tests/fixtures/test.md", "utf-8");
		console.log(await tableOfContents(markdown, "md"));
	});
});
