# 门店与会员 API

这些接口使用 V1 client。查询分页时，把银豹响应中的 `postBackParameter` 原样传回下一次请求，别自己改字段名。。。。

## 门店

| SDK 方法 | Endpoint | 说明 |
| --- | --- | --- |
| `queryAllUsers(body)` | `userOpenApi/queryAllUser` | 用总部 appId 分页获取全部门店 |

## 会员查询与维护

| SDK 方法 | Endpoint | 说明 |
| --- | --- | --- |
| `queryCustomerByNumber(body)` | `customerOpenApi/queryByNumber` | 按会员号查询 |
| `queryCustomerByUid(body)` | `customerOpenApi/queryByUid` | 按 customerUid 查询完整资料 |
| `queryCustomerByTel(body)` | `customerOpenapi/queryBytel` | 按手机号查询（endpoint 大小写按银豹原文保留） |
| `queryCustomerPages(body)` | `customerOpenApi/queryCustomerPages` | 分页查询会员 |
| `addCustomer(body)` | `customerOpenApi/add` | 新增会员 |
| `updateCustomerBaseInfo(body)` | `customerOpenApi/updateBaseInfo` | 修改基础资料 |
| `updateCustomerBalancePoint(body)` | `customerOpenApi/updateBalancePointByIncrement` | 增量修改余额、积分 |
| `updateCustomerPassword(body)` | `customerOpenApi/updateCustomerPassword` | 修改会员密码 |

## 会员等级、充值和补贴

| SDK 方法 | Endpoint | 说明 |
| --- | --- | --- |
| `queryCustomerCategories(body)` | `customerOpenApi/queryAllCustomerCategory` | 查询会员等级 |
| `batchUpdateCustomerCategory(body)` | `customerOpenApi/batchUpdateCategory` | 批量修改等级 |
| `queryRechargeLogs(body)` | `customerOpenApi/queryAllRechargeLogs` | 查询所有通用金额充值记录 |
| `queryCustomerRechargeLog(body)` | `customerOpenApi/queryCustomerRechargeLog` | 按 customerUid 查询充值记录 |
| `querySubsidyChangeLogPages(body)` | `customerOpenApi/querySubsidyChangeLogPages` | 分页查询补贴发放记录 |

[返回目录](./README.md)
