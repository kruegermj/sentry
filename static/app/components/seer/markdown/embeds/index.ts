import {Autofix} from './components/autofix';
import {Docs} from './components/docs';
import {Timestamp} from './components/timestamp';
import {SeerEmbedRegistry} from './registry';

const embeds = [Docs, Timestamp, Autofix];
for (const embed of embeds) {
  SeerEmbedRegistry.register(embed.displayName, embed);
}

export {SeerEmbedRegistry} from './registry';
