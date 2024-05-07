import type { FullIconifyIcon } from '../icon';
import type { FullIconCustomisations } from '../customisations';
import { calculateSize } from './size';

/**
 * Get preserveAspectRatio value
 */
function preserveAspectRatio(props: FullIconCustomisations): string {
	let result = '';
	switch (props.hAlign) {
		case 'left':
			result += 'xMin';
			break;

		case 'right':
			result += 'xMax';
			break;

		default:
			result += 'xMid';
	}
	switch (props.vAlign) {
		case 'top':
			result += 'YMin';
			break;

		case 'bottom':
			result += 'YMax';
			break;

		default:
			result += 'YMid';
	}
	result += props.slice ? ' slice' : ' meet';
	return result;
}

/**
 * Interface for getSVGData() result
 */
export interface IconifyIconBuildResult {
	attributes: {
		// Attributes for <svg>
		width: string;
		height: string;
		preserveAspectRatio: string;
		viewBox: string;
	};
	// Content
	body: string;
	// True if 'vertical-align: -0.125em' or equivalent should be added by implementation
	inline?: boolean;
}

/**
 * Interface for viewBox
 */
interface ViewBox {
	left: number;
	top: number;
	width: number;
	height: number;
}

/**
 * Get SVG attributes and content from icon + customisations
 *
 * Does not generate style to make it compatible with frameworks that use objects for style, such as React.
 * Instead, it generates 'inline' value. If true, rendering engine should add verticalAlign: -0.125em to icon.
 *
 * Customisations should be normalised by platform specific parser.
 * Result should be converted to <svg> by platform specific parser.
 * Use replaceIDs to generate unique IDs for body.
 */
export function iconToSVG(
	icon: FullIconifyIcon,
	customisations: FullIconCustomisations
): IconifyIconBuildResult {
	// viewBox
	const box: ViewBox = {
		left: icon.left,
		top: icon.top,
		width: icon.width,
		height: icon.height,
	};

	// Body
	let body = icon.body;

	// Apply transformations
	[icon, customisations].forEach((props) => {
		const transformations: string[] = [];
		const hFlip = props.hFlip;
		const vFlip = props.vFlip;
		let rotation = props.rotate;

		// Icon is flipped first, then rotated
		if (hFlip) {
			if (vFlip) {
				rotation += 2;
			} else {
				// Horizontal flip
				transformations.push(
					'translate(' +
						(box.width + box.left).toString() +
						' ' +
						(0 - box.top).toString() +
						')'
				);
				transformations.push('scale(-1 1)');
				box.top = box.left = 0;
			}
		} else if (vFlip) {
			// Vertical flip
			transformations.push(
				'translate(' +
					(0 - box.left).toString() +
					' ' +
					(box.height + box.top).toString() +
					')'
			);
			transformations.push('scale(1 -1)');
			box.top = box.left = 0;
		}

		let tempValue: number;
		if (rotation < 0) {
			rotation -= Math.floor(rotation / 4) * 4;
		}
		rotation = rotation % 4;
		switch (rotation) {
			case 1:
				// 90deg
				tempValue = box.height / 2 + box.top;
				transformations.unshift(
					'rotate(90 ' +
						tempValue.toString() +
						' ' +
						tempValue.toString() +
						')'
				);
				break;

			case 2:
				// 180deg
				transformations.unshift(
					'rotate(180 ' +
						(box.width / 2 + box.left).toString() +
						' ' +
						(box.height / 2 + box.top).toString() +
						')'
				);
				break;

			case 3:
				// 270deg
				tempValue = box.width / 2 + box.left;
				transformations.unshift(
					'rotate(-90 ' +
						tempValue.toString() +
						' ' +
						tempValue.toString() +
						')'
				);
				break;
		}

		if (rotation % 2 === 1) {
			// Swap width/height and x/y for 90deg or 270deg rotation
			if (box.left !== 0 || box.top !== 0) {
				tempValue = box.left;
				box.left = box.top;
				box.top = tempValue;
			}
			if (box.width !== box.height) {
				tempValue = box.width;
				box.width = box.height;
				box.height = tempValue;
			}
		}

		if (transformations.length) {
			body =
				'<g transform="' +
				transformations.join(' ') +
				'">' +
				body +
				'</g>';
		}
	});

	// Calculate dimensions
	let width, height;

	if (customisations.width === null && customisations.height === null) {
		// Set height to '1em', calculate width
		height = '1em';
		width = calculateSize(height, box.width / box.height);
	} else if (
		customisations.width !== null &&
		customisations.height !== null
	) {
		// Values are set
		width = customisations.width;
		height = customisations.height;
	} else if (customisations.height !== null) {
		// Height is set
		height = customisations.height;
		width = calculateSize(height, box.width / box.height);
	} else {
		// Width is set
		width = customisations.width as number | string;
		height = calculateSize(width, box.height / box.width);
	}

	// Check for 'auto'
	if (width === 'auto') {
		width = box.width;
	}
	if (height === 'auto') {
		height = box.height;
	}

	// Convert to string
	width = typeof width === 'string' ? width : width.toString() + '';
	height = typeof height === 'string' ? height : height.toString() + '';

	// Result
	const result: IconifyIconBuildResult = {
		attributes: {
			width,
			height,
			preserveAspectRatio: preserveAspectRatio(customisations),
			viewBox:
				box.left.toString() +
				' ' +
				box.top.toString() +
				' ' +
				box.width.toString() +
				' ' +
				box.height.toString(),
		},
		body,
	};

	if (customisations.inline) {
		result.inline = true;
	}

	return result;
}
