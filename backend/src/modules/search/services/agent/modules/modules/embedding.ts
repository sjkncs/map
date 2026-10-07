import path from 'path'
import { fileURLToPath } from 'url'
import { pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modelPath = path.resolve(__dirname, './bge-small-zh')

let extractor: FeatureExtractionPipeline | null = null
const getExtractor = async () => {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', modelPath)
  }
  return extractor
}

export const embed = async (text: string): Promise<number[]> => {
  const model = await getExtractor()
  const output = await model(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}
