import { createHash } from 'node:crypto';

const V1_PATH = '/pospal-api2/openapi/v1';
const V2_PATH = '/openinterface';

/** Error returned when PosPal accepts HTTP transport but rejects the API call. */
export class PospalApiError extends Error {
  constructor(response, { statusCode, endpoint, requestId } = {}) {
    super(response?.messages?.join('; ') || `PosPal API error (${response?.errorCode ?? 'unknown'})`);
    this.name = 'PospalApiError';
    this.response = response;
    this.errorCode = response?.errorCode;
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.requestId = requestId;
  }
}

/** Error returned for a non-2xx response or invalid JSON response. */
export class PospalHttpError extends Error {
  constructor(message, { statusCode, endpoint, body } = {}) {
    super(message);
    this.name = 'PospalHttpError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.body = body;
  }
}

function md5(value) {
  return createHash('md5').update(value, 'utf8').digest('hex').toUpperCase();
}

function trimSlash(value) {
  return value.replace(/\/+$/, '');
}

/**
 * A Node.js client for PosPal's documented Open Platform APIs.
 *
 * V1 requires a fully qualified `baseUrl`, for example
 * `https://your-host/pospal-api2/openapi/v1`.  For V2 supply `areaId`, or a
 * fully qualified `baseUrl` ending in `/openinterface`.
 */
export class PospalClient {
  constructor(options) {
    if (!options?.appId || !options?.appKey) {
      throw new TypeError('appId and appKey are required');
    }
    this.appId = options.appId;
    this.appKey = options.appKey;
    this.version = options.version ?? 'v1';
    this.fetch = options.fetch ?? globalThis.fetch;
    if (typeof this.fetch !== 'function') throw new TypeError('A fetch implementation is required');
    this.timeout = options.timeout ?? 30_000;
    this.throwOnApiError = options.throwOnApiError ?? true;
    this.baseUrl = this.resolveBaseUrl(options);
  }

  resolveBaseUrl(options) {
    if (options.baseUrl) return trimSlash(options.baseUrl);
    if (this.version === 'v2' && options.areaId) return `https://openapi${options.areaId}.pospal.cn${V2_PATH}`;
    throw new TypeError(this.version === 'v2'
      ? 'areaId or baseUrl is required for V2'
      : `baseUrl is required for V1 (it must include ${V1_PATH})`);
  }

  /** Call any documented endpoint with its request body. */
  async request(endpoint, body = {}, options = {}) {
    if (typeof endpoint !== 'string' || !endpoint) throw new TypeError('endpoint is required');
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const url = `${this.baseUrl}/${cleanEndpoint}`;
    const timestamp = String(options.timestamp ?? Date.now());
    // JSON.stringify is deliberately called exactly once: the same bytes are signed and sent.
    const payload = JSON.stringify({ appId: this.appId, ...body });
    const signature = this.version === 'v2'
      ? md5(`${this.appId}${this.appKey}${timestamp}${payload}`)
      : md5(`${this.appKey}${payload}`);
    const headers = {
      'User-Agent': 'openApi',
      'Content-Type': 'application/json; charset=utf-8',
      'time-stamp': timestamp,
      ...(this.version === 'v2'
        ? { appId: this.appId, 'data-signature-v3': signature }
        : { 'data-signature': signature }),
      ...options.headers
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeout ?? this.timeout);
    let response;
    try {
      response = await this.fetch(url, { method: 'POST', headers, body: payload, signal: controller.signal });
    } catch (error) {
      if (error?.name === 'AbortError') throw new PospalHttpError(`Request timed out after ${options.timeout ?? this.timeout}ms`, { endpoint: cleanEndpoint });
      throw error;
    } finally {
      clearTimeout(timer);
    }
    const text = await response.text();
    let result;
    try { result = text ? JSON.parse(text) : {}; } catch {
      throw new PospalHttpError('PosPal returned invalid JSON', { statusCode: response.status, endpoint: cleanEndpoint, body: text });
    }
    if (!response.ok) throw new PospalHttpError(`PosPal HTTP ${response.status}`, { statusCode: response.status, endpoint: cleanEndpoint, body: result });
    if (this.throwOnApiError && String(result.status).toLowerCase() === 'error') {
      throw new PospalApiError(result, { statusCode: response.status, endpoint: cleanEndpoint, requestId: response.headers.get('x-request-id') });
    }
    return result;
  }

  // Store
  queryAllUsers(body) { return this.request('userOpenApi/queryAllUser', body); }
  // Customers
  queryCustomerByNumber(body) { return this.request('customerOpenApi/queryByNumber', body); }
  queryCustomerByUid(body) { return this.request('customerOpenApi/queryByUid', body); }
  queryCustomerByTel(body) { return this.request('customerOpenapi/queryBytel', body); }
  queryCustomerPages(body) { return this.request('customerOpenApi/queryCustomerPages', body); }
  updateCustomerBaseInfo(body) { return this.request('customerOpenApi/updateBaseInfo', body); }
  updateCustomerBalancePoint(body) { return this.request('customerOpenApi/updateBalancePointByIncrement', body); }
  addCustomer(body) { return this.request('customerOpenApi/add', body); }
  queryRechargeLogs(body) { return this.request('customerOpenApi/queryAllRechargeLogs', body); }
  queryCustomerRechargeLog(body) { return this.request('customerOpenApi/queryCustomerRechargeLog', body); }
  queryCustomerCategories(body = {}) { return this.request('customerOpenApi/queryAllCustomerCategory', body); }
  batchUpdateCustomerCategory(body) { return this.request('customerOpenApi/batchUpdateCategory', body); }
  updateCustomerPassword(body) { return this.request('customerOpenApi/updateCustomerPassword', body); }
  querySubsidyChangeLogPages(body) { return this.request('customerOpenApi/querySubsidyChangeLogPages', body); }
  // Products
  queryProductCategories(body) { return this.request('productOpenApi/queryProductCategoryPages', body); }
  queryProductImages(body) { return this.request('productOpenApi/queryProductImagePages', body); }
  queryProductImagesByBarcode(body) { return this.request('productOpenApi/queryProductImagesByBarcode', body); }
  queryProductImagesByUid(body) { return this.request('productOpenApi/queryProductImagesByProductUid', body); }
  queryProductByBarcode(body) { return this.request('productOpenApi/queryProductByBarcode', body); }
  queryProductByBarcodes(body) { return this.request('productOpenApi/queryProductByBarcodes', body); }
  queryProductByUid(body) { return this.request('productOpenApi/queryProductByUid', body); }
  queryProductPages(body) { return this.request('productOpenApi/queryProductPages', body); }
  updateProductInfo(body) { return this.request('productOpenApi/updateProductInfo', body); }
  addProduct(body) { return this.request('productOpenApi/addProductInfo', body); }
  queryProductUnits(body = {}) { return this.request('productOpenApi/queryAllProductUnitDef', body); }
  querySupplierPages(body) { return this.request('supplierOpenApi/querySupplierPages', body); }
  queryUnitExchangePages(body) { return this.request('productOpenApi/queryUnitExchangePages', body); }
  queryUnitExchangeByProductUid(body) { return this.request('productOpenApi/queryUnitExchangeByProductUid', body); }
  updateProductCustomerPrice(body) { return this.request('productOpenApi/updateProductCustomerPrice', body); }
  queryProductOtherInfo(body) { return this.request('productOpenApi/queryProducOtherInfotByUids', body); }
  addProductCategory(body) { return this.request('productOpenApi/addCategory', body); }
  updateProductCategory(body) { return this.request('productOpenApi/updateCategory', body); }
  queryProductBrandPages(body) { return this.request('productOpenApi/queryProductBrandPages', body); }
  queryProductAttributePackages(body = {}) { return this.request('productOpenApi/queryAllProductAttributePackage', body); }
  queryProductAttributes(body = {}) { return this.request('productOpenApi/queryAllProductattribute', body); }
  queryDiscardInventories(body) { return this.request('productOpenApi/queryDiscardInventories', body); }
  queryDiscardReasons(body = {}) { return this.request('productOpenApi/queryDiscardReasons', body); }
  // Stocktaking, tickets and cashiers
  queryStockTakingHistories(body) { return this.request('stockTakingOpenApi/queryStockTakingHistories', body); }
  queryStockTakingDetailsById(body) { return this.request('stockTakingOpenApi/queryStockTakingDetailsById', body); }
  queryStockTakingItems(body) { return this.request('stockTakingOpenApi/queryStockTakingItems', body); }
  queryAllPayMethods(body = {}) { return this.request('ticketOpenApi/queryAllPayMethod', body); }
  queryMyPayMethods(body = {}) { return this.request('ticketOpenApi/queryMyPayMethod', body); }
  queryTicketBySn(body) { return this.request('ticketOpenApi/queryTicketBySn', body); }
  queryTicketByUid(body) { return this.request('ticketOpenApi/queryTicketByUid', body); }
  queryTicketPages(body) { return this.request('ticketOpenApi/queryTicketPages', body); }
  queryCustomerHistoryTickets(body) { return this.request('ticketOpenApi/queryCustomerHistoryTicketsByUid', body); }
  queryRefundTicketBySellTicketUid(body) { return this.request('ticketOpenApi/queryRefunTicketBySellTicketUid', body); }
  queryRefundTicketBySellTicketSn(body) { return this.request('ticketOpenApi/queryRefunTicketBySellTicketSn', body); }
  querySellTicketByRefundTicketUid(body) { return this.request('ticketOpenApi/querySellTicketByRefunTicketUid', body); }
  querySellTicketByRefundTicketSn(body) { return this.request('ticketOpenApi/querySellTicketByRefunTicketSn', body); }
  queryTicketByOrderNo(body) { return this.request('ticketOpenApi/queryTicketByOrderNo', body); }
  queryAllCashiers(body = {}) { return this.request('cashierOpenApi/queryAllCashier', body); }
  // Online orders
  addOnlineOrder(body) { return this.request('orderOpenApi/addOnLineOrder', body); }
  cancelOrder(body) { return this.request('orderOpenApi/cancleOrder', body); }
  shipOrder(body) { return this.request('orderOpenApi/shipOrder', body); }
  completeOrder(body) { return this.request('orderOpenApi/completeOrder', body); }
  queryOrderByNo(body) { return this.request('orderOpenApi/queryOrderByNo', body); }
  queryOrderById(body) { return this.request('orderOpenApi/queryOrderById', body); }
  queryOrderPages(body) { return this.request('orderOpenApi/queryOrderPages', body); }
  // Promotions and prepaid cards
  queryCouponPromotionByUid(body) { return this.request('promotionOpenApi/queryCouponPromotionByUid', body); }
  queryCouponPromotions(body) { return this.request('promotionOpenApi/queryCouponPromotions', body); }
  addCouponCode(body) { return this.request('promotionOpenApi/promotion/addCouponcode', body); }
  queryCustomerCouponCodePages(body) { return this.request('promotionOpenApi/queryCustomerCouponCodePage', body); }
  queryUsedPromotionCodePages(body) { return this.request('promotionOpenApi/queryUsedPromotionCode', body); }
  queryPromotionPages(body) { return this.request('promotionOpenApi/queryPromotionPages', body); }
  usePromotionCouponCode(body) { return this.request('promotionOpenApi/promotioncouponcode/use', body); }
  queryPrepaidCardRulePages(body) { return this.request('PrepaidCardOpenApi/queryPrepaidCardRulePages', body); }
  queryPrepaidCardPages(body) { return this.request('PrepaidCardOpenApi/queryPrepaidCardPages', body); }
  queryPrepaidCardSalePages(body) { return this.request('PrepaidCardOpenApi/queryPrepaidCardSalePages', body); }
  // Stock flows, limits and notifications
  queryProductRequestPages(body) { return this.request('stockFlowOpenApi/queryProductRequestPages', body); }
  queryProductRequestById(body) { return this.request('stockFlowOpenApi/queryProductRequestById', body); }
  queryStockFlowPages(body) { return this.request('stockFlowOpenApi/queryStockFlowPages', body); }
  queryStockFlowByProductRequestId(body) { return this.request('stockFlowOpenApi/queryStockFlowDetailByProductReuqestId', body); }
  queryStockFlowById(body) { return this.request('stockFlowOpenApi/queryStockFlowDetailById', body); }
  createStockFlow(body) { return this.request('stockFlowOpenApi/createStockFlow', body); }
  acceptStockFlowOut(body) { return this.request('stockFlowOpenApi/acceptStockFlowOut', body); }
  acceptStockFlowIn(body) { return this.request('stockFlowOpenApi/acceptStockFlowIn', body); }
  rejectStockFlowOut(body) { return this.request('stockFlowOpenApi/rejectStockFlowOut', body); }
  rejectStockFlowIn(body) { return this.request('stockFlowOpenApi/rejectStockFlowIn', body); }
  queryProductPurchasePages(body) { return this.request('stockFlowOpenApi/queryProductPurchasePages', body); }
  queryAccessTimes(body = {}) { return this.request('openApiLimitAccess/queryAccessTimes', body); }
  queryDailyAccessTimesLog(body) { return this.request('openApiLimitAccess/queryDailyAccessTimesLog', body); }
  queryPushUrl(body = {}) { return this.request('openNotificationOpenApi/queryPushUrl', body); }
  updatePushUrl(body) { return this.request('openNotificationOpenApi/updatePushUrl', body); }
}

export const Pospal = PospalClient;
