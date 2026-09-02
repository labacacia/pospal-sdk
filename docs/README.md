# PosPal API Browser

这里是 SDK 已封装接口的索引。方法都返回银豹原始响应：

```js
const response = await pospal.queryProductByBarcode({ barcode: '6901234567890' });
console.log(response.data);
```

请求体参数以银豹文档为准，直接作为方法的 `body` 传入；SDK 会自动补 `appId`、时间戳和签名。

## 选择版本

| 场景 | `version` | 地址配置 | 签名请求头 |
| --- | --- | --- | --- |
| 门店、会员、商品、盘点、销售单、货流等 | `v1`（默认） | `baseUrl`，必须是银豹下发的完整 `/pospal-api2/openapi/v1` 地址 | `data-signature` |
| 网单、优惠券 V2 | `v2` | `areaId`，或完整 `/openinterface` `baseUrl` | `data-signature-v3` |

```js
import { PospalClient } from 'pospal-openapi-sdk';

const v1 = new PospalClient({
  appId: process.env.POSPAL_APP_ID,
  appKey: process.env.POSPAL_APP_KEY,
  baseUrl: process.env.POSPAL_V1_BASE_URL
});

const v2 = new PospalClient({
  appId: process.env.POSPAL_APP_ID,
  appKey: process.env.POSPAL_APP_KEY,
  version: 'v2',
  areaId: process.env.POSPAL_AREA_ID
});
```

## 目录

- [门店与会员](./customers.md)
- [商品与盘点](./products.md)
- [销售单与收银员](./tickets.md)
- [订单、优惠券与预付卡](./orders-and-promotions.md)
- [货流、访问量与通知](./operations.md)

## 通用调用

SDK 没有命名封装的新接口，或者银豹后来偷偷加了个接口，可以直接调用：

```js
await v1.request('someOpenApi/someMethod', {
  // 按银豹接口文档填写请求体
});
```

业务失败（`status: "error"`）默认抛出 `PospalApiError`；HTTP 失败、超时或非 JSON 响应抛出 `PospalHttpError`。如果你想自行看错误响应，初始化时传 `throwOnApiError: false`。
