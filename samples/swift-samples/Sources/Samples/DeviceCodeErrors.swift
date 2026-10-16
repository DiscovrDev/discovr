import Discovr

private func sample(client: DiscovrClient) async {
    // docs:start
    do {
        let result = try await client.signInWithDeviceCode()
        // Display result.userCode and result.qrCode to the user
        print("Code: \(result.userCode)")
    } catch AuthError.clientNotFound {
        print("Invalid client ID. Check your configuration.")
    } catch AuthError.rateLimited(let retryInSeconds) {
        print("Too many attempts. Try again in \(retryInSeconds)s.")
    } catch {
        print("Device code request failed: \(error)")
    }
    // docs:end
}
