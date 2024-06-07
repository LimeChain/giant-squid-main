import { ProcessorConfig } from '../interfaces';
import api from './api';

const customConfig: Partial<ProcessorConfig> = {
  typesBundle: 'assets/type-bundles/zeitgeist.json',
};

export default {
  api,
  customConfig,
};
