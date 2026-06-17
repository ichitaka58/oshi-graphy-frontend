import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Laravel が配信する画像を same-origin でプロキシする。
  // これにより next/image が「内部画像」として扱えるため、絶対URL(localhost)に
  // 対する Next.js 16 の SSRF ガード（private IP 拒否）を踏まずに最適化が効く。
  // dev/本番で同じ挙動になり、remotePatterns も危険フラグも不要。
  // - /storage : アップロードされた画像（日記の写真・アイコン）
  // - /images  : Laravel public のアセット（アイコンのプレースホルダ等）
  async rewrites() {
    const backend = process.env.LARAVEL_API_URL;
    return [
      { source: "/storage/:path*", destination: `${backend}/storage/:path*` },
      { source: "/images/:path*", destination: `${backend}/images/:path*` },
    ];
  },
};

export default nextConfig;
