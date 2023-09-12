interface Headers {
	headerText: string;
	children: Headers[];
}

type ContentType = 'md' | 'html';

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
const inputHeaders = (source: string, type: ContentType) => {
	if (type === 'md') {
		return getHeadersFromMarkdown(source);
	}
	if (type === 'html') {
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
	let currentHeader: Headers[] | undefined = headers;
	let currentLevel = 0;
	if (type === 'md') {
		currentLevel = htmlHeaders[0].split('#').length - 1;
	} else {
		currentLevel = parseInt(htmlHeaders[0].charAt(2));
	}

	for (const header of htmlHeaders) {
		let headerLevel: number;
		let headerText: string;

		if (type === 'md') {
			headerLevel = header.split('#').length - 1;
		} else {
			headerLevel = parseInt(header.charAt(2));
		}

		if (type === 'md') {
			headerText = header
				.replace(/#{1,6}/g, '')
				.replace(/\n/g, '')
				.replace(/ {2}/g, ' ')
				.trim();
		} else {
			headerText = header
				.replace(/<[^>]*>/g, '')
				.trim()
				.replace(/\n\s*/g, ' ')
				.replace(/ {2}/g, ' ');
		}

		// console.log(headerText, headerLevel);
		if (headerLevel === currentLevel && currentHeader) {
			currentHeader.push({ headerText: headerText, children: [] });
		} else if (headerLevel > currentLevel && currentHeader) {
			currentHeader[currentHeader.length - 1].children = [
				{ headerText, children: [] },
			];
			currentHeader = currentHeader[currentHeader.length - 1].children;
			currentLevel = headerLevel;
		} else if (headerLevel < currentLevel) {
			currentHeader = headers;
			for (let i = 1; i < headerLevel; i++) {
				currentHeader =
					currentHeader[currentHeader.length - 1].children;
			}
			currentLevel = headerLevel;
			currentHeader.push({ headerText: headerText, children: [] });
		}
	}
	return headers;
};

// convert nested array to html list
export const nestedArrayToHtmlList = (headers: Headers[]) => {
	let html = '<ul>';

	for (const header of headers) {
		const id = header.headerText
			.replace(/\s/g, '-')
			.replace(/:/g, '')
			.toLowerCase();

		html += `<li><a href=#${id}>${header.headerText}</a>`;

		if (
			typeof header !== 'undefined' &&
			header.children &&
			header.children.length
		) {
			html += nestedArrayToHtmlList(header.children);
		}

		html += '</li>';
	}

	html += '</ul>';

	return html;
};

// export final function
export const generateTableOfContents = (source: string, type: ContentType) => {
	const headers = parseHeaders(source, type);
	return nestedArrayToHtmlList(headers);
};
