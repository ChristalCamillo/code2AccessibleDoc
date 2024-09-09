export interface ContentInPath {
	name?: string;
	path?: string;
	download_url?: string;
	url?: string;
	type: 'dir' | 'file';
}

export interface ContentToFeed {
	path: string;
	content: string;
}

async function ghFetch(url: string, withAuth = true) {
	const ghKey = import.meta.env.VITE_GH_TOKEN;
	const res = await fetch(url, {
		headers: {
			...(withAuth ? { Authorization: `Bearer ${ghKey}` } : {}),
			Accept: 'application/vnd.github.v3.raw'
		}
	});
	return res;
}

async function fetchDataFromRepo(normalRepoUrl: string) {
	try {
		const apiRepoUrl = turnNormalRepoIntoApiRepo(normalRepoUrl);
		const readableFiles = [] as ContentInPath[];
		await fetchAllReadableFilesFromRepo(`${apiRepoUrl}/contents`, readableFiles);
		const contentToFeed = await turnReadableFilesIntoFeedContent(readableFiles);
		return contentToFeed;
	} catch (error) {
		console.log(error);
		return [];
	}
}

function turnNormalRepoIntoApiRepo(normalRepoUrl: string) {
	// eslint-disable-next-line no-useless-escape
	const re = new RegExp(/https\:\/\/github.com\/(.+?)\/(.+)/);
	const matches = normalRepoUrl.match(re);
	const username = matches?.[1]?.split?.('/')?.[0];
	const repo = matches?.[2]?.split?.('/')?.[0];

	if (!username || !repo) return '';

	const repoApiUrl = `https://api.github.com/repos/${username}/${repo}`;
	return repoApiUrl;
}

async function fetchContentsFromRepoPath(pathUrl: string) {
	const res = await ghFetch(pathUrl);
	const data = await res?.json?.();
	return data as ContentInPath[];
}

async function fetchAllReadableFilesFromRepo(repoUrl: string, filesToRead: ContentInPath[] = []) {
	const contentsInPath = await fetchContentsFromRepoPath(repoUrl);
	for (let i = 0; i < contentsInPath.length; i++) {
		const content = contentsInPath[i];
		const fileExtension = (content?.name || '')?.split('.')?.at(-1) || '';
		const extensionsToIgnore = [
			'jpg',
			'jpeg',
			'svg',
			'png',
			'gif',
			'webp',
			'mp4',
			'mkv',
			'avi',
			'mp3',
			'ico'
		];
		if (extensionsToIgnore.includes(fileExtension)) {
			continue;
		}
		if (content.type === 'file') {
			filesToRead.push(content);
		} else {
			await fetchAllReadableFilesFromRepo(content?.url || '', filesToRead);
		}
	}
}

async function turnReadableFilesIntoFeedContent(readableFiles: ContentInPath[]) {
	const contentToFeed: ContentToFeed[] = [];

	for (let i = 0; i < readableFiles.length; i++) {
		const fileData = readableFiles[i];
		if (!fileData?.download_url || !fileData?.path) continue;
		const res = await ghFetch(fileData?.download_url, false);
		const textContent = await res?.text();

		contentToFeed.push({
			path: fileData.path,
			content: textContent
		});
	}

	return contentToFeed;
}

export { fetchDataFromRepo };
