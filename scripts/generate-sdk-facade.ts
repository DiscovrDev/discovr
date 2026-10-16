/**
 * Thin entrypoint — façade logic lives in `public/scripts/facade/`.
 *
 * Writes `_DiscovrClientBase.*`, `facade-doc-samples.json`, and copies hand-maintained SDK shells.
 */

import { runFacadeGeneration } from "./facade/run";

runFacadeGeneration();
