export type BasicItem = {
  id: string
  name: string
  shortAddress: string
  location: string
  icon: string
}

export type DetailItem = BasicItem & {
  type: 'detail'
  keytag: string
  photos: { url: string }[]
  tel: string
  website: string
  address: string
}
