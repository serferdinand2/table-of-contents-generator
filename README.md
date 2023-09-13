# TOC Generator for HTML and Markdown

## Installation

You can install the TOC generator using npm:

```sh
npm i @serferdinand2/table-of-contents-generator
```

## Usage

To use the TOC generator, import the `tableOfContents` function from the toc-generator module and call it with your input source and type. The function returns a table of contents as an HTML list.

This function only works as long as the first header is the top level header. If you have a header above the top level header, it will not work.

```js
import parseHeaders from "@serferdinand2/table-of-contents-generator";

const toc = parseHeaders(html, "html");
```

or

```js
const toc = parseHeaders(markdown, "markdown");
```
