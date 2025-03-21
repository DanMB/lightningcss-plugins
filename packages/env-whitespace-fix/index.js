const customEnvRegex =
	/{"type":"env","value":{"name":{"type":"custom","ident":"[^"]*","from":[^}]*},"indices":\[[^\]]*\],"fallback":[^}]*}},/gi;

/**
 * @import {Visitor, CustomAtRules} from 'lightningcss'
 * @type Visitor<CustomAtRules>
 */
export const envWhitespaceFix = {
	Declaration: (dec) => {
		if (dec.property !== 'unparsed') return;

		const str = JSON.stringify(dec.value.value);
		if (!str.includes('env')) return;

		const replaced = str.replaceAll(
			customEnvRegex,
			'$&{"type": "token","value": {"type": "white-space","value": " "}},'
		);
		if (replaced.length <= str.length) return;

		return {
			property: 'unparsed',
			value: {
				...dec.value,
				value: JSON.parse(replaced)
			}
		};
	}
};

export default envWhitespaceFix;
