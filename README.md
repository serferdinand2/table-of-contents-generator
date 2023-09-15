# TOC Generator for HTML and Markdown

## Installation

You can install the TOC generator using npm:

```sh
npm i @serferdinand2/table-of-contents-generator
```

## Usage

You should be able to use this module in both Node.js and the browser as it supports both CommonJS and ES6 modules.

To use the TOC generator, import the function from the toc-generator module and call it with your input source and type. The function returns a table of contents as an HTML list.

This function only works as long as the first header is the top level header. If you have a header above the top level header down the line in your HTML, it will not work.

### Example

```js
import parseHeaders from '@serferdinand2/table-of-contents-generator';

const toc = parseHeaders(html, 'html');
```

#### Output

```js
[
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
];
```

or

```js
const toc = parseHeaders(markdown, 'markdown');
```
