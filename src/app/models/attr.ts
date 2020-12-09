import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { Course } from './course';

@JsonApiModelConfig({
    type: 'attrs'
})
export class Attr extends JsonApiModel {

    @Attribute()
    attr: string;

    @Attribute()
    desc: string;

    @HasMany()
    courses: Course[];

}
