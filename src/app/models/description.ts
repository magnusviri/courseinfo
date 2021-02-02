import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany } from 'angular2-jsonapi';
import { Course } from './course';

@JsonApiModelConfig({
    type: 'descriptions'
})
export class Description extends JsonApiModel {

    @Attribute()
    des: string;

    @HasMany()
    courses: Course[];

}
