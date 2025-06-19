import { Exclude, Expose } from "class-transformer";
export class userResponseDto {
    constructor(partial: Partial<userResponseDto>) {
        Object.assign(this, partial)
    }
    @Expose()
    account: number;

    @Expose()
    email: string;

    @Expose()
    phone: string;

    @Expose()
    fullname: string;

    @Expose()
    type_user: string;

    @Exclude()
    PASSWORD: string;

    @Exclude()
    create_at: Date;

    @Exclude()
    updated_at: Date;

    @Exclude()
    is_deleted: boolean;
}

