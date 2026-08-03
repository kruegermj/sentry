import styled from '@emotion/styled';

import {Button} from '@sentry/scraps/button';
import {Hotkey} from '@sentry/scraps/hotkey';
import {Flex} from '@sentry/scraps/layout';

import {toggleCommandPalette} from 'sentry/actionCreators/modal';
import {
  useCommandPaletteDispatch,
  useCommandPaletteState,
} from 'sentry/components/commandPalette/ui/commandPaletteStateContext';
import {IconSearch} from 'sentry/icons';
import {t} from 'sentry/locale';
import {useOrganization} from 'sentry/utils/useOrganization';
import {useHasCollapsedTopBarActions} from 'sentry/views/navigation/useHasCollapsedTopBarActions';
import {useSeerExplorerContext} from 'sentry/views/seerExplorer/useSeerExplorerContext';
import {isSeerExplorerEnabled} from 'sentry/views/seerExplorer/utils';

export function SearchButton() {
  const organization = useOrganization({allowNull: true});
  const state = useCommandPaletteState();
  const dispatch = useCommandPaletteDispatch();
  const {openSeerExplorer} = useSeerExplorerContext();
  const showLabel = !useHasCollapsedTopBarActions();

  return (
    <StyledButton
      variant="secondary"
      icon={<IconSearch size="xs" />}
      aria-label={t('Search')}
      // Only when the label and its inline hotkey aren't already visible.
      tooltipProps={
        showLabel
          ? undefined
          : {
              title: (
                <Flex align="center" gap="sm">
                  {t('Search')}
                  <Hotkey value="mod+k" />
                </Flex>
              ),
            }
      }
      onClick={() => {
        if (!organization) {
          return;
        }
        toggleCommandPalette(
          {},
          organization,
          state,
          dispatch,
          'button',
          isSeerExplorerEnabled(organization) ? openSeerExplorer : undefined
        );
      }}
    >
      {showLabel ? (
        <Flex align="center" gap="sm">
          {t('Search')}
          <Hotkey value="mod+k" variant="debossed" />
        </Flex>
      ) : null}
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
  > span:last-child {
    overflow: visible;
  }
`;
