interface OrderData {
  tracking_no: number;
  name: string;
  quantity: number;
  status: number;
  totalAmount: number;
  email: string;
  orderTime: string;
  category: string;
}

function createData(
  tracking_no: number,
  name: string,
  quantity: number,
  status: number,
  totalAmount: number,
  email: string,
  orderTime: string,
  category: string
): OrderData {
  return {
    tracking_no,
    name,
    quantity,
    status,
    totalAmount,
    email,
    orderTime,
    category,
  };
}
export const rows: OrderData[] = [
  createData(
    84564564,
    "Yonex Astrox 99 Pro",
    10,
    0,
    250,
    "user1@example.com",
    "2023-10-01 10:00",
    "racket"
  ),
  createData(
    98764564,
    "Yonex Power Cushion 65 Z2",
    20,
    1,
    120,
    "user2@example.com",
    "2023-10-02 11:00",
    "shoes"
  ),
  createData(
    98756325,
    "Yonex Aerus Z",
    15,
    2,
    150,
    "user3@example.com",
    "2023-10-03 12:00",
    "shoes"
  ),
  createData(
    98652366,
    "Yonex Nanoflare 800",
    8,
    3,
    200,
    "user4@example.com",
    "2023-10-04 13:00",
    "racket"
  ),
  createData(
    13286564,
    "Yonex SHB 65R2",
    25,
    0,
    100,
    "user5@example.com",
    "2023-10-05 14:00",
    "shoes"
  ),
  createData(
    86739658,
    "Yonex Voltric Z Force II",
    5,
    1,
    220,
    "user6@example.com",
    "2023-10-06 15:00",
    "racket"
  ),
  createData(
    13256498,
    "Yonex BG 80 Power",
    50,
    2,
    15,
    "user7@example.com",
    "2023-10-07 16:00",
    "accessory"
  ),
  createData(
    98753263,
    "Yonex SHB 03Z",
    30,
    3,
    130,
    "user8@example.com",
    "2023-10-08 17:00",
    "shoes"
  ),
  createData(
    98753275,
    "Yonex Duora 10",
    12,
    0,
    180,
    "user9@example.com",
    "2023-10-09 18:00",
    "racket"
  ),
  createData(
    98753291,
    "Yonex SHB 65X",
    20,
    1,
    110,
    "user10@example.com",
    "2023-10-10 19:00",
    "shoes"
  ),
  createData(
    84564564,
    "Yonex Astrox 99 Pro",
    10,
    0,
    250,
    "user1@example.com",
    "2023-10-01 10:00",
    "racket"
  ),
  createData(
    98764564,
    "Yonex Power Cushion 65 Z2",
    20,
    1,
    120,
    "user2@example.com",
    "2023-10-02 11:00",
    "shoes"
  ),
  createData(
    98756325,
    "Yonex Aerus Z",
    15,
    2,
    150,
    "user3@example.com",
    "2023-10-03 12:00",
    "shoes"
  ),
  createData(
    98652366,
    "Yonex Nanoflare 800",
    8,
    3,
    200,
    "user4@example.com",
    "2023-10-04 13:00",
    "racket"
  ),
  createData(
    13286564,
    "Yonex SHB 65R2",
    25,
    0,
    100,
    "user5@example.com",
    "2023-10-05 14:00",
    "shoes"
  ),
  createData(
    86739658,
    "Yonex Voltric Z Force II",
    5,
    1,
    220,
    "user6@example.com",
    "2023-10-06 15:00",
    "racket"
  ),
  createData(
    13256498,
    "Yonex BG 80 Power",
    50,
    2,
    15,
    "user7@example.com",
    "2023-10-07 16:00",
    "accessory"
  ),
  createData(
    98753263,
    "Yonex SHB 03Z",
    30,
    3,
    130,
    "user8@example.com",
    "2023-10-08 17:00",
    "shoes"
  ),
  createData(
    98753275,
    "Yonex Duora 10",
    12,
    0,
    180,
    "user9@example.com",
    "2023-10-09 18:00",
    "racket"
  ),
  createData(
    98753291,
    "Yonex SHB 65X",
    20,
    1,
    110,
    "user10@example.com",
    "2023-10-10 19:00",
    "shoes"
  ),
  createData(
    84564564,
    "Yonex Astrox 99 Pro",
    10,
    0,
    250,
    "user1@example.com",
    "2023-10-01 10:00",
    "racket"
  ),
  createData(
    98764564,
    "Yonex Power Cushion 65 Z2",
    20,
    1,
    120,
    "user2@example.com",
    "2023-10-02 11:00",
    "shoes"
  ),
  createData(
    98756325,
    "Yonex Aerus Z",
    15,
    2,
    150,
    "user3@example.com",
    "2023-10-03 12:00",
    "shoes"
  ),
  createData(
    98652366,
    "Yonex Nanoflare 800",
    8,
    3,
    200,
    "user4@example.com",
    "2023-10-04 13:00",
    "racket"
  ),
  createData(
    13286564,
    "Yonex SHB 65R2",
    25,
    0,
    100,
    "user5@example.com",
    "2023-10-05 14:00",
    "shoes"
  ),
  createData(
    86739658,
    "Yonex Voltric Z Force II",
    5,
    1,
    220,
    "user6@example.com",
    "2023-10-06 15:00",
    "racket"
  ),
  createData(
    13256498,
    "Yonex BG 80 Power",
    50,
    2,
    15,
    "user7@example.com",
    "2023-10-07 16:00",
    "accessory"
  ),
  createData(
    98753263,
    "Yonex SHB 03Z",
    30,
    3,
    130,
    "user8@example.com",
    "2023-10-08 17:00",
    "shoes"
  ),
  createData(
    98753275,
    "Yonex Duora 10",
    12,
    0,
    180,
    "user9@example.com",
    "2023-10-09 18:00",
    "racket"
  ),
  createData(
    98753291,
    "Yonex SHB 65X",
    20,
    1,
    110,
    "user10@example.com",
    "2023-10-10 19:00",
    "shoes"
  ),
  createData(
    84564564,
    "Yonex Astrox 99 Pro",
    10,
    0,
    250,
    "user1@example.com",
    "2023-10-01 10:00",
    "racket"
  ),
  createData(
    98764564,
    "Yonex Power Cushion 65 Z2",
    20,
    1,
    120,
    "user2@example.com",
    "2023-10-02 11:00",
    "shoes"
  ),
  createData(
    98756325,
    "Yonex Aerus Z",
    15,
    2,
    150,
    "user3@example.com",
    "2023-10-03 12:00",
    "shoes"
  ),
  createData(
    98652366,
    "Yonex Nanoflare 800",
    8,
    3,
    200,
    "user4@example.com",
    "2023-10-04 13:00",
    "racket"
  ),
  createData(
    13286564,
    "Yonex SHB 65R2",
    25,
    0,
    100,
    "user5@example.com",
    "2023-10-05 14:00",
    "shoes"
  ),
  createData(
    86739658,
    "Yonex Voltric Z Force II",
    5,
    1,
    220,
    "user6@example.com",
    "2023-10-06 15:00",
    "racket"
  ),
  createData(
    13256498,
    "Yonex BG 80 Power",
    50,
    2,
    15,
    "user7@example.com",
    "2023-10-07 16:00",
    "accessory"
  ),
  createData(
    98753263,
    "Yonex SHB 03Z",
    30,
    3,
    130,
    "user8@example.com",
    "2023-10-08 17:00",
    "shoes"
  ),
  createData(
    98753275,
    "Yonex Duora 10",
    12,
    0,
    180,
    "user9@example.com",
    "2023-10-09 18:00",
    "racket"
  ),
  createData(
    98753291,
    "Yonex SHB 65X",
    20,
    1,
    110,
    "user10@example.com",
    "2023-10-10 19:00",
    "shoes"
  ),
  createData(
    84564564,
    "Yonex Astrox 99 Pro",
    10,
    0,
    250,
    "user1@example.com",
    "2023-10-01 10:00",
    "racket"
  ),
  createData(
    98764564,
    "Yonex Power Cushion 65 Z2",
    20,
    1,
    120,
    "user2@example.com",
    "2023-10-02 11:00",
    "shoes"
  ),
  createData(
    98756325,
    "Yonex Aerus Z",
    15,
    2,
    150,
    "user3@example.com",
    "2023-10-03 12:00",
    "shoes"
  ),
  createData(
    98652366,
    "Yonex Nanoflare 800",
    8,
    3,
    200,
    "user4@example.com",
    "2023-10-04 13:00",
    "racket"
  ),
  createData(
    13286564,
    "Yonex SHB 65R2",
    25,
    0,
    100,
    "user5@example.com",
    "2023-10-05 14:00",
    "shoes"
  ),
  createData(
    86739658,
    "Yonex Voltric Z Force II",
    5,
    1,
    220,
    "user6@example.com",
    "2023-10-06 15:00",
    "racket"
  ),
  createData(
    13256498,
    "Yonex BG 80 Power",
    50,
    2,
    15,
    "user7@example.com",
    "2023-10-07 16:00",
    "accessory"
  ),
  createData(
    98753263,
    "Yonex SHB 03Z",
    30,
    3,
    130,
    "user8@example.com",
    "2023-10-08 17:00",
    "shoes"
  ),
  createData(
    98753275,
    "Yonex Duora 10",
    12,
    0,
    180,
    "user9@example.com",
    "2023-10-09 18:00",
    "racket"
  ),
  createData(
    98753291,
    "Yonex SHB 65X",
    20,
    1,
    110,
    "user10@example.com",
    "2023-10-10 19:00",
    "shoes"
  ),
  createData(
    84564564,
    "Yonex Astrox 99 Pro",
    10,
    0,
    250,
    "user1@example.com",
    "2023-10-01 10:00",
    "racket"
  ),
  createData(
    98764564,
    "Yonex Power Cushion 65 Z2",
    20,
    1,
    120,
    "user2@example.com",
    "2023-10-02 11:00",
    "shoes"
  ),
  createData(
    98756325,
    "Yonex Aerus Z",
    15,
    2,
    150,
    "user3@example.com",
    "2023-10-03 12:00",
    "shoes"
  ),
  createData(
    98652366,
    "Yonex Nanoflare 800",
    8,
    3,
    200,
    "user4@example.com",
    "2023-10-04 13:00",
    "racket"
  ),
  createData(
    13286564,
    "Yonex SHB 65R2",
    25,
    0,
    100,
    "user5@example.com",
    "2023-10-05 14:00",
    "shoes"
  ),
  createData(
    86739658,
    "Yonex Voltric Z Force II",
    5,
    1,
    220,
    "user6@example.com",
    "2023-10-06 15:00",
    "racket"
  ),
  createData(
    13256498,
    "Yonex BG 80 Power",
    50,
    2,
    15,
    "user7@example.com",
    "2023-10-07 16:00",
    "accessory"
  ),
  createData(
    98753263,
    "Yonex SHB 03Z",
    30,
    3,
    130,
    "user8@example.com",
    "2023-10-08 17:00",
    "shoes"
  ),
  createData(
    98753275,
    "Yonex Duora 10",
    12,
    0,
    180,
    "user9@example.com",
    "2023-10-09 18:00",
    "racket"
  ),
  createData(
    98753291,
    "Yonex SHB 65X",
    20,
    1,
    110,
    "user10@example.com",
    "2023-10-10 19:00",
    "shoes"
  ),
];
