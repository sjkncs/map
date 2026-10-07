// 英文统一转小写
function normalizeChar(char) {
  return char >= 'A' && char <= 'Z' ? char.toLowerCase() : char
}

// 建立字表，丢弃最低频的 discardCount 个字符（模拟生僻字）
export default function buildCharVocabulary(texts, discardCount = 10) {
  // 统计字频
  const freqMap = new Map()
  texts.forEach((text) => {
    const chars = text.split('')
    chars.forEach((char) => {
      if (char.trim() !== '') {
        const c = normalizeChar(char)
        freqMap.set(c, (freqMap.get(c) || 0) + 1)
      }
    })
  })

  // 按频率升序排序，丢弃最低频的 discardCount 个
  const sorted = Array.from(freqMap.entries()).sort((a, b) => a[1] - b[1])
  const discarded = new Set(sorted.slice(0, discardCount).map((e) => e[0]))
  const kept = sorted.slice(discardCount).map((e) => e[0])

  console.log(`丢弃了 ${discardCount} 个最低频字符: [${Array.from(discarded).join(' ')}]`)

  // 建立字符到索引的映射
  const charMap = new Map()
  kept.forEach((char, index) => {
    charMap.set(char, index)
  })

  // 最后一位是 UNK（未知字符）
  const UNK_INDEX = kept.length

  return { charMap, vocabSize: kept.length + 1, UNK_INDEX }
}
