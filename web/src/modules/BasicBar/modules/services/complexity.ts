import '@tensorflow/tfjs-backend-webgl'
import * as tf from '@tensorflow/tfjs-core'
import * as tfl from '@tensorflow/tfjs-layers'

// 加载字表和模型
let charMap: Map<string, number>
let vocabSize: number
let UNK_INDEX: number
let model: tfl.LayersModel
const initModel = async () => {
  try {
    const res = await fetch('/model/vocab.json')
    const { charToIndex, vocabSize: size, UNK_INDEX: unk } = await res.json()
    charMap = new Map(charToIndex)
    vocabSize = size
    UNK_INDEX = unk
    model = await tfl.loadLayersModel('/model/model.json')
    const dummyInput = tf.tensor2d([new Array(vocabSize).fill(0)])
    model.predict(dummyInput)
    dummyInput.dispose()
  } catch {
    alert('模型加载失败')
  }
}
initModel()

const textToVector = (
  text: string,
  charMap: any,
  vocabSize: number,
  UNK_INDEX: number,
): number[] => {
  const vector: number[] = new Array(vocabSize).fill(0)
  const chars = text
    .split('')
    .map((char) => (char >= 'A' && char <= 'Z' ? char.toLowerCase() : char))

  chars.forEach((char) => {
    if (char.trim() === '') return
    const idx = charMap.get(char)
    if (idx !== undefined) {
      vector[idx] += 1
    } else {
      vector[UNK_INDEX] += 1
    }
  })

  return vector
}

export const predictComplexity = async (inputText: string) => {
  if (!charMap || !model) {
    alert('模型未初始化')
    return
  }
  const input = tf.tensor2d([textToVector(inputText, charMap, vocabSize, UNK_INDEX)])
  const output = model.predict(input) as tf.Tensor
  const prob = (await output.data())[0]
  console.log(prob)
  input.dispose()
  output.dispose()
  return prob
}
