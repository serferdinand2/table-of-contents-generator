import { it, describe, expect } from 'vitest';
import { inspect } from 'util';
import { readFile } from 'node:fs/promises';
import tableOfContents, {
	nestedArrayToHtmlList,
	parseHeaders,
} from '../src/index';

describe('Parse html string to headers', () => {
	it('should parse empty html string', () => {
		const res = parseHeaders('', 'html');
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);
	});

	it('should parse empty markdown string', () => {
		const res = parseHeaders('', 'md');
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);
	});

	it('should parse html without headers', () => {
		const html = '<p>Some html!</p>';
		const res = parseHeaders(html, 'html');
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);
	});

	it('should parse markdown without headers', () => {
		const markdown = 'Some Markdown!!';
		const res = parseHeaders(markdown, 'md');
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);
	});

	it('should parse a single H1 header', async () => {
		const html = `<h1>Some header</h1>
		<p>Some html!</p>`;
		const res = parseHeaders(html, 'html');
		// console.log(res);
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(1);
		expect(res[0].headerText).toBe('Some header');
		expect(res[0].children.length).toBe(0);
	});

	it('should parse a nested h2 header', async () => {
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

	it('should parse a single h3 header', async () => {
		const html = `<h3>Headline 3</h3>`;
		const res = parseHeaders(html, 'html');
		// console.log(res);
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(1);
		expect(res[0].headerText).toBe('Headline 3');
		expect(res[0].children.length).toBe(0);
	});

	it('should parse all html headers', async () => {
		const html = await readFile('tests/fixtures/test.html', 'utf-8');
		const res = parseHeaders(html, 'html');
		console.log(inspect(res, { colors: true, depth: 10 }));
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(1);
		expect(res[0].headerText).toBe(
			'Decision-making surveys: Using data-driven info'
		);
		expect(res[0].children?.length).toBe(4);
	});

	it('should parse markdown table of contents', async () => {
		const markdown = await readFile('tests/fixtures/test.md', 'utf-8');

		const res = parseHeaders(markdown, 'md');
		expect(res).toStrictEqual([
			{
				headerText: 'Decision-making surveys: Using data-driven info',
				children: [
					{
						headerText: 'Understanding decision-making surveys',
						children: [
							{
								headerText:
									'Key characteristics of decision-making surveys',
								children: [],
							},
							{
								headerText:
									'Applications of decision-making surveys',
								children: [],
							},
							{
								headerText:
									'Benefits of decision-making surveys',
								children: [],
							},
						],
					},
					{
						headerText:
							'What is a purchasing decision questionnaire?',
						children: [],
					},
					{
						headerText:
							'How is a purchasing decision questionnaire different from a decision-making survey?',
						children: [
							{
								headerText: 'Focus and purpose',
								children: [],
							},
							{
								headerText: 'Application',
								children: [],
							},
							{
								headerText: 'Scope',
								children: [],
							},
						],
					},
					{
						headerText:
							'Get SurveyPlanet and easily make decision-making surveys',
						children: [],
					},
				],
			},
		]);
	});
});

describe('Nest array to html', () => {
	it('should convert nested array to html list', async () => {
		const headers = [
			{
				headerText: 'Headline 1',
				children: [
					{
						headerText: 'Headline 2',
						children: [
							{
								headerText: 'Headline 3',
								children: [],
							},
							{
								headerText: 'Headline 3',
								children: [],
							},
						],
					},
					{
						headerText: 'Headline 2',
						children: [],
					},
				],
			},
		];
		const html = nestedArrayToHtmlList(headers);
		expect(html).toBe(
			`<ul><li><a href=#headline-1>Headline 1</a><ul><li><a href=#headline-2>Headline 2</a><ul><li><a href=#headline-3>Headline 3</a></li><li><a href=#headline-3>Headline 3</a></li></ul></li><li><a href=#headline-2>Headline 2</a></li></ul></li></ul>`
		);
	});
});

describe('Table of contents', () => {
	it('should parse empty string', async () => {
		const res = await tableOfContents('', 'html');
		expect(res).toBe('<ul></ul>');
	});

	it('should parse html without headers', async () => {
		const html = '<p>Some html!</p>';
		const res = await tableOfContents(html, 'html');
		expect(res).toBe('<ul></ul>');
	});

	it('should parse html table of contents', async () => {
		const html = await readFile('tests/fixtures/test.html', 'utf-8');
		const res = await tableOfContents(html, 'html');
		expect(res).toBe(
			`<ul><li><a href=#decision-making-surveys-using-data-driven-info>Decision-making surveys: Using data-driven info</a><ul><li><a href=#understanding-decision-making-surveys>Understanding decision-making surveys</a><ul><li><a href=#key-characteristics-of-decision-making-surveys>Key characteristics of decision-making surveys</a></li><li><a href=#applications-of-decision-making-surveys>Applications of decision-making surveys</a></li><li><a href=#benefits-of-decision-making-surveys>Benefits of decision-making surveys</a></li></ul></li><li><a href=#what-is-a-purchasing-decision-questionnaire?>What is a purchasing decision questionnaire?</a></li><li><a href=#how-is-a-purchasing-decision-questionnaire-different-from-a-decision-making-survey?>How is a purchasing decision questionnaire different from a decision-making survey?</a><ul><li><a href=#focus-and-purpose>Focus and purpose</a></li><li><a href=#application>Application</a></li><li><a href=#scope>Scope</a></li></ul></li><li><a href=#get-surveyplanet-and-easily-make-decision-making-surveys>Get SurveyPlanet and easily make decision-making surveys</a></li></ul></li></ul>`
		);
	});

	it('should parse markdown table of contents', async () => {
		const markdown = await readFile('tests/fixtures/test.md', 'utf-8');
		const res = await tableOfContents(markdown, 'md');
		expect(res).toBe(
			`<ul><li><a href=#decision-making-surveys-using-data-driven-info>Decision-making surveys: Using data-driven info</a><ul><li><a href=#understanding-decision-making-surveys>Understanding decision-making surveys</a><ul><li><a href=#key-characteristics-of-decision-making-surveys>Key characteristics of decision-making surveys</a></li><li><a href=#applications-of-decision-making-surveys>Applications of decision-making surveys</a></li><li><a href=#benefits-of-decision-making-surveys>Benefits of decision-making surveys</a></li></ul></li><li><a href=#what-is-a-purchasing-decision-questionnaire?>What is a purchasing decision questionnaire?</a></li><li><a href=#how-is-a-purchasing-decision-questionnaire-different-from-a-decision-making-survey?>How is a purchasing decision questionnaire different from a decision-making survey?</a><ul><li><a href=#focus-and-purpose>Focus and purpose</a></li><li><a href=#application>Application</a></li><li><a href=#scope>Scope</a></li></ul></li><li><a href=#get-surveyplanet-and-easily-make-decision-making-surveys>Get SurveyPlanet and easily make decision-making surveys</a></li></ul></li></ul>`
		);
	});
});
