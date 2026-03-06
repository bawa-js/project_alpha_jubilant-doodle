import { type SchemaTypeDefinition } from 'sanity'

import { categoryType } from './category_type'
import { customerType } from './customer_type'
import { productType } from './product_type'
import { orderType } from './order_type'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, customerType, productType, orderType],
}
