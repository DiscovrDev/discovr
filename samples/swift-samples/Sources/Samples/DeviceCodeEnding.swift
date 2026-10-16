import Discovr

private func sample(client: DiscovrClient) async throws {
    // docs:start
    let result = try await client.signInWithDeviceCode()

    do {
        // Returns once the person approves on their phone.
        try await result.completion()
        print("Signed in.")
    } catch AuthError.deviceCodeDenied {
        print("They declined on their phone. Say so, and offer a new code.")
    } catch AuthError.deviceCodeExpired {
        print("The code ran out. Show a fresh one.")
    } catch AuthError.cancelled {
        print("You stopped the flow with cancel(). Nothing to show.")
    }
    // docs:end
}
