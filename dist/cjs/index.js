var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  generateTableOfContents: () => generateTableOfContents,
  nestedArrayToHtmlList: () => nestedArrayToHtmlList,
  parseHeaders: () => parseHeaders
});
module.exports = __toCommonJS(src_exports);
var getHeadersFromHTML = (html) => {
  const headerRegex = /<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g;
  const headers = html.match(headerRegex);
  return headers;
};
var getHeadersFromMarkdown = (markdown) => {
  const headerRegex = /#{1,6}.*\n/g;
  const headers = markdown.match(headerRegex);
  return headers;
};
var inputHeaders = (source, type) => {
  if (type === "md") {
    return getHeadersFromMarkdown(source);
  }
  if (type === "html") {
    return getHeadersFromHTML(source);
  }
};
var parseHeaders = (source, type) => {
  const htmlHeaders = inputHeaders(source, type);
  if (!htmlHeaders || !htmlHeaders.length) {
    return [];
  }
  const headers = [];
  let currentHeader = headers;
  let currentLevel = 0;
  if (type === "md") {
    currentLevel = htmlHeaders[0].split("#").length - 1;
  } else {
    currentLevel = parseInt(htmlHeaders[0].charAt(2));
  }
  for (const header of htmlHeaders) {
    let headerLevel;
    let headerText;
    if (type === "md") {
      headerLevel = header.split("#").length - 1;
    } else {
      headerLevel = parseInt(header.charAt(2));
    }
    if (type === "md") {
      headerText = header.replace(/#{1,6}/g, "").replace(/\n/g, "").replace(/ {2}/g, " ").trim();
    } else {
      headerText = header.replace(/<[^>]*>/g, "").trim().replace(/\n\s*/g, " ").replace(/ {2}/g, " ");
    }
    if (headerLevel === currentLevel && currentHeader) {
      currentHeader.push({ headerText, children: [] });
    } else if (headerLevel > currentLevel && currentHeader) {
      currentHeader[currentHeader.length - 1].children = [
        { headerText, children: [] }
      ];
      currentHeader = currentHeader[currentHeader.length - 1].children;
      currentLevel = headerLevel;
    } else if (headerLevel < currentLevel) {
      currentHeader = headers;
      for (let i = 1; i < headerLevel; i++) {
        currentHeader = currentHeader[currentHeader.length - 1].children;
      }
      currentLevel = headerLevel;
      currentHeader.push({ headerText, children: [] });
    }
  }
  return headers;
};
var nestedArrayToHtmlList = (headers) => {
  let html = "<ul>";
  for (const header of headers) {
    const id = header.headerText.replace(/\s/g, "-").replace(/:/g, "").toLowerCase();
    html += `<li><a href=#${id}>${header.headerText}</a>`;
    if (typeof header !== "undefined" && header.children && header.children.length) {
      html += nestedArrayToHtmlList(header.children);
    }
    html += "</li>";
  }
  html += "</ul>";
  return html;
};
var generateTableOfContents = (source, type) => {
  const headers = parseHeaders(source, type);
  return nestedArrayToHtmlList(headers);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateTableOfContents,
  nestedArrayToHtmlList,
  parseHeaders
});
//# sourceMappingURL=index.js.map
