export interface LangSnippets {
	typescript: string;
	kotlin: string;
	swift: string;
}

export interface FacadeSamples {
	[operationId: string]: LangSnippets;
}

export interface MethodDoc {
	operationId: string;
	summary: string;
	description: string;
	params: Array<{ name: string; type: string; required: boolean; description: string }>;
	returns: { type: string; description: string };
	snippets: LangSnippets;
}

/**
 * Per-language values where `null` means "this language genuinely doesn't have
 * it" — as opposed to an empty string, which would render an empty tab.
 */
export interface OptionalLangSnippets {
	typescript: string | null;
	kotlin: string | null;
	swift: string | null;
}

export interface OptionalLangSignature {
	typescript: string | null;
	kotlin: string | null;
	swift: string | null;
}
