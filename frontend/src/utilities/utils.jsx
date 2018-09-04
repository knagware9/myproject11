import invariant from 'invariant';
import PropTypes from 'prop-types';
import { SIZE_MAP } from './StyleConfig';

function curry(fn) {
	return (...args) => {
		let last = args[args.length - 1];
		if (typeof last === 'function') {
			return fn(...args);
		}
		return (Component) => fn(...args, Component);
	};
}

export function prefix(props, variant) {
	let vsClass = (props.vsClass || '').trim();
	invariant(vsClass != null, 'A `vsClass` prop is required for this component');

	return vsClass + (variant ? `-${variant}` : '');
}

export const vsClass = curry((defaultClass, Component) => {
	let propTypes = Component.propTypes || (Component.propTypes = {});
	let defaultProps = Component.defaultProps || (Component.defaultProps = {});

	propTypes.vsClass = PropTypes.string;
	defaultProps.vsClass = defaultClass;

	return Component;
});
function isVsProp(propName) {
	return propName === 'vsClass' || propName === 'vsSize' || propName === 'vsStyle' || propName === 'vsRole';
}

export const vsStyles = curry((styles, defaultStyle, Component) => {
	if (typeof defaultStyle !== 'string') {
		Component = defaultStyle;
		defaultStyle = undefined;
	}

	let existing = Component.STYLES || [];
	let propTypes = Component.propTypes || {};

	styles.forEach((style) => {
		if (existing.indexOf(style) === -1) {
			existing.push(style);
		}
	});

	let propType = PropTypes.oneOf(existing);

	// expose the values on the propType function for documentation
	Component.STYLES = existing;
	propType._values = existing;

	Component.propTypes = {
		...propTypes,
		vsStyle: propType
	};

	if (defaultStyle !== undefined) {
		let defaultProps = Component.defaultProps || (Component.defaultProps = {});
		defaultProps.vsStyle = defaultStyle;
	}

	return Component;
});

export const vsSizes = curry((sizes, defaultSize, Component) => {
	if (typeof defaultSize !== 'string') {
		Component = defaultSize;
		defaultSize = undefined;
	}

	let existing = Component.SIZES || [];
	let propTypes = Component.propTypes || {};

	sizes.forEach((size) => {
		if (existing.indexOf(size) === -1) {
			existing.push(size);
		}
	});

	const values = []; // blank array
	existing.forEach((size) => {
		const mappedSize = SIZE_MAP[size];
		if (mappedSize && mappedSize !== size) {
			values.push(mappedSize);
		}

		values.push(size);
	});

	const propType = PropTypes.oneOf(values);
	propType._values = values;

	// expose the values on the propType function for documentation
	Component.SIZES = existing;

	Component.propTypes = {
		...propTypes,
		vsSize: propType
	};

	if (defaultSize !== undefined) {
		if (!Component.defaultProps) {
			Component.defaultProps = {};
		}
		Component.defaultProps.vsSize = defaultSize;
	}

	return Component;
});

export function getClassSet(props) {
	const classes = {
		[prefix(props)]: true
	};
	if (props.vsSize) {
		const vsSize = SIZE_MAP[props.vsSize] || props.vsSize;
		classes[prefix(props, vsSize)] = true;
	}
	if (props.vsStyle) {
		classes[prefix(props, props.vsStyle)] = true;
	}
	return classes;
}

/**
 * @param {Object} props - props object
 * will return Components custom (vsprops) props only
 */
function getVsProps(props) {
	return {
		vsClass: props.vsClass,
		vsSize: props.vsSize,
		vsStyle: props.vsStyle,
		vsRole: props.vsRole
	};
}

/**
 * 
 * @param {Object} props - props object
 * 
 * function returns an array of Components default props and vsprops
 * 
 */
export function splitVsProps(props) {
	const elementProps = {};
	Object.entries(props).forEach(([ propName, propValue ]) => {
		if (!isVsProp(propName)) {
			elementProps[propName] = propValue;
		}
	});

	return [ getVsProps(props), elementProps ];
}

/**
 *
 * @param {Array} fullClassNames - raw classes 
 * @param {Object} cssRulesObject - hashed classes
 */
export function getContentHashClass(fullClassNames, cssRulesObject) {
	let hashClass;

	let hashedClassArr = fullClassNames.split(' ').map((c) => {
		return cssRulesObject[c];
	});
	hashClass = hashedClassArr.join(' ');
	if (hashClass === ' ') {
		hashClass = null;
	}
	return hashClass;
}

/**
 * 
 * @param {string} str - icon code e.g. &#xe9b7;
 * return html entity
 */
export const HtmlEntity = {
	decode: (str) => {
		return str.replace(/&#x([0-9A-F]+);/gi, function(match, dec) {
			return String.fromCharCode(parseInt(dec, 16));
		});
	},
	encode: (str) => {
		var buf = [];
		for (var i = 0, length = str.length; i < length; i++) {
			buf.push('&#x' + str[i].charCodeAt().toString(16) + ';');
		}
		return buf;
	}
};

/**
 * extract className(s) from third party Component 
 * to be converted into hashed classes
 * @param {object} props - props object of UI Component
 * @param {array} matchFrom - array from match the props classNames
 */
export const extractClassesFromComponent = (props, matchFrom, cssRules) => {
	Object.entries(props).forEach(([ key, value ]) => {
		if (matchFrom.indexOf(key) !== -1) {
			props[key] = cssRules[value];
		}
	});
};

export const Months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];
export const MonthsAbbr = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

/**
 * 
 * @param {Object} date - Date object 
 * retun formated date eg:Jan 01, 1970
 */
export const GetDate = (date) => {
	const month = date.getMonth();
	const day = date.getDate();
	const year = date.getFullYear();

	const newdate = MonthsAbbr[month] + ' ' + day + ', ' + year;
	return newdate;
};

/**
 * 
 * @param {Object} date_string 
 * @param {string} hourFormate = 24 or 12 
 */
export const dateTimeFormate = (date_string, hourFormate = 24) => {
	let convertedDateTime,
		date = date_string.getDate() < 10 ? '0' + date_string.getDate() : date_string.getDate(),
		month = MonthsAbbr[date_string.getMonth()],
		year = date_string.getFullYear(),
		hours = date_string.getUTCHours(),
		minuts = date_string.getUTCMinutes(),
		dd = 'AM',
		h = hours;

	if (hourFormate === 12) {
		if (h >= 12) {
			h = hours - 12;
			dd = 'PM';
		}
		if (h === 0) {
			h = 12;
		}
		minuts = minuts < 10 ? '0' + minuts : minuts;
		h = h < 10 ? '0' + h : h;

		var replacement = date + ' ' + month + ' ' + year + ', ' + h + ':' + minuts;

		replacement += ' ' + dd;

		convertedDateTime = replacement;
		return convertedDateTime;
	} else {
		convertedDateTime =
			date +
			' ' +
			month +
			' ' +
			year +
			', ' +
			(hours > 9 ? hours : '0' + hours) +
			':' +
			(minuts > 9 ? minuts : '0' + minuts);
	}

	return convertedDateTime;
};

export const sortArrTimeDesc = (arr, key) => {
	return arr.sort(function(a, b) {
		var keyA = new Date(a[key]),
			keyB = new Date(b[key]);
		if (keyA < keyB) return 1;
		if (keyA > keyB) return -1;
		return 0;
	});
};
