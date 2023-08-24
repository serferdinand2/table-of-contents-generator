# TOC Generator for Markdown, HTML and URL inputs

## Installation

You can install the TOC generator using npm:

```sh
npm install table-of-contents-generator
```

## Usage

To use the TOC generator, import the `tableOfContents` function from the toc-generator module and call it with your input source and type. The function returns a table of contents as a string.

```js
import tableOfContents from "table-of-contents-generator";

const toc = tableOfContents(html, "html");
```
