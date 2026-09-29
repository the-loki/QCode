import { BIGMODEL_PROVIDER_ID } from "@qcode/shared";

const ACTIVE_PROVIDER_KEY = "oauth:active_provider";
const QCODE_JWT_TOKEN_KEY = "qcodejwttoken";

interface BigModelStartPlanQcodeJwtCredentialService {
  load(key: string): Promise<string | null>;
}

export async function resolveBigModelStartPlanQcodeJwt(params: {
  credentialService?: BigModelStartPlanQcodeJwtCredentialService;
  provider?: { readonly apiKey?: string | null } | null;
  trustCachedQcodeJwt?: boolean;
}): Promise<string> {
  const activeProvider = (await params.credentialService?.load(ACTIVE_PROVIDER_KEY))?.trim() || "";
  if (params.trustCachedQcodeJwt === true || activeProvider === BIGMODEL_PROVIDER_ID) {
    const credentialJwt = (await params.credentialService?.load(QCODE_JWT_TOKEN_KEY))?.trim() || "";
    if (credentialJwt) {
      return credentialJwt;
    }
  }

  // qcode JWT 必须在 BigModel OAuth callback 阶段用授权码 body 落盘。
  // Start Plan 查询余额/运行时只消费已保存的 JWT 或 provider 副本，不再用
  // BigModel access_token 构造 provider+access_token body 临时兑换，避免 /oauth/token 400。
  return params.provider?.apiKey?.trim() || "";
}
