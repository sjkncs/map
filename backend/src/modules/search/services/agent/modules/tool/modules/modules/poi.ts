export const findPois = (messages: any[], ids: string[]) => {
  const set = new Set(ids)
  const map = new Map()
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (!message.tool_call_name) continue
    if (message.tool_call_name === 'global_search' || message.tool_call_name === 'around_search') {
      const targetPois = (JSON.parse(message.content) as any[]).filter((poi) => set.has(poi.id))
      targetPois.forEach((poi) => {
        if (!map.has(poi.id)) {
          map.set(poi.id, poi)
        }
      })
    } else if (message.tool_call_name === 'detail_search') {
      const detailPoi = JSON.parse(message.content ?? '')
      if (set.has(detailPoi.id) && !map.has(detailPoi.id)) {
        map.set(detailPoi.id, detailPoi)
      }
    }
    if (map.size === set.size) break
  }
  return ids.map((id) => map.get(id)).filter((poi) => Boolean(poi))
}
