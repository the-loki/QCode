import assert from "node:assert/strict";
import { test } from "vitest";
import { QCODE_PROTOCOL_NAME, QCODE_PROTOCOL_VERSION } from "../src/qcode-protocol/index.js";
import {
  QCODE_RPC_CLIENT_MODE_HEADER,
  QCODE_RPC_HOST_CAPABILITY_HEADER,
} from "../src/channels.js";
import { OPENROUTER_ATTRIBUTION_HEADERS } from "../src/openrouter-attribution.js";

// wire 契约钉:握手串与头名的唯一权威来自这些常量,host/CLI/server 各端共用。
// 更名(qcode)后防止任何一端回退旧字符串导致链路握手/鉴权失败。
test("wire handshake constant uses the QCode protocol name", () => {
  assert.equal(QCODE_PROTOCOL_NAME, "QCode Protocol");
  assert.equal(QCODE_PROTOCOL_VERSION, 1);
});

test("rpc headers use x-qcode-* names", () => {
  assert.equal(QCODE_RPC_CLIENT_MODE_HEADER, "x-qcode-rpc-client-mode");
  assert.equal(QCODE_RPC_HOST_CAPABILITY_HEADER, "x-qcode-rpc-host-capability");
});

test("openrouter attribution title uses the QCode brand", () => {
  assert.equal(OPENROUTER_ATTRIBUTION_HEADERS["X-OpenRouter-Title"], "QCode");
});
