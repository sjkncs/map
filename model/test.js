import fs from 'fs'
import tf from '@tensorflow/tfjs-node'

import buildCharVocabulary from './utils/buildVocabulary.js'
import textToVector from './utils/textToVector.js'

// 加载模型和字表
const { charToIndex, vocabSize, UNK_INDEX } = JSON.parse(
  fs.readFileSync('./model/vocab.json', 'utf8'),
)
const charMap = new Map(charToIndex)
const model = await tf.loadLayersModel('file://./model/model.json')

// 预测
function predict(text) {
  const input = tf.tensor2d([textToVector(text, charMap, vocabSize, UNK_INDEX)])
  const output = model.predict(input)
  const prob = output.dataSync()[0]
  input.dispose()
  output.dispose()
  return prob
}

console.log(predict('展示选项'))
