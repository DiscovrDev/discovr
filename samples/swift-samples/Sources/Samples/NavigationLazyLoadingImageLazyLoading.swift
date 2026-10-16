import Discovr
import SwiftUI

// docs:start
// SwiftUI view that loads the poster lazily
struct MediaItemImage: View {
    let posterPath: [String: String]

    var body: some View {
        AsyncImage(url: URL(string: posterPath["w185"] ?? "")) { image in // Pick the size you need — see the Tip below
            image
                .resizable()
                .scaledToFill()
        } placeholder: {
            Color.gray
        }
    }
}

// Or with custom URLSession to control cache/loading
// docs:end
