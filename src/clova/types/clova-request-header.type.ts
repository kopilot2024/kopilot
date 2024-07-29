// https://api.ncloud-docs.com/docs/clovastudio-completions
export type ClovaRequestHeader = {
  'X-NCP-CLOVASTUDIO-API-KEY': string;
  'X-NCP-APIGW-API-KEY': string;
  'X-NCP-CLOVASTUDIO-REQUEST-ID': string;
  'Content-Type': string;
  Accept?: string;
};
