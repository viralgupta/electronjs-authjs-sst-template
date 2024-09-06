import * as e from "express";

const NormalCookiesToElectronCookies = (
  _req: e.Request,
  res: e.Response,
  next: e.NextFunction
) => {
  const originalAppendMethod = res.append;

  res.append = (field: string, value?: string[] | string) => {
    if (field && value && field == "set-cookie") {
      return originalAppendMethod.apply(res, [
        `set-electron-cookie-${Math.ceil(Math.random() * 100)}`,
        value,
      ]);
    }

    return originalAppendMethod.apply(res, [field, value]);
  };
  next();
};

const ElectronCookiesToNormalCookies = (
  req: e.Request,
  _res: e.Response,
  _next: e.NextFunction
) => {
  req.headers.cookie = "";

  for (const [key, value] of Object.entries(req.cookies)) {
    if (key.startsWith("electron-request-cookie")) {
      const subKey = key.substring("electron-request-cookie-".length);
      req.headers.cookie += `${subKey}:${value}; `;
    } else {
      req.headers.cookie += `${key}=${value}; `;
    }
  }
};

export { NormalCookiesToElectronCookies, ElectronCookiesToNormalCookies };
