import {useEffect, useMemo, useState} from 'react';
import {skipToken, useQuery} from '@tanstack/react-query';

import {Alert} from '@sentry/scraps/alert';
import {Stack} from '@sentry/scraps/layout';
import {Heading, Text} from '@sentry/scraps/text';

import type {ScmMessagingSetup} from 'sentry/components/onboarding/scm/scmMessagingSetup';
import {t} from 'sentry/locale';
import type {OrganizationIntegration} from 'sentry/types/integrations';
import type {OnboardingSelectedSDK} from 'sentry/types/onboarding';
import {apiOptions} from 'sentry/utils/api/apiOptions';
import {useOrganization} from 'sentry/utils/useOrganization';
import {SCM_STEP_CONTENT_WIDTH} from 'sentry/views/onboarding/consts';

import type {StepProps} from './types';

type Channel = {
  display: string;
  id: string;
  name: string;
};

type ChannelListResponse = {
  results: Channel[];
};

type StaleDestinationReason = 'channel' | 'integration';

interface ScmMessagingProps {
  messagingSetup: ScmMessagingSetup;
  onMessagingSetupChange: (messagingSetup: ScmMessagingSetup) => void;
  selectedPlatform: OnboardingSelectedSDK;
  genBackButton?: StepProps['genBackButton'];
}

/**
 * Revalidates the organization-scoped identifiers stored in session state.
 * A restored selection is not usable until both queries succeed and resolve
 * the saved integration and channel.
 */
export function useScmMessagingSetupValidation({
  messagingSetup,
  onMessagingSetupChange,
}: Pick<ScmMessagingProps, 'messagingSetup' | 'onMessagingSetupChange'>) {
  const organization = useOrganization();
  const [staleReason, setStaleReason] = useState<StaleDestinationReason>();
  const hasSelectedDestination = messagingSetup.mode === 'selected';

  const integrationsQuery = useQuery(
    apiOptions.as<OrganizationIntegration[]>()(
      '/organizations/$organizationIdOrSlug/integrations/',
      {
        path: hasSelectedDestination
          ? {organizationIdOrSlug: organization.slug}
          : skipToken,
        query: {integrationType: 'messaging'},
        staleTime: 0,
      }
    )
  );

  const integration = useMemo(() => {
    if (!hasSelectedDestination) {
      return;
    }

    return integrationsQuery.data?.find(
      item =>
        item.id === messagingSetup.integrationId &&
        (item.provider.key === messagingSetup.providerKey ||
          item.provider.slug === messagingSetup.providerKey) &&
        item.status === 'active' &&
        item.organizationIntegrationStatus === 'active'
    );
  }, [hasSelectedDestination, integrationsQuery.data, messagingSetup]);

  const channelsQuery = useQuery(
    apiOptions.as<ChannelListResponse>()(
      '/organizations/$organizationIdOrSlug/integrations/$integrationId/channels/',
      {
        path: integration
          ? {
              organizationIdOrSlug: organization.slug,
              integrationId: integration.id,
            }
          : skipToken,
        staleTime: 0,
      }
    )
  );

  const channel = useMemo(() => {
    if (!hasSelectedDestination) {
      return;
    }
    return channelsQuery.data?.results.find(item => item.id === messagingSetup.channelId);
  }, [channelsQuery.data, hasSelectedDestination, messagingSetup]);

  useEffect(() => {
    if (messagingSetup.mode === 'selected') {
      setStaleReason(undefined);
    }
  }, [messagingSetup]);

  useEffect(() => {
    if (messagingSetup.mode !== 'selected' || !integrationsQuery.isSuccess) {
      return;
    }

    if (!integration) {
      setStaleReason('integration');
      onMessagingSetupChange({mode: 'unconfigured'});
      return;
    }

    if (!channelsQuery.isSuccess) {
      return;
    }

    if (!channel) {
      setStaleReason('channel');
      onMessagingSetupChange({mode: 'unconfigured'});
      return;
    }

    const channelName = channel.display || channel.name;
    if (channelName !== messagingSetup.channelName) {
      onMessagingSetupChange({...messagingSetup, channelName});
    }
  }, [
    channel,
    channelsQuery.isSuccess,
    integration,
    integrationsQuery.isSuccess,
    messagingSetup,
    onMessagingSetupChange,
  ]);

  return {
    isError:
      hasSelectedDestination &&
      (integrationsQuery.isError || (integration !== undefined && channelsQuery.isError)),
    isPending:
      hasSelectedDestination &&
      (integrationsQuery.isFetching ||
        (integration !== undefined && channelsQuery.isFetching)),
    isValid:
      hasSelectedDestination &&
      integrationsQuery.isSuccess &&
      !integrationsQuery.isFetching &&
      channelsQuery.isSuccess &&
      !channelsQuery.isFetching &&
      channel !== undefined,
    staleReason,
  };
}

export function ScmMessaging({
  genBackButton,
  messagingSetup,
  onMessagingSetupChange,
  selectedPlatform,
}: ScmMessagingProps) {
  const validation = useScmMessagingSetupValidation({
    messagingSetup,
    onMessagingSetupChange,
  });

  return (
    <Stack align="center" gap="2xl" flexGrow={1}>
      <Stack gap="xl" maxWidth={`min(${SCM_STEP_CONTENT_WIDTH}, 100%)`} width="100%">
        <Stack gap="md">
          <Heading as="h2" size="4xl">
            {t('Get alerts where your team works')}
          </Heading>
          <Text variant="muted" size="md" density="comfortable">
            {t(
              "Choose where to send alerts for your %s project. We'll create the project and its alert rules when you continue.",
              selectedPlatform.name
            )}
          </Text>
        </Stack>

        {validation.staleReason === 'integration' && (
          <Alert variant="warning" showIcon>
            {t("We couldn't find the saved integration. Choose a destination again.")}
          </Alert>
        )}
        {validation.staleReason === 'channel' && (
          <Alert variant="warning" showIcon>
            {t("We couldn't find the saved channel. Choose a destination again.")}
          </Alert>
        )}
        {validation.isError && (
          <Alert variant="danger" showIcon>
            {t("We couldn't check the saved destination. Reload the page to try again.")}
          </Alert>
        )}
        {validation.isPending && (
          <Text variant="muted">{t('Checking saved destination')}</Text>
        )}
        {validation.isValid && (
          <Text variant="success" bold>
            {t('Destination selected')}
          </Text>
        )}

        <Text variant="muted">{t('Email alerts will be included by default')}</Text>
        <Stack align="start">{genBackButton?.()}</Stack>
      </Stack>
    </Stack>
  );
}
