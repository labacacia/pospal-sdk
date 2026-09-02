import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { PospalApiError, PospalClient } from '../src/index.js';

const md5 = (value) => createHash('md5').update(value).digest('hex').toUpperCase();

test('V1 signs and sends exactly the same JSON body', async () => {
  let call;
  const client = new PospalClient({ appId: 'shop', appKey: 'secret', baseUrl: 'https://api.example/pospal-api2/openapi/v1', fetch: async (url, init) => {
    call = { url, ...init };
    return new Response(JSON.stringify({ status: 'success', data: { ok: true } }));
  } });
  const result = await client.queryProductByBarcode({ barcode: '123' });
  assert.equal(call.url, 'https://api.example/pospal-api2/openapi/v1/productOpenApi/queryProductByBarcode');
  assert.equal(call.body, '{"appId":"shop","barcode":"123"}');
  assert.equal(call.headers['data-signature'], md5(`secret${call.body}`));
  assert.deepEqual(result.data, { ok: true });
});

test('V2 derives area endpoint and uses V3 signing', async () => {
  let call;
  const client = new PospalClient({ appId: 'shop', appKey: 'secret', areaId: '01', version: 'v2', fetch: async (url, init) => {
    call = { url, ...init };
    return new Response(JSON.stringify({ status: 'success' }));
  } });
  await client.completeOrder({ orderNo: 'O-1' });
  assert.equal(call.url, 'https://openapi01.pospal.cn/openinterface/orderOpenApi/completeOrder');
  assert.equal(call.headers['data-signature-v3'], md5(`shopsecret${call.headers['time-stamp']}${call.body}`));
});

test('API errors retain PosPal error details', async () => {
  const client = new PospalClient({ appId: 'shop', appKey: 'secret', baseUrl: 'https://api.example/pospal-api2/openapi/v1', fetch: async () => new Response(JSON.stringify({ status: 'error', errorCode: 42, messages: ['bad request'] })) });
  await assert.rejects(() => client.queryAllCashiers(), (error) => error instanceof PospalApiError && error.errorCode === 42);
});
