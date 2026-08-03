import {DropdownMenu, type MenuItemProps} from 'sentry/components/dropdownMenu';
import type {UseFeedbackOptions} from 'sentry/components/feedbackButton/useFeedbackSDKIntegration';
import {IconEllipsis, IconMegaphone} from 'sentry/icons';
import {t} from 'sentry/locale';
import {useFeedbackForm} from 'sentry/utils/useFeedbackForm';

interface TopBarOverflowMenuProps {
  feedbackOptions: UseFeedbackOptions;
  /**
   * Whether to offer Give Feedback. False when a page registered its own
   * feedback trigger, which stays inline rather than folding in here.
   */
  includeFeedback: boolean;
}

/**
 * The action triggers that don't fit once the TopBar collapses. Search and Ask
 * Seer keep their own buttons — search is the primary action, and Ask Seer's
 * icon carries live state a menu item can't convey.
 *
 * Renders nothing when there's nothing to offer, so the button bar doesn't show
 * an overflow trigger that opens an empty menu.
 */
export function TopBarOverflowMenu({
  includeFeedback,
  feedbackOptions,
}: TopBarOverflowMenuProps) {
  const openForm = useFeedbackForm();

  const items: MenuItemProps[] = [];

  if (includeFeedback && openForm) {
    items.push({
      key: 'give-feedback',
      label: t('Give Feedback'),
      leadingItems: <IconMegaphone />,
      onAction: () => openForm(feedbackOptions),
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <DropdownMenu
      items={items}
      size="sm"
      position="bottom-end"
      triggerProps={{
        'aria-label': t('More actions'),
        tooltipProps: {title: t('More actions')},
        icon: <IconEllipsis />,
        showChevron: false,
        size: 'sm',
      }}
    />
  );
}
