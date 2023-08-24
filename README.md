# TOC Generator for HTML and Markdown

## Installation

You can install the TOC generator using npm:

```sh
npm i @serferdinand2/table-of-contents-generator
```

## Usage

To use the TOC generator, import the `tableOfContents` function from the toc-generator module and call it with your input source and type. The function returns a table of contents as an HTML list.

```js
import tableOfContents from "table-of-contents-generator";

const toc = tableOfContents(html, "html");
```
