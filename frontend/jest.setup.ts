import { TextDecoder, TextEncoder } from 'util';
import { deserialize, serialize } from 'v8';
import '@testing-library/jest-dom';

// jsdom does not provide these, but react-router needs them
Object.assign(globalThis, { TextEncoder, TextDecoder });

// jsdom does not provide structuredClone (real browsers do), our API uses it
Object.assign(globalThis, {
  structuredClone: <T>(value: T): T => deserialize(serialize(value)),
});
