import * as routesStore from './routesStore'
import { threeStore } from './threeStore'
const partialStores = { threeStore, ...routesStore }

export default partialStores
