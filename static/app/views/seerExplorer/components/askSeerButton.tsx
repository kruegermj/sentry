import styled from '@emotion/styled';
import {useReducedMotion} from 'framer-motion';

import {Button} from '@sentry/scraps/button';
import {Hotkey} from '@sentry/scraps/hotkey';
import {Container, Flex} from '@sentry/scraps/layout';
import {IndeterminateLoader} from '@sentry/scraps/loader';
import {StatusIndicator} from '@sentry/scraps/statusIndicator';
import {Text} from '@sentry/scraps/text';

import {IconSeer} from 'sentry/icons';
import {t} from 'sentry/locale';
import {useHasCollapsedTopBarActions} from 'sentry/views/navigation/useHasCollapsedTopBarActions';
import {useSeerExplorerContext} from 'sentry/views/seerExplorer/useSeerExplorerContext';

export function AskSeerButton() {
  const {isOpen, toggleSeerExplorer, sessionState: state} = useSeerExplorerContext();
  const showMessageIndicator = !isOpen && state === 'done-thinking';
  const prefersReducedMotion = useReducedMotion();
  const showLabel = !useHasCollapsedTopBarActions();

  return (
    <SeerButton
      variant="secondary"
      onClick={toggleSeerExplorer}
      aria-label={state === 'thinking' ? t('Seer is thinking...') : t('Ask Seer')}
      aria-expanded={isOpen ? true : undefined}
      // Names the button only when it's a bare icon; with the label inline the
      // button already says what it is.
      tooltipProps={
        showLabel
          ? undefined
          : {
              title: (
                <Flex align="center" gap="sm">
                  {t('Ask Seer')}
                  <Hotkey value="mod+/" />
                </Flex>
              ),
            }
      }
      icon={
        <Flex position="relative">
          <IconSeer
            animation={
              showMessageIndicator
                ? 'waiting'
                : state === 'thinking'
                  ? 'loading'
                  : undefined
            }
          />
          {/* Anchored to the icon when there is no label to hang it off of. */}
          {showMessageIndicator && !showLabel ? <MessageIndicator /> : null}
        </Flex>
      }
    >
      {showLabel ? (
        <Flex position="relative">
          <Flex
            align="center"
            gap="sm"
            visibility={state === 'thinking' ? 'hidden' : undefined}
          >
            <Container>{t('Ask Seer')}</Container>
            <Hotkey value="mod+/" variant="debossed" />
          </Flex>
          {/*
           * Overlays the hidden label so the button keeps its width while
           * thinking. Only rendered with the label — collapsed to an icon there
           * is no box to overlay, and the icon's own `loading` animation
           * already conveys the state.
           */}
          {state === 'thinking' ? (
            <SeerLoader
              position="absolute"
              inset="0"
              align="center"
              marginLeft="auto"
              marginRight="auto"
            >
              {prefersReducedMotion ? (
                <Text variant="primary">{t('Thinking...')}</Text>
              ) : (
                <IndeterminateLoader variant="monochrome" />
              )}
            </SeerLoader>
          ) : null}
          {showMessageIndicator ? <MessageIndicator /> : null}
        </Flex>
      ) : null}
    </SeerButton>
  );
}

function MessageIndicator() {
  return (
    <Flex
      position="absolute"
      right="-6px"
      top="-2px"
      width="8px"
      height="8px"
      align="center"
      justify="center"
    >
      <StatusIndicator variant="accent" />
    </Flex>
  );
}

const SeerLoader = styled(Flex)`
  color: ${p => p.theme.tokens.graphics.accent.vibrant};
`;

const SeerButton = styled(Button)`
  > span:last-child {
    overflow: visible;
  }
`;
