import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const { images } = await client.getProfileImages();
	const avatarUrl = images[0]; // user’s pick from your picker

	const { profileId } = await client.createProfile("Alex", avatarUrl);
	await client.selectProfile(profileId);
	// docs:end
}
