import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany } from 'angular2-jsonapi';
import { Course } from './course';

@JsonApiModelConfig({
    type: 'when_where'
})
export class WhenWhere extends JsonApiModel {

    @Attribute()
    day: string;

    @Attribute()
    tim: string;

    @Attribute()
    loc: string;

    @Attribute()
    tba: string;

    @HasMany()
    courses: Course[];

}
