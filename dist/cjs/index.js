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
  inputHeaders: () => inputHeaders,
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
  let currentHeaderArray = headers;
  let currentLevel = 0;
  if (type === "md") {
    currentLevel = htmlHeaders[0].split("#").length - 1;
  } else {
    currentLevel = parseInt(htmlHeaders[0].charAt(2));
  }
  const levelController = currentLevel - 1;
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
    const id = `#${headerText.replace(/[^\w\s-]|_/g, "").replace(/\s/g, "-").replace(/:/g, "").toLowerCase()}`;
    if (headerLevel === currentLevel && currentHeaderArray) {
      currentHeaderArray.push({ headerText, id, children: [] });
    } else if (headerLevel > currentLevel && currentHeaderArray) {
      currentHeaderArray[currentHeaderArray.length - 1].children = [
        { headerText, id, children: [] }
      ];
      currentHeaderArray = currentHeaderArray[currentHeaderArray.length - 1].children;
      currentLevel = headerLevel;
    } else if (headerLevel < currentLevel) {
      currentHeaderArray = headers;
      for (let i = 1; i < headerLevel - levelController; i++) {
        currentHeaderArray = currentHeaderArray[currentHeaderArray.length - 1].children;
      }
      currentLevel = headerLevel;
      currentHeaderArray.push({ headerText, id, children: [] });
    }
  }
  return headers;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  inputHeaders,
  parseHeaders
});
//# sourceMappingURL=index.js.map
