import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { Course } from './course';

@JsonApiModelConfig({
    type: 'instructors'
})
export class Instructor extends JsonApiModel {

    @Attribute()
    name: string;

    @Attribute()
    unid: string;

    @HasMany()
    courses: Course[];

}
