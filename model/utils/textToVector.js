export default function textToVector(text, charMap, vocabSize, UNK_INDEX) {
  const vector = new Array(vocabSize).fill(0)
  // 英文统一转小写，与词表构建逻辑一致
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
