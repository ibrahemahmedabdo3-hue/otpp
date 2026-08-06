import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateMicroSiteDto } from './create-microsite.dto';

// subdomain is intentionally not editable after creation to avoid dangling
// DNS/Nginx routing pointing at a renamed record; delete and recreate instead.
export class UpdateMicroSiteDto extends PartialType(
  OmitType(CreateMicroSiteDto, ['subdomain'] as const),
) {}
