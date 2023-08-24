import getHeaders from "./getHeaders";

interface NestedHeaders {
  headerText: string;
  children?: NestedHeaders[];
}

// get headers from url, md, or html
const inputHeaders = (source: string, type: "url" | "md" | "html") => {
  if (type === "url") {
    return getHeaders[0](source);
  }
  if (type === "md") {
    return getHeaders[1](source);
  }
  if (type === "html") {
    return getHeaders[2](source);
  }
};

//
const headersListWith = async (
  source: string,
  type: "url" | "md" | "html"
): Promise<{ headerText: string; children?: any[] }[]> => {
  // get all headers
  const htmlHeaders = await inputHeaders(source, type);
  if (!htmlHeaders) {
    return [];
  }

  // nest headers
  const nestedHeaders: NestedHeaders[] | undefined = [];
  let currentHeader: NestedHeaders[] | undefined = nestedHeaders;
  let currentLevel = parseInt(htmlHeaders[0].charAt(2));
  for (const header of htmlHeaders) {
    let headerLevel: number;
    let headerText: string;
    if (type === "md") {
      headerLevel = header.split("#").length - 1;
    } else {
      headerLevel = parseInt(header.charAt(2));
    }
    if (type === "md") {
      headerText = header
        .replace(/#{1,6}/g, "")
        .replace(/\n/g, "")
        .trimStart();
    } else {
      headerText = header.replace(/<[^>]*>/g, "");
    }
    console.log(headerText, headerLevel);
    if (headerLevel === currentLevel && currentHeader) {
      currentHeader.push({ headerText: headerText, children: [] });
    } else if (headerLevel > currentLevel && currentHeader) {
      currentHeader[currentHeader.length - 1].children = [{ headerText }];
      currentHeader = currentHeader[currentHeader.length - 1].children;
      currentLevel = headerLevel;
    } else if (headerLevel < currentLevel) {
      currentHeader = nestedHeaders;
      for (let i = 1; i < headerLevel; i++) {
        currentHeader = currentHeader[currentHeader.length - 1].children!;
      }
      currentLevel = headerLevel;
      currentHeader.push({ headerText: headerText, children: [] });
    }
  }
  return nestedHeaders;
};
// convert nested array to html list
const nestedArrayToHtmlList = (headers: any[]) => {
  let html = "<ul>";
  for (const header of headers) {
    let id = header.headerText
      .replace(/\s/g, "-")
      .replace(/\:/g, "")
      .toLowerCase();
    html += `<li> <a href=#${id}>${header.headerText}</a>`;
    if (header.children?.length > 0) {
      html += nestedArrayToHtmlList(header.children);
    }
    html += "</li>";
  }
  html += "</ul>";
  return html;
};
// export final function
export const tableOfContents = async (
  source: string,
  type: "url" | "md" | "html"
) => {
  const headers = await headersListWith(source, type);
  return nestedArrayToHtmlList(headers);
};
