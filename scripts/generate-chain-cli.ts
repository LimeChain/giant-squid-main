import fs from 'fs';
import { CaseConverterEnum, generateTemplateFiles } from 'generate-template-files';

generateTemplateFiles([
  {
    option: 'typegen',
    defaultCase: CaseConverterEnum.None,
    entry: {
      folderPath: 'templates/typegen-templates/__network__.json',
    },
    stringReplacers: ['__network__', '__chainArchiveName__'],
    output: {
      path: `typegen/__network__.json`,
      pathAndFileNameDefaultCase: CaseConverterEnum.KebabCase,
      overwrite: false,
    },
  },
  {
    option: 'src',
    defaultCase: CaseConverterEnum.None,
    entry: {
      folderPath: 'templates/src-chain-templates/__network__',
    },
    stringReplacers: ['__network__', '__prefix__'],
    output: {
      path: `./src/chain/__network__`,
      pathAndFileNameDefaultCase: CaseConverterEnum.KebabCase,
      overwrite: false,
    },
  },
  {
    option: 'manifest',
    defaultCase: CaseConverterEnum.None,
    entry: {
      folderPath: 'templates/manifest-tempates/__network__.yaml',
    },
    stringReplacers: ['__network__', '__displayName__'],
    output: {
      path: `./manifests/__network__.yaml`,
      pathAndFileNameDefaultCase: CaseConverterEnum.KebabCase,
      overwrite: false,
    },
  },
]);
