import assert from "node:assert/strict";
import { test } from "vitest";
import { ZCODE_PROTOCOL_NAME, ZCODE_PROTOCOL_VERSION } from "../src/zcode-protocol/index.js";
import {
  ZCODE_RPC_CLIENT_MODE_HEADER,
  ZCODE_RPC_HOST_CAPABILITY_HEADER,
} from "../src/channels.js";
import { OPENROUTER_ATTRIBUTION_HEADERS } from "../src/openrouter-attribution.js";

// wire 契约钉:握手串与头名的唯一权威来自这些常量,host/CLI/server 各端共用。
// 更名(qcode)后防止任何一端回退旧字符串导致链路握手/鉴权失败。
test("wire handshake constant uses the QCode protocol name", () => {
  assert.equal(ZCODE_PROTOCOL_NAME, "QCode Protocol");
  assert.equal(ZCODE_PROTOCOL_VERSION, 1);
});

test("rpc headers use x-qcode-* names", () => {
  assert.equal(ZCODE_RPC_CLIENT_MODE_HEADER, "x-qcode-rpc-client-mode");
  assert.equal(ZCODE_RPC_HOST_CAPABILITY_HEADER, "x-qcode-rpc-host-capability");
});

test("openrouter attribution title uses the QCode brand", () => {
  assert.equal(OPENROUTER_ATTRIBUTION_HEADERS["X-OpenRouter-Title"], "QCode");
});
