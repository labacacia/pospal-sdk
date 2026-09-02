# pospal-sdk

[![Node.js 18+](https://img.shields.io/badge/node-%3E%3D18-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/npm/v/pospal-sdk?logo=npm)](https://www.npmjs.com/package/pospal-sdk)

银豹 PosPal Open Platform 的零依赖 Node.js SDK。把签名、时间戳、异常处理这些破事儿收起来，调用接口只管传文档里的业务 body 就行。。。。

支持 V1 的门店、会员、商品、盘点、销售单、收银员、货流、预付卡、通知等接口，也支持 V2 的网单和优惠券接口。

## 安装

```bash
npm install pospal-sdk
```

当前发布版本为 [`0.1.0`](https://www.npmjs.com/package/pospal-sdk)，后续正常按 npm 的 `latest` tag 更新即可。

也可以直接使用仓库的最新版本：

```bash
npm install github:labacacia/pospal-sdk
```

要求 Node.js 18+（使用原生 `fetch`）。

## 先跑一个商品查询

```js
import { PospalClient } from 'pospal-sdk';

const pospal = new PospalClient({
  appId: process.env.POSPAL_APP_ID,
  appKey: process.env.POSPAL_APP_KEY,
  // 银豹为门店分配的完整 V1 地址，不是文档里的 host:port 占位符
  baseUrl: process.env.POSPAL_V1_BASE_URL
});

const response = await pospal.queryProductByBarcode({
  barcode: '6901234567890'
});

console.log(response.data);
```

## V1 和 V2，不是一回事儿

| 场景 | 配置 | 请求地址 | 签名 |
| --- | --- | --- | --- |
| 门店、会员、商品、盘点、销售单、货流等 | 默认 `version: 'v1'` | 银豹提供的 `.../pospal-api2/openapi/v1` | `MD5(appKey + body)` |
| 网单与优惠券 | `version: 'v2'` + `areaId` | `https://openapi{areaId}.pospal.cn/openinterface` | `MD5(appId + appKey + timestamp + body)` |

V2 例子：

```js
const pospal = new PospalClient({
  appId: process.env.POSPAL_APP_ID,
  appKey: process.env.POSPAL_APP_KEY,
  version: 'v2',
  areaId: process.env.POSPAL_AREA_ID
});

await pospal.addOnlineOrder({ orderNo: 'ORDER-1001', products: [] });
await pospal.usePromotionCouponCode({ code: 'PROMO-CODE' });
```

SDK 只序列化一次 body：签名的内容和实际发送的内容是同一段 JSON。字段顺序、空格这种小事儿，在银豹签名这儿可不是小事儿。

## 常用接口

```js
await pospal.queryCustomerByTel({ tel: '13800138000' });
await pospal.queryCustomerPages({ pageIndex: 1, pageSize: 50 });
await pospal.addProduct({ /* 商品 body */ });
await pospal.queryTicketPages({ /* 查询条件 */ });
await pospal.createStockFlow({ /* 货流单 body */ });
```

完整接口索引在 [docs/](./docs/README.md)：按业务域列出了 SDK 方法、银豹原始 endpoint 和 V1/V2 使用范围。

银豹新增了接口、SDK 还没给它起方法名？直接这么调：

```js
await pospal.request('someOpenApi/someMethod', {
  // 按银豹接口文档填写 body
});
```

## 错误处理

业务响应 `status: "error"` 时默认抛出 `PospalApiError`，其中有 `errorCode`、`messages` 和原始 `response`。网络、超时、非 2xx 或非 JSON 响应则抛出 `PospalHttpError`。

```js
import { PospalApiError } from 'pospal-sdk';

try {
  await pospal.queryProductByBarcode({ barcode: 'not-found' });
} catch (error) {
  if (error instanceof PospalApiError) {
    console.error(error.errorCode, error.response.messages);
  }
}
```

需要自行处理业务失败响应时，创建 client 时加 `throwOnApiError: false`。

## 开发

```bash
npm test
```

测试覆盖 V1/V2 签名、V2 地址拼装和 API 错误透传。

## 参考

- [银豹开放平台](https://pospal.cn/openplatform/openplatform.html)
- [交互格式说明](https://pospal.cn/openplatform/interactiveformatdescription.html)
- [V2 交互格式说明](https://pospal.cn/openplatform/interactiveformatdescriptionV2.html)
