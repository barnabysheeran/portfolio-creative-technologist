import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import webpack from 'webpack';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define Application Version
const packageJson = JSON.parse(
	fs.readFileSync(new URL('../package.json', import.meta.url)),
);
const applicationVersion = packageJson.version;

export default {
	mode: 'production',
	devtool: false,

	entry: './src/js/index.js',

	output: {
		path: path.resolve(__dirname, `../dist`),
		filename: 'application.[contenthash].js',
		clean: true,
		library: {
			name: 'Application',
			type: 'umd',
		},
		globalObject: 'this',
	},

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				parallel: true,
				terserOptions: {
					compress: {
						drop_console: true,
						drop_debugger: true,
						pure_funcs: ['console.log'],
					},
					mangle: {
						properties: false,
					},
				},
			}),
			new CssMinimizerPlugin(),
		],
		usedExports: true,
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				include: [path.resolve(__dirname, '../src')],
				use: { loader: 'babel-loader' },
			},

			{
				test: /\.(svg|png|gif|jpg|ico)$/,
				exclude: /node_modules/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/[name].[hash][ext]',
				},
			},

			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							sourceMap: false, // Disable source maps in production
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									'postcss-preset-env', // Modern CSS features
									'postcss-nested', // Nested CSS like Sass
								],
							},
						},
					},
				],
			},
		],
	},

	plugins: [
		new webpack.DefinePlugin({
			APPLICATION_VERSION: JSON.stringify(applicationVersion),
		}),

		new HtmlWebpackPlugin({
			template: 'src/html/index.html',
			filename: './index.html',
			inject: 'body', // Change from 'head' to 'body'
			minify: true,
			hash: false,
		}),

		new CopyWebpackPlugin({
			patterns: [{ from: './src/asset', to: './asset' }],
		}),

		new MiniCssExtractPlugin({
			filename: './application.[contenthash].css',
		}),
	],
};
