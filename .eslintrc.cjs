module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		// sourceType: 'module',
		// ecmaVersion: 2020,
		tsconfigRootDir: __dirname,
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/strict',
		'plugin:eslint-comments/recommended',
	],
	overrides: [
		{
			files: ['**/*.test.ts'],
			rules: {
				'@typescript-eslint/unbound-method': 'off',
			},
		},
	],
	rules: {
		'@typescript-eslint/no-unnecessary-condition': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off', // allow Non-null assertion operator (!)
		'no-undef': 'off', // typescript already checks this
	},
	ignorePatterns: [
		'*.cjs',
		'.DS_Store',
		'node_modules',
		'/build',
		'/.svelte-kit',
		'/package',
		'/dist',
		'/bin',
		'.env',
		'.env.*',
		'!.env.example',
		'package-lock.json',
		'vite.config.js',
	],
};
