import './style.css';
import { completeWithGroq } from './api/groq';
import { fetchDataFromRepo } from './api/github';
import { marked } from 'marked';
import { downloadTextAsFile, downloadTextAsPdf } from './utils/utils';

document?.addEventListener('DOMContentLoaded', function () {
	let repoUrl = '';
	let isValidUrl = false;
	let loading = false;
	let resultInMd = '';
	let resultInHtml = '';
	checkViewState();

	function revalidateUrl() {
		const githubUrlRE = new RegExp(/https:\/\/github.com\/(.+?)\/(.+)/);
		isValidUrl = githubUrlRE.test(repoUrl);
		const btn = document?.querySelector('#button-submit') as HTMLButtonElement;
		if (btn) {
			btn.disabled = !isValidUrl;
		}
	}

	async function submitCreation() {
		loading = true;
		checkViewState();
		const reposToFeed = await fetchDataFromRepo(repoUrl);
		const message = await completeWithGroq(reposToFeed);
		const messageInMD = await marked(message || '');
		resultInMd = message;
		resultInHtml = messageInMD;
		loading = false;
		checkViewState();
	}

	function eventTextAsMd() {
		downloadTextAsFile('documentation.md', resultInMd);
	}

	function addDownloadTextAsMd() {
		document?.querySelector('#button-md')?.removeEventListener('click', eventTextAsMd);
		document?.querySelector('#button-md')?.addEventListener('click', eventTextAsMd);
	}

	function eventTextAsPdf() {
		downloadTextAsPdf('documentation', resultInHtml);
	}

	function addDownloadTextAsPdf() {
		document?.querySelector('#button-pdf')?.removeEventListener('click', eventTextAsPdf);
		document?.querySelector('#button-pdf')?.addEventListener('click', eventTextAsPdf);
	}

	function addSubmitCreation() {
		document?.querySelector('#button-submit')?.removeEventListener('click', submitCreation);
		document?.querySelector('#button-submit')?.addEventListener('click', submitCreation);
	}

	function eventInputWatch() {
		const newValue = document?.querySelector('input')?.value || '';
		repoUrl = newValue;
		revalidateUrl();
	}

	function addInputWatch() {
		document?.querySelector('input')?.removeEventListener('change', eventInputWatch);
		document?.querySelector('input')?.addEventListener('change', eventInputWatch);
	}

	function checkViewState() {
		const loadingDiv = document?.querySelector('.loading');
		const resultsDiv = document?.querySelector('.results');
		const mainDiv = document?.querySelector('.main-input');

		loadingDiv?.classList?.add('hidden');
		resultsDiv?.classList?.add('hidden');
		mainDiv?.classList?.add('hidden');

		if (loading) {
			loadingDiv?.classList?.remove('hidden');
		} else if (resultInMd?.length) {
			resultsDiv?.classList?.remove('hidden');
			const article = resultsDiv?.querySelector('article');
			if (article) {
				article.innerHTML = resultInHtml;
			}
		} else {
			mainDiv?.classList?.remove('hidden');
		}

		addDownloadTextAsMd();
		addDownloadTextAsPdf();
		addSubmitCreation();
		addInputWatch();
	}
});
