import fs from 'fs'
import * as tf from '@tensorflow/tfjs-node'

import buildCharVocabulary from './utils/buildVocabulary.js'
import textToVector from './utils/textToVector.js'

// 读取训练数据
const commonData = JSON.parse(fs.readFileSync('./data/common.json', 'utf8')).map((text) => [
  text,
  0,
])
const agentData = JSON.parse(fs.readFileSync('./data/agent.json', 'utf8')).map((text) => [text, 1])
const data = commonData.concat(agentData)
console.log(`普通数据：${commonData.length}`)
console.log(`Agent 数据：${agentData.length}`)
tf.util.shuffle(data)
const texts = data.map((item) => item[0])
const labels = data.map((item) => item[1])

console.log('正在建立字表...')
const { charMap, vocabSize, UNK_INDEX } = buildCharVocabulary(texts)
console.log(`字表大小: ${vocabSize} (含 UNK)`)

// 向量化
console.log('正在向量化文本...')
const vectors = texts.map((text) => textToVector(text, charMap, vocabSize, UNK_INDEX))
const xs = tf.tensor2d(vectors)
const ys = tf.tensor1d(labels, 'int32')
console.log('输入张量形状:', xs.shape)
console.log('标签张量形状:', ys.shape)

// 创建神经网络
const model = tf.sequential()
model.add(tf.layers.inputLayer({ inputShape: [vocabSize] }))
model.add(tf.layers.dense({ units: 32, activation: 'relu' }))
model.add(tf.layers.dropout({ rate: 0.5 }))
model.add(tf.layers.dense({ units: 16, activation: 'relu' }))
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }))
model.compile({
  optimizer: tf.train.adam(0.001),
  loss: 'binaryCrossentropy',
  metrics: ['accuracy'],
})
model.summary()

// 训练
console.log('开始训练...')
await model.fit(xs, ys, {
  epochs: 8,
  batchSize: 16,
  shuffle: true,
  callbacks: {
    onEpochEnd: (epoch, logs) => {
      console.log(
        `第 ${epoch + 1} 轮: loss = ${logs.loss.toFixed(4)}, acc = ${logs.acc.toFixed(4)}`,
      )
    },
  },
})

console.log('训练完成！')

// 保存模型圈子和字表
await model.save('file://./model')
const vocabExport = {
  charToIndex: Array.from(charMap.entries()),
  vocabSize,
  UNK_INDEX,
}
fs.writeFileSync('./model/vocab.json', JSON.stringify(vocabExport, null, 2))
