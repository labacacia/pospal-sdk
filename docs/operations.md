# 货流、访问量与通知 API

使用 V1 client。

## 货流

| SDK 方法 | Endpoint |
| --- | --- |
| `queryProductRequestPages(body)` | `stockFlowOpenApi/queryProductRequestPages` |
| `queryProductRequestById(body)` | `stockFlowOpenApi/queryProductRequestById` |
| `queryStockFlowPages(body)` | `stockFlowOpenApi/queryStockFlowPages` |
| `queryStockFlowByProductRequestId(body)` | `stockFlowOpenApi/queryStockFlowDetailByProductReuqestId` |
| `queryStockFlowById(body)` | `stockFlowOpenApi/queryStockFlowDetailById` |
| `createStockFlow(body)` | `stockFlowOpenApi/createStockFlow` |
| `acceptStockFlowOut(body)` | `stockFlowOpenApi/acceptStockFlowOut` |
| `acceptStockFlowIn(body)` | `stockFlowOpenApi/acceptStockFlowIn` |
| `rejectStockFlowOut(body)` | `stockFlowOpenApi/rejectStockFlowOut` |
| `rejectStockFlowIn(body)` | `stockFlowOpenApi/rejectStockFlowIn` |
| `queryProductPurchasePages(body)` | `stockFlowOpenApi/queryProductPurchasePages` |

`queryStockFlowDetailByProductReuqestId` 里的 `Reuqest` 是官方 endpoint 的拼写，SDK 方法名已经修正为 `queryStockFlowByProductRequestId`。

## 访问量与推送地址

| SDK 方法 | Endpoint |
| --- | --- |
| `queryAccessTimes(body)` | `openApiLimitAccess/queryAccessTimes` |
| `queryDailyAccessTimesLog(body)` | `openApiLimitAccess/queryDailyAccessTimesLog` |
| `queryPushUrl(body)` | `openNotificationOpenApi/queryPushUrl` |
| `updatePushUrl(body)` | `openNotificationOpenApi/updatePushUrl` |

[返回目录](./README.md)
