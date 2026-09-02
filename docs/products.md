# 商品与盘点 API

使用 V1 client。

## 商品

| SDK 方法 | Endpoint |
| --- | --- |
| `queryProductCategories(body)` | `productOpenApi/queryProductCategoryPages` |
| `addProductCategory(body)` | `productOpenApi/addCategory` |
| `updateProductCategory(body)` | `productOpenApi/updateCategory` |
| `queryProductImages(body)` | `productOpenApi/queryProductImagePages` |
| `queryProductImagesByBarcode(body)` | `productOpenApi/queryProductImagesByBarcode` |
| `queryProductImagesByUid(body)` | `productOpenApi/queryProductImagesByProductUid` |
| `queryProductByBarcode(body)` | `productOpenApi/queryProductByBarcode` |
| `queryProductByBarcodes(body)` | `productOpenApi/queryProductByBarcodes` |
| `queryProductByUid(body)` | `productOpenApi/queryProductByUid` |
| `queryProductPages(body)` | `productOpenApi/queryProductPages` |
| `addProduct(body)` | `productOpenApi/addProductInfo` |
| `updateProductInfo(body)` | `productOpenApi/updateProductInfo` |
| `updateProductCustomerPrice(body)` | `productOpenApi/updateProductCustomerPrice` |
| `queryProductOtherInfo(body)` | `productOpenApi/queryProducOtherInfotByUids` |

## 单位、供应商、品牌和属性

| SDK 方法 | Endpoint |
| --- | --- |
| `queryProductUnits(body)` | `productOpenApi/queryAllProductUnitDef` |
| `querySupplierPages(body)` | `supplierOpenApi/querySupplierPages` |
| `queryUnitExchangePages(body)` | `productOpenApi/queryUnitExchangePages` |
| `queryUnitExchangeByProductUid(body)` | `productOpenApi/queryUnitExchangeByProductUid` |
| `queryProductBrandPages(body)` | `productOpenApi/queryProductBrandPages` |
| `queryProductAttributePackages(body)` | `productOpenApi/queryAllProductAttributePackage` |
| `queryProductAttributes(body)` | `productOpenApi/queryAllProductattribute` |
| `queryDiscardInventories(body)` | `productOpenApi/queryDiscardInventories` |
| `queryDiscardReasons(body)` | `productOpenApi/queryDiscardReasons` |

## 盘点

| SDK 方法 | Endpoint |
| --- | --- |
| `queryStockTakingHistories(body)` | `stockTakingOpenApi/queryStockTakingHistories` |
| `queryStockTakingDetailsById(body)` | `stockTakingOpenApi/queryStockTakingDetailsById` |
| `queryStockTakingItems(body)` | `stockTakingOpenApi/queryStockTakingItems` |

[返回目录](./README.md)
