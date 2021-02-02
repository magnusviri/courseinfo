import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany } from 'angular2-jsonapi';
import { Course } from './course';

@JsonApiModelConfig({
    type: 'specials'
})
export class Special extends JsonApiModel {

    @Attribute()
    spe: string;

    @HasMany()
    courses: Course[];

}
