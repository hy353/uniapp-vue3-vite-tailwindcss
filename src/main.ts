import { createSSRApp } from "vue";
import App from "./App.vue";
import http from "./http/index.js";
import * as Pinia from "pinia";
import uviewPlus from "uview-plus";

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  app.use(uviewPlus);
  app.provide("$http", http);
  return {
    app,
    Pinia,
  };
}

declare global {
  interface Uni extends UniNamespace.Uni {
    $u: {
      /**
       * 
       * @param Object 
       */
      route(Object: {
        type?: string;
        url?: string;
        delta?: number;
        params?: Object;
        animationType?: string;
        animationDuration?: number;
      }): void;
      os(): void;
      sys(): void;
      platform(): void;
      /**
       * 此方法用于限制value的大小，如果其在min和max之间，则不变；如果其小于min，则取min值；如果其大于max，则取max值。
       * @param min 最小值
       * @param max 最大值
       * @param value 对比值
       */
      range(min: number, max: number, value: number): void;
      /**
       * 此方法用于返回带单位的值的数值结果，如果第二个参数为true，返回的结果将会带上px的单位；可接受的值如下：
       * @param value
       * @param unit
       */
      getPx(value: number | string, unit?: boolean): void;
      /**
       * 延时一定时间进行回调，类似于promise的使用方式
       * @param value
       */
      sleep(value: number): void;
      $parent: {
        /**
         * 用于抹平各端差异，在组件中向上获取父组件或者页面的实例。
         * @param instance 实例，传this即可，不可修改
         * @param name 可选，页面或者父组件的name属性值，不传则默认查找页面(最顶层)的实例
         */
        call(instance: any, name?: string): void;
      };
      /**
       * 用于将字符串形式的内联样式样式转为对象形式，或者将对象形式的样式写法转为字符串形式。
       * @param style 样式，可为对象或者字符串形式
       * @param target 可选，转换结果的类型，默认为object；如果为object则返回对象形式的结果，如果为string则返回字符串形式的结果
       */
      addStyle(style: string | object, target?: string): void;
      /**
       * 用于给值加上单位，如果值已有单位，则直接原样返回，如果值为数值，则加上unit参数的单位。
       * @param value 可为5，5px，6rpx，100%等格式的值
       * @param unit 可选，默认为px，如果第一个参数为数值，则拼接上此单位
       */
      addUnit(value: number | string, unit?: string): void;
      /**
       * 用于对数值形式的金额进行格式化
       * @param value 需要格式化的金额数值，只能为数值，如300.52，300，而不能为诸如带千分位的写法3,000.5
       * @param decimals 可选，格式化后小数点的位数，默认为0，小数最后一位会进行四舍五入
       * @param decimalPoint 可选，小数点的符号，默认为.
       * @param thousandsSeparator 可选，千分位分隔符，默认为英文逗号,
       */
      priceFormat(
        value: number,
        decimals?: number,
        decimalPoint?: string,
        thousandsSeparator?: string
      ): void;
      /**
       * 获取当前页面的路径，返回的路径以/开头。
       */
      page(): void;
      /**
       * 本方法为getCurrentPages()的封装，用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
       */
      pages(): void;
      /**
       * 节流 规定时间内，只触发一次
       * @param func 触发回调执行的函数
       * @param wait 时间间隔，单位ms
       * @param immediate 在开始还是结束处触发
       */
      throttle(func: Function, wait: number, immediate: boolean): void;
      /**
       * 防抖 在连续的操作中，无论进行了多长时间，只有某一次的操作后在指定的时间内没有再操作，这一次才被判定有效
       * @param func 触发回调执行的函数
       * @param wait 时间间隔，单位ms
       * @param immediate 在开始还是结束处触发，如非特殊情况，一般默认为false即可
       */
      debounce(func: Function, wait: number, immediate: boolean): void;
      /**
       * 生产一个全局唯一、随机的guid，默认首字母为u，可以用于当做元素的id或者class名等需要唯一，随机字符串的地方，因为id或者class不能以数字开头。
       * @param length guid的长度，默认为32，如果取值null，则按rfc4122标准生成对应格式的随机数
       * @param firstU 首字母是否为"u"，如果首字母为数字情况下，不能用作元素的id或者class，默认为true
       * @param radix 生成的基数，默认为62，用于生成随机数字符串为"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"， 如果取2，那么返回的结果就是前两位0和1(可以理解为二进制)的随机结果，如果为7，返回的字符串就是0-7(理解为八进制)之间， 10为十进制，以此类推。
       */
      guid(length: number | null, firstU: boolean, radix: number): void;
      /**
       * 将一个对象形式参数转换成get传参所需参数形式，如把{name: 'lisa', age: 20}转换成?name=lisa&age=20
       * @param data 对象值
       * @param isPrefix 是否在返回的字符串前加上"?"，默认为true
       * @param arrayFormat 属性为数组的情况下的处理办法，默认为brackets，见后面说明
       */
      queryParams(data: object, isPrefix?: boolean, arrayFormat?: string): void;
      /**
       * 多久以前 必须传入第一个参数，格式为任何合法的时间格式、秒或毫秒的时间戳，第二个参数是可选的，返回的值类似刚刚，25分钟前，3小时前，7天前的结果。 如果第二个参数是时间的格式，当前和传入时间戳相差大于一个月时，返回格式化好的时间；如果第二个参数为false，则不会返回格式化好的时间，而是诸如"xxx年前"的结果。
       * @param timestamp 时间戳
       * @param format 时间格式，默认为yyyy-mm-dd，年为"yyyy"，月为"mm"，日为"dd"，时为"hh"，分为"MM"，秒为"ss"，格式可以自由搭配，如： yyyy:mm:dd，yyyy-mm-dd，yyyy年mm月dd日，yyyy年mm月dd日 hh时MM分ss秒，yyyy/mm/dd/，MM:ss等组合。 如果时间戳距离此时的时间，大于一个月，则返回一个格式化好的时间，如果此参数为false，返回均为"多久之前"的结果。
       */
      timeFrom(timestamp: string, format: string | boolean): String;
      /**
       * 格式化时间 必须传入第一个参数，第二个参数是可选的，函数返回一个格式化好的时间。
       * @param time 任何合法的时间格式、秒或毫秒的时间戳
       * @param format 时间格式，可选。默认为yyyy-mm-dd，年为"yyyy"，月为"mm"，日为"dd"，时为"hh"，分为"MM"，秒为"ss"，格式可以自由搭配，如： yyyy:mm:dd，yyyy-mm-dd，yyyy年mm月dd日，yyyy年mm月dd日 hh时MM分ss秒，yyyy/mm/dd/，MM:ss等组合
       */
      timeFormat(time: string, format: string): String;
      /**
       * 对象深度克隆
       * @param object 需要被克隆的对象
       */
      deepClone(object: Object): Object;
      /**
       * 对象深度合并
       * @param target 目标对象
       * @param source 源对象
       */
      deepMerge(target: Object, source: Object): Object;
    };
  }
}
