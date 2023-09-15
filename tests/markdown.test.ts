import { it, describe, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { parseHeaders } from '../src/index';

describe('Parse html string to headers', () => {
	it('should parse empty markdown string', () => {
		const res = parseHeaders('', 'md');
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);
	});

	it('should parse markdown without headers', () => {
		const markdown = 'Some Markdown!!';
		const res = parseHeaders(markdown, 'md');
		expect(res).toBeInstanceOf(Array);
		expect(res.length).toBe(0);
	});

	it('should parse markdown table of contents', async () => {
		const markdown = await readFile('tests/fixtures/test.md', 'utf-8');

		const res = parseHeaders(markdown, 'md');
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
	});
});

describe('real use md', () => {
	it('should parse markdown table of contents', async () => {
		const markdown = await readFile('tests/fixtures/test2.md', 'utf-8');
		const headersParsed = parseHeaders(markdown, 'md');

		expect(headersParsed).toStrictEqual([
			{ headerText: 'Header 2', id: 'header-2', children: [] },
			{ headerText: 'Header 2', id: 'header-2', children: [] },
			{
				headerText: 'Header 2',
				id: 'header-2',
				children: [
					{ headerText: 'Header 3', id: 'header-3', children: [] },
					{
						headerText: 'Header 3',
						id: 'header-3',
						children: [
							{
								headerText: 'Header 4',
								id: 'header-4',
								children: [],
							},
						],
					},
					{ headerText: 'Header 3', id: 'header-3', children: [] },
					{ headerText: 'Header 3', id: 'header-3', children: [] },
					{ headerText: 'Header 3', id: 'header-3', children: [] },
					{ headerText: 'Header 3', id: 'header-3', children: [] },
					{ headerText: 'Header 3', id: 'header-3', children: [] },
					{ headerText: 'Header 3', id: 'header-3', children: [] },
				],
			},
			{ headerText: 'Header 2', id: 'header-2', children: [] },
		]);
	});
});
