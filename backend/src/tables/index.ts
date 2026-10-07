import CustomPoi, { name as customPoiName } from './modules/CustomPoi.js'
import Description, { name as descriptionName } from './modules/Description.js'
import Love, { name as loveName } from './modules/Love.js'
import Message, { name as messageName } from './modules/Message.js'
import RecentSearch, { name as recentSearchName } from './modules/RecentSearch.js'
import Session, { name as sessionName } from './modules/Session.js'
import Tag, { name as tagName } from './modules/Tag.js'
import User, { name as userName } from './modules/User.js'

const tables = {
  [userName]: User,
  [loveName]: Love,
  [recentSearchName]: RecentSearch,
  [customPoiName]: CustomPoi,
  [descriptionName]: Description,
  [sessionName]: Session,
  [messageName]: Message,
  [tagName]: Tag,
}

export default tables

export { CustomPoi, Description, Love, Message, RecentSearch, Session, Tag, User }
