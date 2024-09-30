
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

## Giới thiệu

Đây là dự án MERN Stack sử dụng:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Yêu cầu hệ thống

- **Node.js**: >= 14.x
- **npm**: >= 6.x
- **MongoDB**: Cài đặt và chạy trên hệ thống (hoặc sử dụng MongoDB Atlas)

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

Mặc định server sẽ kết nối với MongoDB qua `mongodb://localhost:27017`.

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



