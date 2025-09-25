import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // 默认错误状态码
  const status = err.status || 500;
  
  // 默认错误消息
  const message = err.message || '服务器内部错误';

  // 开发环境下返回详细错误信息
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(status).json({
    error: message,
    ...(isDevelopment && { stack: err.stack })
  });
};

export default errorHandler;