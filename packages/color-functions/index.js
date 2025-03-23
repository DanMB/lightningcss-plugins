/** @import {Visitor, CustomAtRules, TokenOrValue} from 'lightningcss' */

/** @param {TokenOrValue} obj */
export const isNumber = (obj) => {
	if (obj.type !== 'token') return false;
	return obj.value.type === 'number' || obj.value.type === 'percentage';
};

/** @param {TokenOrValue} obj */
export const isUnparsed = (obj) => {
	if (obj.type === 'env' && obj.value.name.type === 'custom') return true;
	if (obj.type === 'function' && obj.value.name === 'calc') return true;
	if (obj.type === 'var') return true;
	return false;
};

/** @param {TokenOrValue} obj */
export const isColor = (obj) => {
	return obj.type === 'color' || obj.type === 'unresolved-color';
};

/** @type Visitor<CustomAtRules> */
export const colorFunctionsVisitor = {
	Function: {
		color: (func) => {
			if (func.arguments.length < 3) return;
			const [target, delim, opacity] = func.arguments;

			if (!isColor(target) && !isUnparsed(target)) return;
			if (delim.type !== 'token' || delim.value.type !== 'delim' || delim.value.value !== '/') {
				return;
			}

			if (!isNumber(opacity) && !isUnparsed(opacity)) {
				return;
			}

			return {
				type: 'function',
				value: {
					name: 'hsla',
					arguments: [
						{ type: 'token', value: { type: 'ident', value: 'from' } },
						{ type: 'token', value: { type: 'white-space', value: ' ' } },
						target,
						{ type: 'token', value: { type: 'white-space', value: ' ' } },
						{ type: 'token', value: { type: 'ident', value: 'h' } },
						{ type: 'token', value: { type: 'white-space', value: ' ' } },
						{ type: 'token', value: { type: 'ident', value: 's' } },
						{ type: 'token', value: { type: 'white-space', value: ' ' } },
						{ type: 'token', value: { type: 'ident', value: 'l' } },
						{ type: 'token', value: { type: 'white-space', value: ' ' } },
						delim,
						{ type: 'token', value: { type: 'white-space', value: ' ' } },
						opacity,
					],
				},
			};
		},
	},
};

export default colorFunctionsVisitor;
