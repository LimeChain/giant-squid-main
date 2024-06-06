import fs from 'fs';
import { CaseConverterEnum, generateTemplateFilesBatch } from 'generate-template-files';

interface IChainData {
  prefix: number;
  network: string;
  displayName: string;
  symbols: string[];
  decimals: string[];
  archiveName: string;
}

const chainsData: IChainData[] = JSON.parse(fs.readFileSync('assets/chains-data.json').toString());

for (const chain of chainsData) {
  console.log(chain.network);
  generateTemplateFilesBatch([
    {
      option: 'typegen',
      defaultCase: CaseConverterEnum.None,
      entry: {
        folderPath: 'templates/typegen-templates/__network__.json',
      },
      dynamicReplacers: [
        { slot: '__network__', slotValue: chain.network },
        { slot: '__chainArchiveName__', slotValue: chain.archiveName },
      ],
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
      dynamicReplacers: [
        { slot: '__network__', slotValue: chain.network },
        { slot: '__prefix__', slotValue: String(chain.prefix) },
      ],
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
      dynamicReplacers: [
        { slot: '__network__', slotValue: chain.network },
        { slot: '__displayName__', slotValue: chain.displayName },
      ],
      output: {
        path: `./manifests/__network__.yaml`,
        pathAndFileNameDefaultCase: CaseConverterEnum.KebabCase,
        overwrite: false,
      },
    },
  ])
    .then()
    .catch((err) => {
      throw err;
    });
}
