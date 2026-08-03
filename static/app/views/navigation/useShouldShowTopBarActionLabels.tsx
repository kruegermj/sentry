import {usePrimaryNavigation} from 'sentry/views/navigation/primaryNavigationContext';

/**
 * Whether TopBar actions have enough room to show their labels.
 *
 * Tied to the navigation layout rather than a width of its own: labels are
 * hidden in the mobile layout, where the navigation row is too tight and also
 * hosts the relocated search trigger. Sharing one signal keeps the TopBar and
 * that row from disagreeing.
 */
export function useShouldShowTopBarActionLabels() {
  return usePrimaryNavigation().layout !== 'mobile';
}
