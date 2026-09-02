# 销售单与收银员 API

使用 V1 client。

## 支付方式和单据

| SDK 方法 | Endpoint |
| --- | --- |
| `queryAllPayMethods(body)` | `ticketOpenApi/queryAllPayMethod` |
| `queryMyPayMethods(body)` | `ticketOpenApi/queryMyPayMethod` |
| `queryTicketBySn(body)` | `ticketOpenApi/queryTicketBySn` |
| `queryTicketByUid(body)` | `ticketOpenApi/queryTicketByUid` |
| `queryTicketPages(body)` | `ticketOpenApi/queryTicketPages` |
| `queryCustomerHistoryTickets(body)` | `ticketOpenApi/queryCustomerHistoryTicketsByUid` |
| `queryTicketByOrderNo(body)` | `ticketOpenApi/queryTicketByOrderNo` |

## 销售单与退货单关联

| SDK 方法 | Endpoint |
| --- | --- |
| `queryRefundTicketBySellTicketUid(body)` | `ticketOpenApi/queryRefunTicketBySellTicketUid` |
| `queryRefundTicketBySellTicketSn(body)` | `ticketOpenApi/queryRefunTicketBySellTicketSn` |
| `querySellTicketByRefundTicketUid(body)` | `ticketOpenApi/querySellTicketByRefunTicketUid` |
| `querySellTicketByRefundTicketSn(body)` | `ticketOpenApi/querySellTicketByRefunTicketSn` |

## 收银员

| SDK 方法 | Endpoint |
| --- | --- |
| `queryAllCashiers(body)` | `cashierOpenApi/queryAllCashier` |

[返回目录](./README.md)
