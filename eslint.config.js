import ts from 'typescript-eslint';

export default ts.config(
	{
		ignores: ['**/test-results', '**/build']
	},
	...ts.configs.strict,
	{
		languageOptions: {
			parserOptions: {
				project: true
			}
		},
		rules: {
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/require-await': 'error',
			'@typescript-eslint/no-floating-promises': 'error'
		},
		ignores: ['packages/package/test/errors/**/*', 'packages/package/test/fixtures/**/*']
	}
);
