import {useResponsivePropValue} from '@sentry/scraps/layout';

/**
 * Whether the TopBar action triggers have room to expand beyond icon-only.
 *
 * Resolved against the nearest query container (the app content stack) rather
 * than the viewport, so opening the Seer Explorer sidebar collapses the
 * triggers the same way narrowing the window does.
 */
export function useHasExpandedTopBarActions() {
  return useResponsivePropValue({zero: false, '2xl': true});
}
