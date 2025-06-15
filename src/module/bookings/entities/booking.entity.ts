export class TicketEntity {
    seat_id: number
    price: number | null
    start_time: Date | null
    movie: string
    theater: string
    theater_complex: string | null
    theater_system: string | null
} 

export class BookingResponseEntity {
    constructor(
        tickets: TicketEntity[]
    ) {
        this.message = 'Đặt vé thành công'
        this.total = tickets.length
        this.tickets = tickets
    }
    message: string
    total: number
    showtime_id: number
    tickets: TicketEntity[]
}
