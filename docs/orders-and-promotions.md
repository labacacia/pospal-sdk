# 订单、优惠券与预付卡 API

订单和优惠券的写操作应使用 V2 client。V1 文档也有部分查询接口，但 V2 是当前文档给出的签名和区域路由版本。

## 在线订单（V2）

| SDK 方法 | Endpoint |
| --- | --- |
| `addOnlineOrder(body)` | `orderOpenApi/addOnLineOrder` |
| `cancelOrder(body)` | `orderOpenApi/cancleOrder` |
| `shipOrder(body)` | `orderOpenApi/shipOrder` |
| `completeOrder(body)` | `orderOpenApi/completeOrder` |
| `queryOrderByNo(body)` | `orderOpenApi/queryOrderByNo` |
| `queryOrderById(body)` | `orderOpenApi/queryOrderById` |
| `queryOrderPages(body)` | `orderOpenApi/queryOrderPages` |

`cancleOrder` 是银豹接口本身的拼写，SDK 侧给它收成了 `cancelOrder`。这玩意儿别手动“修正”，服务端不认。。。。

## 优惠券（V2）

| SDK 方法 | Endpoint |
| --- | --- |
| `queryCouponPromotionByUid(body)` | `promotionOpenApi/queryCouponPromotionByUid` |
| `queryCouponPromotions(body)` | `promotionOpenApi/queryCouponPromotions` |
| `addCouponCode(body)` | `promotionOpenApi/promotion/addCouponcode` |
| `queryCustomerCouponCodePages(body)` | `promotionOpenApi/queryCustomerCouponCodePage` |
| `queryUsedPromotionCodePages(body)` | `promotionOpenApi/queryUsedPromotionCode` |
| `queryPromotionPages(body)` | `promotionOpenApi/queryPromotionPages` |
| `usePromotionCouponCode(body)` | `promotionOpenApi/promotioncouponcode/use` |

## 预付卡（V1）

| SDK 方法 | Endpoint |
| --- | --- |
| `queryPrepaidCardRulePages(body)` | `PrepaidCardOpenApi/queryPrepaidCardRulePages` |
| `queryPrepaidCardPages(body)` | `PrepaidCardOpenApi/queryPrepaidCardPages` |
| `queryPrepaidCardSalePages(body)` | `PrepaidCardOpenApi/queryPrepaidCardSalePages` |

[返回目录](./README.md)
