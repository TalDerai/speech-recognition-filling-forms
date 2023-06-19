module.exports = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://localhost:7000/:path*',
          },
        ]
      },
      async redirects() {
        return [
          {
            source: '/',
            destination: '/events',
            permanent: true,
          },
        ]
      },
  }