"use strict";

import {
  RequestInterface,
  Config,
  RequestConfig,
  RequestResult,
  Interceptor,
  MergeConfig,
} from "../typings/request";

class Request implements RequestInterface {
  /**
   * @description 网络请求的默认配置
   * @property {Object} config - 默认参数配置
   * @property {string} config.baseUrl - 接口基地址
   * @property {string} config.business - 接口响应的业务数据对象字段名，默认为data
   */
  config: Config = {
    /*返回默认为res.data*/
    baseUrl: "",
    encoding: "UTF-8",
    slashAbsoluteUrl: false,
    debug: false,
  };

  requestConfig: RequestConfig = {
    url: "",
    business: "data",
    data: undefined,
    timeout: 60000,
    method: "POST",
    dataType: "json",
    loadingTip: undefined,
    loadingDuration: 500,
    contentType: "json",
    skipInterceptorResponse: false,
  };

  static posUrl(url: string) {
    /* 判断url是否为绝对路径 */
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
  }

  getUrl(config: RequestConfig) {
    let url = config.url || "";
    let abs = Request.posUrl(url);
    if (!abs) {
      let f = this.config.slashAbsoluteUrl;
      if (f) {
        abs = /^\/([\w.]+\/?)\S*/.test(url);
      }
    }
    return abs ? url : this.config.baseUrl + url;
  }

  getContentType(config: RequestConfig) {
    var type = config.contentType || "json";
    var charset = this.config.encoding || "UTF-8";
    if (type === "json") {
      return "application/json;charset=" + charset;
    } else if (type === "form") {
      return "application/x-www-form-urlencoded;charset=" + charset;
    } else if (type === "file") {
      return "multipart/form-data;charset=" + charset;
    } else if (type === "text") {
      return "text/plain;charset=" + charset;
    } else if (type === "html") {
      return "text/html;charset=" + charset;
    } else {
      throw new Error("unsupported content type : " + type);
    }
  }

  /**
   * @property {Object} interceptor 拦截器
   *
   */
  interceptor: Interceptor = {
    /**
     * @description define the interceptor before request
     * @param {function}
     */
    request: undefined,
    response: undefined,
    fail: undefined,
    complete: undefined,
    prepare: undefined,
  };
  
  setConfig(config: Config) {
    this.config = Object.assign(this.config, config);
  }

  setRequestConfig(config: RequestConfig) {
    this.requestConfig = Object.assign(this.requestConfig, config);
  }

  request(
    options: MergeConfig = {
      url: "",
    }
  ) {
    var that = this;
    if (options.data === undefined) {
      options.data = {};
    }
    if (options.header === undefined) {
      options.header = {};
    }

    let _options = Object.assign({}, this.config, options);
    _options = Object.assign(options, _options);

    _options.url = this.getUrl(_options);
    if (!_options.header["Content-Type"]) {
      _options.header["Content-Type"] = this.getContentType(_options);
    }
    let _config = _options;
    if (
      that.interceptor.request &&
      typeof that.interceptor.request === "function"
    ) {
      _config = that.interceptor.request(_options);
    }
    let task: UniApp.RequestTask | UniApp.UploadTask | undefined = undefined;
    let promise = new Promise<any>((resolve, reject) => {
      let extras: RequestResult = {
        startTime: 0,
      };

      that._prepare(that, _config, extras);

      if (_config.contentType === "file") {
        task = uni.uploadFile({
          ..._config,
          success: (res) => {
            that._success(that, _config, res, resolve, reject);
          },
          fail: (res) => {
            that._fail(
              that,
              _config,
              res as UniApp.GeneralCallbackResult &
                UniApp.RequestSuccessCallbackResult,
              resolve,
              reject
            );
          },
          complete: (res) => {
            that._complete(
              that,
              _config,
              res as UniApp.GeneralCallbackResult &
                UniApp.RequestSuccessCallbackResult,
              extras
            );
          },
        });
        if (_config.progress && typeof _config.progress === "function") {
          (task as UniApp.UploadTask).onProgressUpdate((_res) => {
            _config.progress!(_res, task as UniApp.UploadTask);
          });
        }
      } else {
        task = uni.request({
          ..._config,
          success: (res) => {
            that._success(that, _config, res, resolve, reject);
          },
          fail: (res) => {
            that._fail(
              that,
              _config,
              res as UniApp.GeneralCallbackResult &
                UniApp.RequestSuccessCallbackResult,
              resolve,
              reject
            );
          },
          complete: (res) => {
            that._complete(
              that,
              _config,
              res as UniApp.GeneralCallbackResult &
                UniApp.RequestSuccessCallbackResult,
              extras
            );
          },
        });
      }
    });
    if (_config.success || _config.fail || _config.complete) {
      return task!;
    }
    return promise;
  }

  get(
    options: MergeConfig = {
      url: "",
    }
  ) {
    options.method = "GET";
    return this.request(
      Object.assign({}, { ...this.requestConfig, ...options })
    );
  }

  post(
    options: MergeConfig = {
      url: "",
    }
  ) {
    options.method = "POST";
    return this.request({ ...this.requestConfig, ...options });
  }

  put(
    options: MergeConfig = {
      url: "",
    }
  ) {
    options.method = "PUT";
    return this.request({ ...this.requestConfig, ...options });
  }

  delete(
    options: MergeConfig = {
      url: "",
    }
  ) {
    options.method = "DELETE";
    return this.request({ ...this.requestConfig, ...options });
  }

  upload(
    options: MergeConfig = {
      url: "",
    }
  ) {
    options.method = "POST";
    options.contentType = "file";
    return this.request({ ...this.requestConfig, ...options });
  }

  _success(
    that: this,
    _config: MergeConfig,
    res:
      | UniApp.UploadFileSuccessCallbackResult
      | UniApp.RequestSuccessCallbackResult,
    resolve: {
      (value: unknown): void;
      (value: unknown): void;
      (arg0: any): any;
    },
    reject: { (reason?: any): void; (reason?: any): void }
  ) {
    if (res.statusCode >= 200 && res.statusCode <= 302) {
      // http ok
      var result = res.data;
      var parseFileJson =
        typeof result === "string" &&
        (_config.dataType === undefined || _config.dataType === "json");
      if (parseFileJson) {
        result = JSON.parse(res.data as string);
      }
      var skip = _config.skipInterceptorResponse;
      // 走全局的拦截器，
      if (
        that.interceptor.response &&
        typeof that.interceptor.response === "function" &&
        !skip
      ) {
        result = that.interceptor.response(result, _config);
        if ((result as any).success) {
          // 不兼容原来的接口业务逻辑调用成功判定
          // 接口调用业务成功
          var _data;
          if (_config.business) {
            _data = (result as any)[_config.business];
          } else {
            _data = result;
          }
          if (this.config.debug) {
            console.log(`response(${_config.url}) success: `, _data);
          }
          _config.success ? _config.success(_data) : resolve(_data);
          return;
        }
      } else {
        // 对于某些特殊接口，比如访问其它系统，全局拦截器可能不适合
        // 这种情况下，需要自己处理接口响应，相当于透传
        if (this.config.debug) {
          console.log(`response(${_config.url}) success: `, result);
        }
        _config.success ? _config.success(result) : resolve(result);
        return;
      }
    }
    // 剩下的都走失败
    that._fail(
      that,
      _config,
      res as UniApp.GeneralCallbackResult & UniApp.RequestSuccessCallbackResult,
      resolve,
      reject
    );
  }

  _fail(
    that: this,
    _config: MergeConfig,
    res: UniApp.GeneralCallbackResult & UniApp.RequestSuccessCallbackResult,
    resolve: { (value: unknown): void; (value: unknown): void },
    reject: { (reason?: any): void; (reason?: any): void; (arg0: any): any }
  ) {
    if (this.config.debug) {
      console.error(`response(${_config.url}) failure: `, res);
    }
    if (res.errMsg === "request:fail abort") {
      return;
    }
    var result = res;
    if (that.interceptor.fail && typeof that.interceptor.fail === "function") {
      result = that.interceptor.fail(res, _config);
    }
    _config.fail ? _config.fail(result) : reject(result);
  }

  _prepare(that: this, _config: MergeConfig, obj: RequestResult) {
    if (
      that.interceptor.prepare &&
      typeof that.interceptor.prepare === "function"
    ) {
      that.interceptor.prepare(_config, obj);
      return;
    }
    obj.startTime = Date.now();
    if (_config.loadingTip) {
      uni.showLoading({
        title: _config.loadingTip,
      });
    }
    if (_config.contentType === "file") {
      if (_config.formData === undefined || _config.formData === null) {
        _config.formData = _config.data;
        delete _config.data;
      }
      delete _config.header["Content-Type"];
      delete _config.header["Referer"];
      _config.method = "POST";
    }
    if (this.config.debug) {
      console.log(`request(${_config.url}): `, _config);
    }
  }

  _complete(
    that: this,
    _config: MergeConfig,
    res: UniApp.GeneralCallbackResult & UniApp.RequestSuccessCallbackResult,
    obj: RequestResult
  ) {
    if (
      that.interceptor.complete &&
      typeof that.interceptor.complete === "function"
    ) {
      that.interceptor.complete(_config, obj, res);
      return;
    }
    obj.endTime = Date.now();
    if (this.config.debug) {
      console.log(
        `request(${_config.url}) completed in ${obj.endTime - obj.startTime} ms`
      );
    }
    if (_config.loadingTip) {
      let diff = obj.endTime - obj.startTime;
      let duration = _config.loadingDuration || 500;
      if (diff < duration) {
        diff = duration - diff;
      } else {
        diff = 0;
      }

      setTimeout(function () {
        uni.hideLoading();
      }, diff);
    }
    if (_config.complete) {
      _config.complete(res);
    }
  }
}
/**
 *
 */
var request = new Request();
/**
 * @module {Request} request
 */
export default request;
