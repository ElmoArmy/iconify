import { iconToSVG } from '@iconify/utils/lib/svg/build';
import { fullIcon, iconDefaults } from '@iconify/utils/lib/icon';
import {
	defaults,
	mergeCustomisations,
} from '@iconify/utils/lib/customisations';

describe('Testing iconToSVG', () => {
	it('Empty icon', () => {
		const custom = { ...defaults };
		const icon = { ...iconDefaults, body: '' };
		const expected = {
			attributes: {
				width: '1em',
				height: '1em',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 16 16',
			},
			body: '',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	it('Auto size, inline, body', () => {
		const custom = mergeCustomisations(defaults, {
			inline: true,
			height: 'auto',
		});
		const icon = fullIcon({
			body: '<path d="" />',
		});
		const expected = {
			attributes: {
				width: '16',
				height: '16',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 16 16',
			},
			body: '<path d="" />',
			inline: true,
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	it('Auto size, inline, body', () => {
		const custom = mergeCustomisations(defaults, {
			inline: true,
			height: 'auto',
		});
		const icon = fullIcon({
			body: '<path d="" />',
		});
		const expected = {
			attributes: {
				width: '16',
				height: '16',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 16 16',
			},
			body: '<path d="" />',
			inline: true,
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	it('Custom size, alignment', () => {
		const custom = mergeCustomisations(defaults, {
			height: 'auto',
			hAlign: 'left',
			slice: true,
		});
		const icon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected = {
			attributes: {
				width: '20',
				height: '16',
				preserveAspectRatio: 'xMinYMid slice',
				viewBox: '0 0 20 16',
			},
			body: '<path d="..." />',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	it('Rotation, alignment', () => {
		const custom = mergeCustomisations(defaults, {
			height: '40px',
			vAlign: 'bottom',
			rotate: 1,
		});
		const icon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected = {
			attributes: {
				width: '32px',
				height: '40px',
				preserveAspectRatio: 'xMidYMax meet',
				viewBox: '0 0 16 20',
			},
			body: '<g transform="rotate(90 8 8)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	it('Negative rotation', () => {
		const custom = mergeCustomisations(defaults, {
			height: '40px',
			rotate: -1,
		});
		const icon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected = {
			attributes: {
				width: '32px',
				height: '40px',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 16 20',
			},
			body: '<g transform="rotate(-90 10 10)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	it('Flip, alignment', () => {
		const custom = mergeCustomisations(defaults, {
			height: '32',
			vAlign: 'top',
			hAlign: 'right',
			hFlip: true,
		});
		const icon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected = {
			attributes: {
				width: '40',
				height: '32',
				preserveAspectRatio: 'xMaxYMin meet',
				viewBox: '0 0 20 16',
			},
			body: '<g transform="translate(20 0) scale(-1 1)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	it('Flip, rotation', () => {
		const custom = mergeCustomisations(defaults, {
			hFlip: true,
			rotate: 1,
		});
		const icon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected = {
			attributes: {
				width: '0.8em',
				height: '1em',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 16 20',
			},
			body: '<g transform="rotate(90 8 8) translate(20 0) scale(-1 1)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	it('Flip icon that is rotated by default', () => {
		const custom = mergeCustomisations(defaults, {
			hFlip: true,
		});
		const icon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
			rotate: 1,
		});

		// Horizontally flipping icon that has 90 or 270 degrees rotation will result in vertical flip.
		// Therefore result should be rotation + vertical flip to visually match horizontal flip on normal icon.
		const expected = {
			attributes: {
				width: '0.8em',
				height: '1em',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 16 20',
			},
			body: '<g transform="translate(16 0) scale(-1 1)"><g transform="rotate(90 8 8)"><path d="..." /></g></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	it('Flip and rotation canceling eachother', () => {
		const custom = mergeCustomisations(defaults, {
			width: '1em',
			height: 'auto',
			hFlip: true,
			vFlip: true,
			rotate: 2,
		});
		const icon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected = {
			attributes: {
				width: '1em',
				height: '16',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 20 16',
			},
			body: '<path d="..." />',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	it('Flip with real icon', () => {
		const iconBody =
			'<g stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" fill-rule="evenodd"><path d="M40 64l48-48" class="animation-delay-0 animation-duration-10 animate-stroke stroke-length-102"/><path d="M40 64l48 48" class="animation-delay-0 animation-duration-10 animate-stroke stroke-length-102"/></g>';

		const custom = mergeCustomisations(defaults, {});
		const icon = fullIcon({
			body: iconBody,
			width: 128,
			height: 128,
			hFlip: true,
		});
		const expected = {
			attributes: {
				width: '1em',
				height: '1em',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 128 128',
			},
			body:
				'<g transform="translate(128 0) scale(-1 1)">' +
				iconBody +
				'</g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});
});
