import { TAG_CONFIG } from "../facade/config";
import { SDK_METHOD_METADATA } from "../facade/sdk-method-metadata";
import type { OasOperation, OpenAPISpec } from "../facade/types";
import { operationIdToFileName } from "./helpers";
import { getSubGroupedOps } from "./operations";

export function buildNavigationGroups(
	spec: OpenAPISpec,
	operationsByTag: Map<string, OasOperation[]>,
	typesPageSlugs: string[],
): any[] {
	const groups: any[] = [
		{
			group: "Getting Started",
			icon: "rocket",
			pages: ["sdk-reference/index"],
		},
	];

	// Authentication: hand-maintained auth SDK methods grouped into sub-sections
	const authConfig = TAG_CONFIG["Authentication"];
	const authSubGroups: Record<string, any> = {
		"sign-in-flows": { group: "Sign-in Flows", icon: "log-in", pages: [] },
		"profile-management": { group: "Profile Management", icon: "users", pages: [] },
		"state-and-session": { group: "State & Session", icon: "activity", pages: [] },
	};
	for (const method of SDK_METHOD_METADATA) {
		const fileName = operationIdToFileName(method.id);
		const filePath = `sdk-reference/authentication/${fileName}`;
		const category = (method as any).authCategory ?? "sign-in-flows";
		if (authSubGroups[category]) authSubGroups[category].pages.push(filePath);
	}

	// Authentication: spec-driven ops (tagged "Authentication" in the OpenAPI spec)
	// that back the hand-maintained flows above — e.g. requestDeviceCode/pollDeviceCode
	// under the device-code sign-in flow, signOutSession under the signOut method.
	const AUTH_OP_CATEGORY: Record<string, string> = {
		requestDeviceCode: "sign-in-flows",
		pollDeviceCode: "sign-in-flows",
		authorizeClientWeb: "sign-in-flows",
		mintSessionToken: "sign-in-flows",
		startDemoSession: "sign-in-flows",
		signOutSession: "state-and-session",
	};
	for (const op of operationsByTag.get("Authentication") ?? []) {
		if (!op.operationId) continue;
		const fileName = operationIdToFileName(op.operationId);
		const filePath = `sdk-reference/authentication/${fileName}`;
		const category = AUTH_OP_CATEGORY[op.operationId] ?? "sign-in-flows";
		if (authSubGroups[category]) authSubGroups[category].pages.push(filePath);
	}
	groups.push({
		group: "Authentication",
		icon: authConfig?.icon ?? "key",
		pages: Object.values(authSubGroups).filter((sg) => sg.pages.length > 0),
	});

	// All other tags in TAG_CONFIG order
	const sortedTags = Object.entries(TAG_CONFIG)
		.filter(([tag]) => tag !== "Authentication")
		.sort(([, a], [, b]) => a.order - b.order);

	for (const [tag, cfg] of sortedTags) {
		const ops = operationsByTag.get(tag);
		if (!ops?.length) continue;

		const subGrouped = getSubGroupedOps(ops);
		const hasSubGroups = [...subGrouped.keys()].some((k) => k !== "");

		if (hasSubGroups) {
			const subGroupPages: any[] = [];
			const ungrouped = subGrouped.get("") ?? [];
			for (const op of ungrouped) {
				if (op.operationId) {
					subGroupPages.push(
						`sdk-reference/${cfg.sdkFile}/${operationIdToFileName(op.operationId)}`,
					);
				}
			}
			for (const [groupName, groupOps] of subGrouped.entries()) {
				if (!groupName) continue;
				const subPages = groupOps
					.filter((o) => o.operationId)
					.map((o) => `sdk-reference/${cfg.sdkFile}/${operationIdToFileName(o.operationId!)}`);
				subGroupPages.push({ group: groupName, icon: "list", pages: subPages });
			}
			groups.push({ group: tag, icon: cfg.icon, pages: subGroupPages });
		} else {
			const pages = ops
				.filter((o) => o.operationId)
				.map((o) => `sdk-reference/${cfg.sdkFile}/${operationIdToFileName(o.operationId!)}`);
			groups.push({ group: tag, icon: cfg.icon, pages });
		}
	}

	// Tags in the spec not in TAG_CONFIG — still generate with defaults
	for (const [tag, ops] of operationsByTag.entries()) {
		if (tag === "Authentication" || TAG_CONFIG[tag]) continue;
		const sdkFile = tag.toLowerCase().replace(/\s+/g, "-");
		const pages = ops
			.filter((o) => o.operationId)
			.map((o) => `sdk-reference/${sdkFile}/${operationIdToFileName(o.operationId!)}`);
		groups.push({ group: tag, icon: "file-text", pages });
	}

	groups.push({
		group: "Types",
		icon: "brackets-curly",
		pages: typesPageSlugs.map((slug) => `sdk-reference/types/${slug}`),
	});

	return groups;
}
