Link deploy vercel: [https://web-e-commerce-client.vercel.app](https://web-e-commerce-client.vercel.app)
Dưới đây là file `README.md` hướng dẫn cài đặt và triển khai dự án MERN Stack với client dùng React + TypeScript + Vite và server dùng Node.js, Express:

```markdown
# MERN Stack Project

## Table of Contents
1. [Giới thiệu](#giới-thiệu)
2. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
3. [Cài đặt](#cài-đặt)
   - [Client](#client)
   - [Server](#server)
4. [Chạy dự án](#chạy-dự-án)
5. [Cấu trúc dự án](#cấu-trúc-dự-án)
6. [Triển khai](#triển-khai)
7. [Môi trường](#môi-trường)

## Giới thiệu

Đây là dự án MERN Stack sử dụng:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Yêu cầu hệ thống

- **Node.js**: >= 14.x
- **npm**: >= 6.x
- **MongoDB**: Cài đặt và chạy trên hệ thống (hoặc sử dụng MongoDB Atlas)
```
## Cài đặt

### Client

1. Di chuyển vào thư mục client:

   ```bash
   cd client
   ```

2. Cài đặt các dependencies:

   ```bash
   npm install
   ```

### Server

1. Di chuyển vào thư mục server:

   ```bash
   cd server
   ```

2. Cài đặt các dependencies:

   ```bash
   npm install
   ```

## Chạy dự án

### Client

1. Chạy client bằng Vite:

   ```bash
   npm run dev
   ```

   Ứng dụng sẽ được chạy tại [http://localhost:5173](http://localhost:5173).

### Server

1. Chạy server bằng Node.js và Express:

   ```bash
   npm start
   ```

   Server sẽ chạy tại [http://localhost:5000](http://localhost:5000).

### Cơ sở dữ liệu

Hãy đảm bảo rằng bạn đã cài đặt và chạy MongoDB. Mặc định server sẽ kết nối với MongoDB qua `mongodb://localhost:27017`.

## Cấu trúc dự án

```
.
├── client/                   # Frontend
│   ├── src/                  # Mã nguồn React + TypeScript
│   └── ...
├── server/                   # Backend
│   ├── src/                  # Mã nguồn Node.js + Express
│   └── ...
└── README.md                 # Hướng dẫn
```


