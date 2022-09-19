import { SchemaPropertyComponentWithProps } from '../utilities'
import { SchemaPropertyService } from './SchemaPropertyService'
import { JsonInput } from '@/components'
import { SchemaValue } from '@/types/schemas'
import { parseUnknownJson, stringifyUnknownJson } from '@/utilities/json'

export class SchemaPropertyAny extends SchemaPropertyService {
  protected get default(): unknown {
    if (this.componentIs(JsonInput)) {
      return ''
    }

    return null
  }

  protected get component(): SchemaPropertyComponentWithProps {
    // if either of these exist let the AnyOf and AllOf components take over
    if (this.has('anyOf') || this.has('allOf')) {
      return null
    }

    return this.withProps(JsonInput)
  }

  protected request(value: SchemaValue): unknown {
    return parseUnknownJson(value)
  }

  protected response(value: SchemaValue): unknown {
    return stringifyUnknownJson(value)
  }

}