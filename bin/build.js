#! /usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { copyFile, stat, mkdir } from 'fs/promises';
import { build as esbuild } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseConfig = {
	platform: 'node',
	nodePaths: [path.join(__dirname, '../src')],
	sourcemap: true,
	external: [],
	bundle: true,
};

const OUT_DIR = path.join(__dirname, '../dist');

(async function () {

	const statRes = await stat(OUT_DIR);
	
	if ( !statRes.isDirectory() ) {
		await mkdir(OUT_DIR);
	}

	await copyFile(
		path.join(__dirname, '../package.json'),
		path.join(OUT_DIR, '/package.json')
	);

	await esbuild({
		...baseConfig,
		format: 'cjs',
		target: 'es6',
		outdir: path.join(OUT_DIR, 'cjs'),
		entryPoints: [path.join(__dirname, '../src/index.ts')],
	});

	await esbuild({
		...baseConfig,
		format: 'esm',
		target: 'es2020',
		outdir: path.join(OUT_DIR, 'mjs'),
		entryPoints: [path.join(__dirname, '../src/index.ts')],
	});
})()
	.then(() => {
		console.log('Build complete');
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
