import { TextDecoder, TextEncoder } from 'util';
import '@testing-library/jest-dom';

// jsdom does not provide these, but react-router needs them
Object.assign(globalThis, { TextEncoder, TextDecoder });
