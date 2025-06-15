import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class ticketValidationPipe implements PipeTransform{
    constructor (private prisma : PrismaService) {}
    async transform(value: any, metadata: ArgumentMetadata) {
        const {showtime_id, ticket} = value.tickets;
        // Kiểm tra lịch chiếu phim có tồn tại không
        const showTime = await this.prisma.showTimes.findUnique({
        where: {
            id: showtime_id, 
            is_deleted: false,
            date_release: {
            lte: new Date()
            } 
        }
        })
         if (!showTime) throw new NotFoundException('Lịch chiếu phim không tồn tại')
        // Kiểm tra dữ liệu ticket truyền vào có phải array không và có bị trùng ghế không
        if (!Array.isArray(ticket) || ticket.length === 0) throw new BadRequestException('Danh sách ghế (ticket) không được để trống');
        const seatIdsRequest = ticket.map( t => t.seat_id);
        const uniqueSeat = new Set(seatIdsRequest);
        if(seatIdsRequest.length !== uniqueSeat.size) throw new BadRequestException('Không được đặt ghế trùng nhau');
    
       // Kiểm tra định danh vé có phù hợp không và giá vé có khớp với giá showtime không
        for (const i of ticket) {
            if (!i.seat_id || typeof i.seat_id !== 'number' || i.seat_id <=0) throw new BadRequestException('SeatId không hợp lệ');
            if (!i.price || typeof i.price !== 'number' || i.price !== showTime.price) throw new BadRequestException('giá vé không hợp lệ');
            
        }
        // Kiểm tra ghế xem có phù hợp không
        const seat = await this.prisma.seats.findMany({
        where: {
            id: {in : seatIdsRequest},
            theater_id: showTime.theater_id
        }
        })
        if (!seat) throw new NotFoundException('Không tìm thấy ghế phù hợp')
        // Kiểm tra ghế đã được đặt chưa
        const isSeatTaken = await this.prisma.bookings.findMany({
            where: {
                showtime_id, 
                seat_id: {
                in: seatIdsRequest
            }},
            include: {
                ShowTimes: true
            }
        })
        const alreadyBooked = isSeatTaken.map( i => i.seat_id );
        if(alreadyBooked.length > 0) {
            throw new BadRequestException(`Các ghế đã được đặt: ${[... new Set(alreadyBooked)].join(',')}`)}     
    return value;
    }
    

}