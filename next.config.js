/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  eslint: {
    // ビルド時にESLint警告を無視（エラーのみ失敗）
    ignoreDuringBuilds: false,
  },
  typescript: {
    // 型チェックはビルド時に実行
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
