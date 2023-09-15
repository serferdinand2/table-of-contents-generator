import { it, describe, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { parseHeaders } from '../src/index';

describe('Parse html string to headers', () => {
	it('should parse empty html string', () => {
		const res = parseHeaders('', 'html');
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);
	});

	it('should parse html without headers', () => {
		const html = '<p>Some html!</p>';
		const res = parseHeaders(html, 'html');
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
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(1);

		expect(res).toStrictEqual([
			{
				headerText: 'Header 1',
				id: 'header-1',
				children: [
					{
						headerText: 'Header 2',
						id: 'header-2',
						children: [
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
						],
					},
					{ headerText: 'Header 2', id: 'header-2', children: [] },
					{
						headerText: 'Header 2',
						id: 'header-2',
						children: [
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
						],
					},
					{ headerText: 'Header 2', id: 'header-2', children: [] },
				],
			},
		]);
		expect(res[0].children?.length).toBe(4);
	});
});

describe('real use html', () => {
	it('should parse html table of contents', async () => {
		const html = await readFile('tests/fixtures/test2.html', 'utf-8');
		const headersParsed = await parseHeaders(html, 'html');
		expect(headersParsed).toStrictEqual([
			{
				headerText: 'Header 1',
				id: 'header-1',
				children: [
					{
						headerText: 'Header 2',
						id: 'header-2',
						children: [
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
						],
					},
					{ headerText: 'Header 2', id: 'header-2', children: [] },
					{
						headerText: 'Header 2',
						id: 'header-2',
						children: [
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
							{
								headerText: 'Header 3',
								id: 'header-3',
								children: [],
							},
						],
					},
					{ headerText: 'Header 2', id: 'header-2', children: [] },
				],
			},
		]);
	});
});
