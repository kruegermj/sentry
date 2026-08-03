import {usePrimaryNavigation} from 'sentry/views/navigation/primaryNavigationContext';

/**
 * Whether the TopBar action triggers collapse to bare icons.
 *
 * Tied to the navigation layout rather than a width of its own: the mobile
 * layout is exactly the case where the row is too tight for labels, and it is
 * also where the mobile navigation row exists to host the relocated search
 * trigger. Sharing one signal keeps the TopBar and that row from disagreeing.
 */
export function useHasCollapsedTopBarActions() {
  return usePrimaryNavigation().layout === 'mobile';
}
