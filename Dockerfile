
FROM node:18-alpine

# chỉ định tư mục làm việc
WORKDIR /app/sever

# copy file package.json ở local vào image
COPY package*.json ./

# chạy câu lệnh npm để tải các package lên image
RUN npm install

# copy cacsi file khác khoài node_module ở local vào image
COPY . .

# chạy lệnh build app để tạo ra thư mục dist
RUN npm run start

#export port 3000
EXPOSE 3000

CMD ["npm", "start"]