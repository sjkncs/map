import modalStore from '@/stores/modal'
import userStore from '@/stores/user'

type CustomPoiField = 'alias' | 'description'

export const editCustomPoi = async (config: {
  id: string
  name: string
  location: string
  field: CustomPoiField
}) => {
  const { id, name, location, field } = config
  const label = field === 'alias' ? '别名' : '描述'
  const newValue = await modalStore.prompt({
    title: `编辑${label}`,
    defaultValue:
      field === 'alias'
        ? userStore.customPoi.aliasOf(id, name)
        : userStore.customPoi.values[id]?.description,
  })
  if (newValue === null) return
  const newCustomPoiValue = {
    ...userStore.customPoi.values[id],
    name,
    location,
  }
  newCustomPoiValue[field] = newValue
  if (newCustomPoiValue.alias || newCustomPoiValue.description) {
    await userStore.customPoi.set(id, newCustomPoiValue)
  } else if (userStore.customPoi.values[id]) {
    await userStore.customPoi.remove(id)
  }
}
