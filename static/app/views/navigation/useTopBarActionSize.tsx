import {useResponsivePropValue} from '@sentry/scraps/layout';

import {usePrimaryNavigation} from 'sentry/views/navigation/primaryNavigationContext';

export type TopBarActionSize = 'collapsed' | 'medium' | 'full';

/**
 * How much room the TopBar action triggers have to expand.
 *
 * - `collapsed`: icon only
 * - `medium`: icon + label, no hotkey
 * - `full`: icon + label + hotkey
 *
 * Resolved against the nearest query container (the app content stack) rather
 * than the viewport, so opening the Seer Explorer sidebar collapses the
 * triggers the same way narrowing the window does.
 */
export function useTopBarActionSize(): TopBarActionSize {
  return useResponsivePropValue({zero: 'collapsed', xl: 'medium', '4xl': 'full'});
}

/**
 * Whether the search trigger lives in the mobile navigation row instead of the
 * TopBar. Only true when collapsed *and* that row is mounted — otherwise there
 * is nowhere to move it to and it stays in the TopBar as an icon.
 *
 * Both render sites derive from this so search can never appear twice.
 */
export function useIsSearchInMobileRow(): boolean {
  const {layout} = usePrimaryNavigation();
  return useTopBarActionSize() === 'collapsed' && layout === 'mobile';
}
