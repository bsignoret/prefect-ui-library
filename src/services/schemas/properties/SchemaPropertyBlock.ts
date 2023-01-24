import BlockDocumentInput from '@/components/BlockDocumentInput.vue'
import { BlockDocumentReferenceValue, BlockDocumentValue, isBlockDocumentValue } from '@/models/api/BlockDocumentCreateRequest'
import { SchemaPropertyService } from '@/services/schemas/properties/SchemaPropertyService'
import { SchemaPropertyComponentWithProps } from '@/services/schemas/utilities'
import { SchemaValue } from '@/types/schemas'

export class SchemaPropertyBlock extends SchemaPropertyService {

  protected readonly default: BlockDocumentValue = {
    blockTypeSlug: this.property.blockTypeSlug!,
    blockDocumentId: null,
  }

  protected override get component(): SchemaPropertyComponentWithProps {
    return this.withProps(BlockDocumentInput, {
      blockTypeSlug: this.property.blockTypeSlug!,
    })
  }

  protected request(value: SchemaValue): unknown {
    if (!isBlockDocumentValue(value)) {
      return value
    }

    const request: BlockDocumentReferenceValue = {
      $ref: {
        'block_document_id': value.blockDocumentId!,
      },
    }

    return request
  }

  protected response(value: SchemaValue): unknown {
    if (isBlockDocumentValue(value)) {
      return value
    }

    this.invalid()
  }

}