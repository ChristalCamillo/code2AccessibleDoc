function downloadTextAsFile(filename: string, text: string) {
	const element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function downloadTextAsPdf(filename: string, text: string) {
	const printWindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
	if (!printWindow) return;
	printWindow.document.write(`
	<head>
		<style>
			@page {
				size:  auto;
				margin: 0mm;
			}
			body {
				margin: 10mm 15mm 10mm 15mm;
			}
		</style>
	</head>
	<body>${text}</body>
	`);
	printWindow.document.title = filename;
	printWindow.document.close();
	printWindow.focus();
	printWindow.print();
	printWindow.close();
}

export { downloadTextAsFile, downloadTextAsPdf };
