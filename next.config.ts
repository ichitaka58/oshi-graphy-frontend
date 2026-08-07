import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true, // forbiddenを使用するための設定
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // アップロード画像・Laravel配信アセットを same-origin でプロキシする。
  // これにより next/image が「内部画像」として扱えるため、絶対URLに対する
  // Next.js 16 の SSRF ガード（private IP 拒否）を踏まずに最適化が効く。
  // dev/本番で同じ挙動になり、remotePatterns も危険フラグも不要。
  // - /storage : アップロードされた画像（日記の写真・アイコン）。実体はCloudflare R2
  // - /images  : Laravel public のアセット（アイコンのプレースホルダ等）
  async rewrites() {
    const backend = process.env.LARAVEL_API_URL;
    const r2 = process.env.R2_PUBLIC_URL;
    return [
      { source: "/storage/:path*", destination: `${r2}/:path*` },
      { source: "/images/:path*", destination: `${backend}/images/:path*` },
    ];
  },
};

export default nextConfig;
