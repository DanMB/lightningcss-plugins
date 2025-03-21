/** @import {Visitor, CustomAtRules} from 'lightningcss'*/
import { resolve, extname } from 'node:path';
import { optimize } from 'svgo';
import { readFileSync } from 'node:fs';

/**
 * @typedef {Object} InlineSvgOptions
 * @property {string} directory - The directory path for SVG files
 * @property {string[]} [acceptedExtensions=[]] - Array of accepted file extensions
 */

/**
 * @type (options:InlineSvgOptions) => Visitor<CustomAtRules>
 */
export const inlineSvgVisitor = ({ directory, acceptedExtensions = [] }) => ({
	FunctionExit: {
		image: (func) => {
			const arg0 = func.arguments[0];
			const arg2 = func.arguments[2];
			if (arg0.type !== 'token' || arg0.value.type !== 'string') return;

			const src = resolve(directory, arg0.value.value);

			if (![...acceptedExtensions, '.svg'].includes(extname(src))) return;

			/** @type string | undefined */
			let svg;
			try {
				const contents = optimize(readFileSync(src, 'utf-8'));
				svg = contents.data;
			} catch (e) {
				console.log('Failed to import and optimize file : ', src);
				console.error(e);
			}

			if (svg) {
				if (arg2?.type === 'color' && typeof arg2.value !== 'string') {
					/** @type string | undefined */
					let color;
					if (arg2.value.type === 'rgb') {
						color = `rgba(${arg2.value.r}, ${arg2.value.g}, ${arg2.value.b}, ${arg2.value.alpha})`;
					}
					if (color) {
						svg = svg.replaceAll('="currentColor"', `="${color}"`);
					} else {
						console.warn('Failed to parse color : ', arg2.value);
					}
				}

				return {
					raw: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
				};
			}
		}
	}
});

export default inlineSvgVisitor;
