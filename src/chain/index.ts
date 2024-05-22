import fs from 'fs'
import { assertNotNull } from '@subsquid/substrate-processor'
import { ProcessorConfig, ChainApi, IChainData } from './interfaces'

const ensureEnvVariable = (name: string): string => {
  return assertNotNull(
    process.env[name],
    `Missing env variable ${name}`
  );
}

function getChain(): { api: ChainApi; config: ProcessorConfig } {
  const chainName = ensureEnvVariable('CHAIN')
  const chainRpcEndpoint = ensureEnvVariable('CHAIN_RPC_ENDPOINT')
  const chainGateway = ensureEnvVariable('CHAIN_GATEWAY')

  const chainNameKebab = chainName.split('_').join('-')
  const chainAPI = require(`./${chainNameKebab}`).default

  let chainsConfig: IChainData[]
  try {
    const data = fs.readFileSync('assets/chains-data.json')
    chainsConfig = JSON.parse(data.toString())
  } catch (err) {
    console.error("Can't read chain config from 'assets/chains-data.json : ")
    throw err
  }

  const chainConfig = chainsConfig.find((chain) => chain.network === chainName)
  if (!chainConfig) {
    throw new Error(`Chain ${chainName} not found in assets/chains-data.json`)
  }

  let processorConfig: ProcessorConfig = {
    name: chainConfig.network,
    prefix: chainConfig.prefix,
    gateway: chainGateway,
    endpoint: {
      url: chainRpcEndpoint,
      rateLimit: 10,
    },
  }

  if (chainAPI.customConfig) {
    Object.assign(processorConfig, chainAPI.customConfig)
  }

  return { api: chainAPI.api, config: processorConfig }
}

export const chain = getChain()
