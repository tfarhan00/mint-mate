declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_THIRDWEB_CLIENT_ID: string;
      NEXT_PUBLIC_THIRDWEB_SECRET_KEY: string;
      NEXT_PUBLIC_THIRDWEB_ACTIVE_CHAIN: string;
      NEXT_PUBLIC_THIRDWEB_SMART_CONTRACT: string;
      NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN: string;
      THIRDWEB_AUTH_PRIVATE_KEY: string;
    }
  }
}

export {};
