import { Exclude, Expose } from "class-transformer";
export class Movie_Response_Dto {
    constructor(partial: Partial<Movie_Response_Dto>) {
        Object.assign(this, partial)
    }
    @Expose()
    movie_name: string;

    @Expose()
    discription: string;

    @Expose()
    premiere_date: Date;

    @Expose()
    image: string;

    @Expose()
    trailer: string;

    @Exclude()
    create_at: Date;

    @Exclude()
    updated_at: Date;

    @Exclude()
    is_deleted: boolean;
}

