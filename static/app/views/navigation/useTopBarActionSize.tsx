import {useResponsivePropValue} from '@sentry/scraps/layout';

import {usePrimaryNavigation} from 'sentry/views/navigation/primaryNavigationContext';

export type TopBarActionSize = 'collapsed' | 'medium' | 'full';

export function useTopBarActionSize(): TopBarActionSize {
  const {layout} = usePrimaryNavigation();
  const responsiveSize = useResponsivePropValue<TopBarActionSize>({
    zero: 'collapsed',
    xl: 'medium',
    '4xl': 'full',
  });

  return layout === 'mobile' ? 'collapsed' : responsiveSize;
}

export function useIsSearchInMobileRow() {
  return usePrimaryNavigation().layout === 'mobile';
}
