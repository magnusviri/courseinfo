import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { Attr } from './attr';
import { Instructor } from './instructor';

@JsonApiModelConfig({
    type: 'courses'
})
export class Course extends JsonApiModel {

    @Attribute()
    cat: number;

    @Attribute()
    sec: number;

    @Attribute()
    com: string;

    @Attribute()
    sub: string;

    @Attribute()
    num: number;

    @Attribute()
    nam: string;

    @Attribute()
    enr: number;

    @Attribute()
    des: string;

    @Attribute()
    cap: number;

    @Attribute()
    typ: string;

    @Attribute()
    uni: string;

    @Attribute()
    yea: number;

    @Attribute()
    sem: number;

    @Attribute()
    fee: string;

    @Attribute()
    rek: string;

    @Attribute()
    syl: string;

    @HasMany()
    attrs: Attr[];

    @HasMany()
    instructors: Instructor[];

}
