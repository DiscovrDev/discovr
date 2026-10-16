// Stand-ins for the pieces of an app that the guides assume already exist: the
// shared client, UI helpers and values handed over from an earlier step. They
// are declared only so each sample compiles; the guides never show them.

declare const client: import("discovr").DiscovrClient;

type Item = import("discovr").MediaItem;

declare const homePageId: string;
declare const item: Item;
declare const tile: Item;
declare const savedRef: string;
declare const token: string;
declare const progress: number;
declare const tabPageIds: Record<string, string>;
declare const pageFilters: import("discovr").FilterSpec;
declare const rows: import("discovr").Row[];
declare const items: import("discovr").RowItem[];
declare const aliceId: string;
declare const bobId: string;
declare const romanceItem: import("discovr").NavigationItem;
declare const navigationStack: { id: string; name?: string }[];

declare function renderPage(...args: any[]): void;
declare function renderHero(...args: any[]): void;
declare function renderRow(...args: any[]): void;
declare function renderRowError(...args: any[]): void;
declare function renderItems(...args: any[]): void;
declare function renderContinueWatchingRow(...args: any[]): void;
declare function renderTitle(...args: any[]): void;
declare function renderPerson(...args: any[]): void;
declare function render(...args: any[]): void;
declare function appendItems(...args: any[]): void;
declare function showToast(...args: any[]): void;
declare function showError(...args: any[]): void;
declare function showEmptyState(...args: any[]): void;
declare function showSignInUI(...args: any[]): void;
declare function showLoadingIndicator(...args: any[]): void;
declare function hideLoadingIndicator(...args: any[]): void;
declare function restartPagination(...args: any[]): void;
declare function markRecommendationsStale(...args: any[]): void;
declare function loadPageEfficiently(...args: any[]): Promise<void>;
declare function loadHomePageEfficiently(...args: any[]): Promise<void>;
declare function navigate(...args: any[]): void;
declare function useParams(): Record<string, string>;
declare function useLocation(): { state?: { ref?: string } };

declare const input: HTMLInputElement;
declare const response: import("discovr").SearchResponse;
declare function redirectTo(...args: any[]): void;
