interface RequestInterface {
  // 设置默认Config
  setConfig(config: Config): void;
  setRequestConfig(config: RequestConfig): void;
  get(
    options: MergeConfig
  ): Promise<any> | UniApp.RequestTask | UniApp.UploadTask;
  put(
    options: MergeConfig
  ): Promise<any> | UniApp.RequestTask | UniApp.UploadTask;
  delete(
    options: MergeConfig
  ): Promise<any> | UniApp.RequestTask | UniApp.UploadTask;
  post(
    options: MergeConfig
  ): Promise<any> | UniApp.RequestTask | UniApp.UploadTask;
  upload(
    options: MergeConfig
  ): Promise<any> | UniApp.RequestTask | UniApp.UploadTask;
  request(
    options: MergeConfig
  ): Promise<any> | UniApp.RequestTask | UniApp.UploadTask;
  // 请求拦截器
  interceptor: Interceptor;
}

interface Config {
  /**
   * 接口请求基地址
   */
  baseUrl: string;
  /**
   * 请求编码，默认为utf-8
   */
  encoding?: string;
  /**
   * 是否视以/开头的url为绝对地址，默认为false，此设置仅当初步判断url为非绝对地址时有效
   */
  slashAbsoluteUrl?: boolean;
  /**
   * 是否开启debug模式，在此模式下，所有的请求都会打印请求参数，响应对象或错误信息
   */
  debug?: boolean;
}

interface RequestConfig {
  /**
   * 接口地址
   * */
  url: string;
  /**
   * 接口响应的业务数据对象字段名，默认为data，如果返回整个业务对象，则需要设置为undefined
   */
  business?: string;
  /**
   * 请求的参数
   */
  data?: any;
  /**
   * request 请求类型
   */
  method?: UniApp.RequestOptions["method"];
  /**
   * 内容类型
   */
  contentType?: string | undefined;
  /**
   * 返回的data类型，默认为json
   */
  dataType?: string | undefined;
  /**
   * 超时时间，单位 ms 默认为 60000
   */
  timeout?: number;
  /**
   * 是否在请求前显示文字为参数值的loading提示，如果是，会在请求结束后自动关闭loading提示
   */
  loadingTip?: string | undefined;
  /**
   * 设置loadingTip时的最小loading显示时间
   */
  loadingDuration?: number;
  /**
   * 错误时弹出提示框，默认为false
   * */
  toastError?: boolean;
  /**
   * 是否跳过响应过滤器，如需跳过，请置true
   */
  skipInterceptorResponse?: boolean;
  /**
   * 设置请求的 header，header 中不能设置 Referer。
   */
  header?: any;
  /**
   * 接口调用成功的回调函数
   */
  success?: (res: any) => void;
  /**
   * 接口调用失败的回调函数
   */
  fail?: (
    res: UniApp.GeneralCallbackResult & UniApp.RequestSuccessCallbackResult
  ) => void;
  /**
   * 接口调用结束的回调函数（调用成功、失败都会执行）
   */
  complete?: (
    res: UniApp.GeneralCallbackResult & UniApp.RequestSuccessCallbackResult
  ) => void;
}

interface UploadConfig {
  /**
   * HTTP 请求中其他额外的 form data
   */
  formData?: any;
  /**
   * 要上传文件资源的路径
   */
  filePath?: string;
  /**
   * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
   */
  name?: string;
  /**
   * 上传进度变化事件，以及取消上传任务。
   */
  progress?: (
    res: UniApp.OnProgressUpdateResult,
    task: UniApp.UploadTask
  ) => void;
}

type MergeConfig = RequestConfig & UploadConfig;

interface Interceptor {
  request?: (config: MergeConfig) => any;
  response?: (response: any, _config: MergeConfig) => any;
  fail?: (
    response: UniApp.GeneralCallbackResult &
      UniApp.RequestSuccessCallbackResult,
    _config: MergeConfig
  ) => any;
  prepare?: (config: MergeConfig, obj: RequestResult) => any;
  complete?: (
    _config: MergeConfig,
    obj: RequestResult,
    res: UniApp.GeneralCallbackResult & UniApp.RequestSuccessCallbackResult
  ) => any;
}

interface RequestResult {
  /**
   * 请求开始时间
   */
  startTime: number;
  /**
   * 请求结束时间
   */
  endTime?: number;
}

export {
  RequestConfig,
  Config,
  RequestInterface,
  Interceptor,
  RequestResult,
  MergeConfig,
};
