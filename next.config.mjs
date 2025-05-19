/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 'utfs.io',
				protocol: 'https',
				port: '',
			},
		],
	},
	experimental: {
		serverComponentsExternalPackages: ["resend"],
	},
	webpack: (config) => {
		// This is to handle the ReactCurrentDispatcher issue
		config.resolve.alias = {
			...config.resolve.alias,
			// Avoid React dependency in server components
			"react/jsx-runtime.js": "next/dist/compiled/react/jsx-runtime",
			"react/jsx-dev-runtime.js": "next/dist/compiled/react/jsx-dev-runtime",
			react: "next/dist/compiled/react",
			"react-dom": "next/dist/compiled/react-dom",
		};

		return config;
	},
};

export default nextConfig;
