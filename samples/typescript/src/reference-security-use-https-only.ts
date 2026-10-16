import { DiscovrClient } from "discovr";

export async function sample() {
	// docs:start
	// Good: HTTPS redirect
	const redirectUri = "https://myapp.com/auth/callback";

	// Good: localhost development
	const devRedirectUri = "http://localhost:3000/auth/callback";

	// Bad: HTTP production
	const badRedirectUri = "http://myapp.com/auth/callback"; // ❌ Don't do this
	// docs:end
}
