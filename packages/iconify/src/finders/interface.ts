import type { IconifyElement } from '../modules/element';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type { IconifyIconCustomisations } from '@iconify/utils/lib/customisations';

/**
 * find - find elements that match plugin within root element
 */
export type IconifyFinderFind = (root: HTMLElement) => NodeList;

/**
 * name - get icon name from element
 */
export type IconifyFinderName = (
	element: IconifyElement
) => IconifyIconName | string | null;

/**
 * customisations - get icon customisations
 */
export type IconifyFinderCustomisations = (
	element: IconifyElement,
	defaultVaues?: IconifyIconCustomisations
) => IconifyIconCustomisations;

/**
 * classes - filter class list
 */
export type IconifyFinderClassFilter = (
	// Classes to filter
	classList: string[]
) => string[];

/**
 * Interface for finder module
 */
export interface IconifyFinder {
	find: IconifyFinderFind;
	name: IconifyFinderName;
	customisations: IconifyFinderCustomisations;
	classFilter: IconifyFinderClassFilter;
}
