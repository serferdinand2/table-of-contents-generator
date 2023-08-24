const getHeadersFromURL = async (url: string) => {
  // load url
  const response = await fetch(url);
  const html = await response.text();
  const headers = html.match(/<h[1-6].*?>(.*?)<\/h[1-6]>/g);
  return headers;
};

const getHeadersFromHTML = async (html: string) => {
  const headers = html.match(/<h[1-6].*?>(.*?)<\/h[1-6]>/g);
  return headers;
};

const getHeadersFromMarkdown = async (markdown: string) => {
  // load markdown
  const headers = markdown.match(/#{1,6}.*?\n/g);

  return headers;
};

export default [getHeadersFromURL, getHeadersFromMarkdown, getHeadersFromHTML];
