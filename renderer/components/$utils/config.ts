import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const staticPath = (path: string) =>
  `${publicRuntimeConfig.staticFolder}${path}`;
