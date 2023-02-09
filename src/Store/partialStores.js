import * as routesStore from './routesStore'
import { threeStore } from './threeStore'
import { animationStore } from './animationStore'
const partialStores = { threeStore, ...routesStore, animationStore }

export default partialStores
