import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany } from 'angular2-jsonapi';
import { Course } from './course';

@JsonApiModelConfig({
    type: 'meets_with'
})
export class MeetsWith extends JsonApiModel {

    @Attribute()
    cat: string;

    @Attribute()
    num: number;

    @Attribute()
    sec: string;

    @Attribute()
    tba: string;

    @HasMany()
    courses: Course[];

}
