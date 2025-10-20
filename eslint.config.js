import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import babelParser from '@babel/eslint-parser';

export default [
	{
		ignores: ['README.md', 'package-lock.json', 'dist/**'],
	},
	js.configs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			parser: babelParser,
			parserOptions: {
				requireConfigFile: false,
				ecmaVersion: 2024,
				sourceType: 'module',
			},
			globals: {
				...globals.browser,
				...globals.es2024,
				...globals.node,
			},
		},
		plugins: {
			prettier,
		},
		rules: {
			'prettier/prettier': ['warn'],
			'linebreak-style': 0,
			'no-underscore-dangle': 0,
			'lines-between-class-members': 0,
			'prefer-destructuring': [
				'error',
				{
					object: false,
					array: false,
				},
			],
		},
	},
];
