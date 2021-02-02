import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { Attr } from './attr';
import { Description } from './description';
import { Instructor } from './instructor';
import { MeetsWith } from './meets_with';
import { Special } from './special';
import { WhenWhere } from './when_where';

@JsonApiModelConfig({
    type: 'courses'
})
export class Course extends JsonApiModel {

    @Attribute()
    cap: number;

    @Attribute()
    cat: number;

    @Attribute()
    com: string;

    @Attribute()
    enr: number;

    @Attribute()
    fee: string;

    @Attribute()
    nam: string;

    @Attribute()
    num: number;

    @Attribute()
    rek: string;

    @Attribute()
    req: string;

    @Attribute()
    sea: string;

    @Attribute()
    sec: number;

    @Attribute()
    sem: number;

    @Attribute()
    sub: string;

    @Attribute()
    syl: string;

    @Attribute()
    typ: string;

    @Attribute()
    uni: string;

    @Attribute()
    wai: string;

    @Attribute()
    yea: number;

    @HasMany()
    attrs: Attr[];

    @BelongsTo()
    description: Description[];

    @HasMany()
    instructors: Instructor[];

    @HasMany()
    meets_with: MeetsWith[];

    @BelongsTo()
    special: Special[];

    @HasMany()
    when_where: WhenWhere[];

}
