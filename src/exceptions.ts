/*
 * @Autor: junhui li
 * @Date: 2020-12-29 20:18:16
 * @LastEditors: junhui li
 * @LastEditTime: 2021-01-18 20:40:26
 * @Description: 
 */
export class BaseException extends Error {
  // 状态码
  status: number;
  // 提示信息
  message: string;
}

export class NotFoundException extends BaseException {
  status = 404;

  constructor(msg?: string) {
    super();
    this.message = msg || '无此内容';
  }
}

export class UnauthorizedException extends BaseException {
  status = 401;

  constructor(msg?: string) {
    super();
    this.message = msg || '尚未登录';
  }
}

export class ForbiddenException extends BaseException {
  status = 403;

  constructor(msg?: string) {
    super();
    this.message = msg || '权限不足';
  }
}

export class RepeatException extends BaseException {
  status = 405;

  constructor(msg?: string) {
    super();
    this.message = msg || '数据重复';
  }
}

export class FileException extends BaseException {
  status = 406;

  constructor(msg?: string) {
    super();
    this.message = msg || '文件错误';
  }
}
