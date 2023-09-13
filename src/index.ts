interface Headers {
  headerText: string;
  id: string;
  children: Headers[];
}

type ContentType = "md" | "html";

const getHeadersFromHTML = (html: string) => {
  const headerRegex = /<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g;
  const headers = html.match(headerRegex);
  return headers;
};

const getHeadersFromMarkdown = (markdown: string) => {
  // load markdown
  const headerRegex = /#{1,6}.*\n/g;
  const headers = markdown.match(headerRegex);

  return headers;
};

// get headers from html, or markdown
export const inputHeaders = (source: string, type: ContentType) => {
  if (type === "md") {
    return getHeadersFromMarkdown(source);
  }
  if (type === "html") {
    return getHeadersFromHTML(source);
  }
};

export const parseHeaders = (source: string, type: ContentType): Headers[] => {
  // get all headers
  const htmlHeaders = inputHeaders(source, type);
  if (!htmlHeaders || !htmlHeaders.length) {
    return [];
  }

  // nest headers
  const headers: Headers[] | undefined = [];
  let currentHeaderArray: Headers[] | undefined = headers;
  let currentLevel = 0;
  if (type === "md") {
    currentLevel = htmlHeaders[0].split("#").length - 1;
  } else {
    currentLevel = parseInt(htmlHeaders[0].charAt(2));
  }
  const levelController = currentLevel - 1;

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
        .replace(/ {2}/g, " ")
        .trim();
    } else {
      headerText = header
        .replace(/<[^>]*>/g, "")
        .trim()
        .replace(/\n\s*/g, " ")
        .replace(/ {2}/g, " ");
    }

    const id = `#${headerText
      .replace(/[^\w\s-]|_/g, "")
      .replace(/\s/g, "-")
      .replace(/:/g, "")

      .toLowerCase()}`;
    if (headerLevel === currentLevel && currentHeaderArray) {
      currentHeaderArray.push({ headerText: headerText, id, children: [] });
    } else if (headerLevel > currentLevel && currentHeaderArray) {
      currentHeaderArray[currentHeaderArray.length - 1].children = [
        { headerText, id, children: [] },
      ];
      currentHeaderArray =
        currentHeaderArray[currentHeaderArray.length - 1].children;
      currentLevel = headerLevel;
    } else if (headerLevel < currentLevel) {
      currentHeaderArray = headers;
      for (let i = 1; i < headerLevel - levelController; i++) {
        currentHeaderArray =
          currentHeaderArray[currentHeaderArray.length - 1].children;
      }
      currentLevel = headerLevel;
      currentHeaderArray.push({ headerText: headerText, id, children: [] });
    }
  }
  return headers;
};
