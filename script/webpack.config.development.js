import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import webpack from 'webpack';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(
	fs.readFileSync(new URL('../package.json', import.meta.url)),
);
const applicationVersion = pkg.version;

export default {
	mode: 'development',
	devtool: 'eval-source-map',

	entry: './src/js/index.js',

	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'application.js',
		clean: true,
		library: {
			name: 'Application',
			type: 'umd',
		},
		globalObject: 'this',
	},

	devServer: {
		open: true,
		hot: true,
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
					filename: 'assets/[name][ext]',
				},
			},

			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							sourceMap: true,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: ['postcss-preset-env', 'postcss-nested'],
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
			inject: 'body', // Change from 'head' to 'body' for better CSS injection
		}),

		new CopyWebpackPlugin({
			patterns: [{ from: './src/asset', to: './asset' }],
		}),

		// Remove MiniCssExtractPlugin from development
		// new MiniCssExtractPlugin({ filename: './application.css' }),
	],
};
