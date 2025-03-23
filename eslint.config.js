import ts from 'typescript-eslint';
import js from '@eslint/js';

export default ts.config(
	{
		files: ['/packages/**/*.js'],
		plugins: {
			js,
		},
		extends: ['js/recommended'],
	},
	...ts.configs.strict
);
