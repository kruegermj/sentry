import {OrganizationIntegrationsFixture} from 'sentry-fixture/organizationIntegrations';

import {render, screen, waitFor} from 'sentry-test/reactTestingLibrary';

import type {ScmMessagingSetup} from 'sentry/components/onboarding/scm/scmMessagingSetup';
import type {OnboardingSelectedSDK} from 'sentry/types/onboarding';

import {ScmMessaging} from './scmMessaging';

const selectedPlatform: OnboardingSelectedSDK = {
  key: 'javascript-nextjs',
  name: 'Next.js',
  language: 'javascript',
  type: 'framework',
  link: null,
  category: 'browser',
};

const selectedMessagingSetup: ScmMessagingSetup = {
  mode: 'selected',
  providerKey: 'slack',
  integrationId: '15',
  channelId: 'C123',
};

function renderMessaging(
  onMessagingSetupChange = jest.fn(),
  messagingSetup = selectedMessagingSetup
) {
  return render(
    <ScmMessaging
      messagingSetup={messagingSetup}
      onMessagingSetupChange={onMessagingSetupChange}
      selectedPlatform={selectedPlatform}
    />
  );
}

describe('ScmMessaging', () => {
  afterEach(() => {
    MockApiClient.clearMockResponses();
  });

  it('revalidates a restored destination before showing it as selected', async () => {
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/integrations/',
      match: [MockApiClient.matchQuery({integrationType: 'messaging'})],
      body: [OrganizationIntegrationsFixture({id: '15'})],
    });
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/integrations/15/channels/',
      body: {
        results: [{id: 'C123', name: 'alerts', display: '#alerts', type: 'text'}],
      },
    });
    const onMessagingSetupChange = jest.fn();

    renderMessaging(onMessagingSetupChange);

    expect(await screen.findByText('Destination selected')).toBeInTheDocument();
    await waitFor(() => {
      expect(onMessagingSetupChange).toHaveBeenCalledWith({
        ...selectedMessagingSetup,
        channelName: '#alerts',
      });
    });
  });

  it('clears a missing integration with an explanation', async () => {
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/integrations/',
      match: [MockApiClient.matchQuery({integrationType: 'messaging'})],
      body: [],
    });
    const onMessagingSetupChange = jest.fn();

    renderMessaging(onMessagingSetupChange);

    expect(
      await screen.findByText(
        "We couldn't find the saved integration. Choose a destination again."
      )
    ).toBeInTheDocument();
    expect(onMessagingSetupChange).toHaveBeenCalledWith({mode: 'unconfigured'});
    expect(screen.queryByText('Destination selected')).not.toBeInTheDocument();
  });

  it('clears a missing channel with an explanation', async () => {
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/integrations/',
      match: [MockApiClient.matchQuery({integrationType: 'messaging'})],
      body: [OrganizationIntegrationsFixture({id: '15'})],
    });
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/integrations/15/channels/',
      body: {results: []},
    });
    const onMessagingSetupChange = jest.fn();

    renderMessaging(onMessagingSetupChange);

    expect(
      await screen.findByText(
        "We couldn't find the saved channel. Choose a destination again."
      )
    ).toBeInTheDocument();
    expect(onMessagingSetupChange).toHaveBeenCalledWith({mode: 'unconfigured'});
    expect(screen.queryByText('Destination selected')).not.toBeInTheDocument();
  });
});
