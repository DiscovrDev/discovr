/* tslint:disable */
/* eslint-disable */
// Public surface — only DiscovrClient and its supporting model types are exported.
// _DiscovrAuth and _DiscovrClientBase are internal implementation details.
export { DiscovrClient } from './DiscovrClient';
export type {
  DiscovrClientConfig,
  AuthState,
  DeviceCodeOptions,
  DeviceCodeResult,
  SessionState,
  SignOutReason,
} from './DiscovrClient';
// The value to pass onward for an item Discovr returned -- see its doc comment.
export { idOf, refOrId } from './DiscovrClient';
export {
    DiscovrError,
    SessionExpiredError,
    SessionConsumedError,
    ClientNotFoundError,
    DeviceCodeExpiredError,
    DeviceCodeConsumedError,
    DeviceCodeDeniedError,
    AuthCancelledError,
    TokenInvalidError,
    NotSignedInError,
    NoProfileSelectedError,
    AuthTimeoutError,
    RateLimitedError,
    RequestLoopError,
} from './errors';
export { DiscovrCacheStaleGenerationError } from './_DiscovrCache';
// HTTP-level failures from data calls. Exported so callers can branch on
// `err.response.status` with a real type instead of duck-typing.
export { ResponseError, FetchError, RequiredError } from './runtime';
export * from './models/index';
