export function escapeMarkdown(text: string): string {
	return text.replace(/\|/g, "\\|").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}

function escapeMdxBraces(text: string): string {
	return text.replace(/{/g, "&#123;").replace(/}/g, "&#125;");
}

/** MDX-safe prose outside strict table contexts (braces + angle brackets). */
export function sanitizeMdxProse(text: string): string {
	const t = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return escapeMdxBraces(t);
}

/** Table cells and param descriptions: MDX + markdown table safety. */
export function cleanDescription(text: string): string {
	const normalized = text.trim().replace(/\n\s+/g, " ").replace(/\s+/g, " ");
	const withAngles = normalized.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return escapeMarkdown(escapeMdxBraces(withAngles));
}

export function toKebabCase(str: string): string {
	return str
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
		.toLowerCase()
		.replace(/[()]/g, "");
}

export function toAnchorId(str: string): string {
	return str.toLowerCase().replace(/[()]/g, "").replace(/\s+/g, "-");
}

export function operationIdToFileName(operationId: string): string {
	return operationId
		.replace(/([A-Z])/g, "-$1")
		.toLowerCase()
		.replace(/^-/, "");
}
