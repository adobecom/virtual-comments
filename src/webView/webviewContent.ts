import template from '../config/templates';

export function getWebViewContent(comments: { lineNumber: number; text: string; }[]) {
	let innerDivs = '';
	const keepButton = template.keepButton;
	const editButton = template.editButton;
	const deleteButton = template.deleteButton;
	comments.forEach(comment => {
		innerDivs+=`<div class="comment">
			<div>
				Line
				<span>${comment.lineNumber}</span>
				-
				<span id="text">${comment.text}</span>
			</div>
			<div>
				${keepButton}
				${editButton}
				${deleteButton}
			</div>
			
		</div>`;
	});
    return template.webviewHTML1 + `${innerDivs}` + template.webviewHTML2;
}