import Discovr

private func selectProfile() async {}

private func sample(client: DiscovrClient) async throws {
    // docs:start
    // On a TV, ask for a bigger QR code: 600-800 pixels reads well across a room.
    let result = try await client.signInWithDeviceCode(qrSize: 700)
    print("Scan the QR code, or go to \(result.verificationUrl) and enter \(result.userCode)")
    // Render result.qrCode in your UI

    // The SDK polls in the background and reports when sign-in finishes.
    for await state in await client.authStateStream {
        if state.signedIn {
            print("Authenticated!")
            await selectProfile()
            break
        }
    }

    // Cancel polling when the user leaves the screen: result.cancel()
    // docs:end
}
