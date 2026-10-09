Trần Nam Hải | MSSV: 23710651 | https://github.com/haimami/23710651_TH2.git | Stamp: #101883 | Số cuối: 1 | VARIANT: watermarkAtTop=false, authField='phone', tabOrder='shopFirst', hapticOnAdd='selection', shipFormula='B', detailPresentation='card'

# KTXGo - Đề Kiểm Tra Thực Hành 2 (Mobile Programming - IUH)

## 1. Thông Tin Sinh Viên & Biến Thể
- **Họ và tên**: Trần Nam Hải (TRAN NAM HAI)
- **MSSV**: 23710651
- **Số cuối MSSV**: 1
- **STUDENT_SEED**: 651
- **examStamp**: 101883 (TH2 · 23710651 · TRAN NAM HAI · #101883)
- **Hàng biến thể (Row 1)**:
  - `watermarkAtTop`: `false` (Watermark hiển thị ở dưới màn hình)
  - `authField`: `'phone'` (Ô đăng nhập nhập số điện thoại)
  - `tabOrder`: `'shopFirst'` (Thứ tự Tab: Cửa hàng → Giỏ → Tôi)
  - `hapticOnAdd`: `'selection'` (Phản hồi rung nhẹ khi bấm thêm giỏ)
  - `shipFormula`: `'B'` (`BASE_SHIP_FEE + Math.round(km * 1500) + 2000`)
  - `detailPresentation`: `'card'` (Hiển thị trang chi tiết theo dạng card navigation)
  - `ROOM_LABEL`: `P.351`
  - `DEBOUNCE_MS`: `400ms`
  - `STALE_TIME_MS`: `21000ms`
  - `PRICE_MULTIPLIER`: `20500`
  - `BASE_SHIP_FEE`: `9000 đ`

## 2. Cấu Trúc Thư Mục Chuẩn (Đúng 100% Theo Đề)
```text
KTXGo_23710651/
├── README.md
├── App.tsx
├── package.json
├── babel.config.js
├── tsconfig.json
└── src/
    ├── constants/student.ts
    ├── constants/theme.ts
    ├── hooks/useDebouncedValue.ts
    ├── hooks/useCampusLocation.ts
    ├── services/apiClient.ts
    ├── services/productApi.ts
    ├── stores/authStore.ts
    ├── stores/cartStore.ts
    ├── navigation/RootNavigator.tsx
    ├── navigation/AuthStack.tsx
    ├── navigation/MainTabs.tsx
    ├── navigation/ShopStack.tsx
    ├── components/ProductCard.tsx
    ├── components/Watermark.tsx
    └── screens/
        ├── LoginScreen.tsx
        ├── HomeScreen.tsx
        ├── DetailScreen.tsx
        ├── CartScreen.tsx
        └── MeScreen.tsx
```

## 3. Nội Dung Thực Hiện Đầy Đủ 3 Câu Hỏi

### Câu 1: Navigation + Định Danh (3 điểm)
- Đầy đủ kiến trúc React Navigation V7: `RootNavigator` chuyển đổi giữa `AuthStack` (Login) và `MainTabs` dựa trên auth token từ Zustand.
- Token giả lập: `ktxgo-23710651-101883`.
- Ô Login nhận SĐT (`authField: 'phone'`).
- Màn hình trong Tab Cửa hàng: `ShopStack` chứa `Home` và `Detail` (presentation: `card`).
- Thứ tự Tab: `Cửa hàng` → `Giỏ` → `Tôi` (`tabOrder: 'shopFirst'`).
- Badge giỏ hàng: `tabBarBadge = totalQuantity` từ `cartStore` (tự ẩn khi giỏ có 0 món).
- Dòng watermark định danh: `TH2 · 23710651 · TRAN NAM HAI · #101883` xuất hiện ở dưới mọi màn hình.

### Câu 2: FlashList + React Query (3 điểm)
- Hiển thị danh sách món ăn bằng `@shopify/flash-list` với `numColumns={2}`, `estimatedItemSize={200}`, `keyExtractor={(item) => \`${STUDENT.mssv}-${item.id}\`}`.
- Thành phần `ProductCard` tách file độc lập, flexbox cân đối 2 cột.
- Ô tìm kiếm debounce `400ms` với hook `useDebouncedValue`. Không bọc FlashList trong ScrollView dọc.
- `apiClient`: Axios instance có interceptor tự động gắn header `X-Student-Id: 23710651`.
- `useQuery` quản lý đầy đủ 3 trạng thái mạng:
  1. `isLoading`: Vòng quay ActivityIndicator + "Đang tải món...".
  2. `isError`: Hiển thị MSSV `23710651` + nút "Thử lại" (refetch).
  3. `data`: Danh sách lưới 2 cột. Kéo xuống để refresh (Pull-to-refresh) kích hoạt refetch.
- Bấm vào thẻ sản phẩm chuyển sang `Detail` đúng `id`.

### Câu 3: Zustand + Location / Haptic (4 điểm)
- `cartStore` (Zustand):
  - Đầy đủ các action: `addItem`, `removeItem`, `changeQty`, `clearCart`.
  - Getters: `totalQuantity()`, `totalAmount()`.
  - Persist với AsyncStorage, key định danh: `ktxgo-cart-23710651` (dữ liệu giỏ hàng được giữ nguyên sau khi reload app).
- Rung Haptic:
  - Khi bấm `+` tại màn Home hoặc nút "Thêm vào giỏ · Haptic" tại Detail đều kích hoạt rung phản hồi `selection` (15ms).
  - Nút thêm giỏ tại màn Detail kích hoạt `Alert` có kèm thông tin MSSV `23710651`.
- Màn `CartScreen`: Cho phép tăng/giảm số lượng, xoá món, hiện thông tin phòng `P.351`, phí ship công thức B, và tổng thanh toán.
- `useCampusLocation`:
  - Quản lý đầy đủ 3 nhánh quyền: `granted`, `denied`, `blocked`.
  - Khi quyền bị chặn (`blocked` / NEVER_ASK_AGAIN), cung cấp nút mở Cài đặt thiết bị qua `Linking.openSettings()`.
  - Tính khoảng cách Haversine từ toạ độ hiện tại tới cổng KTX.
  - Tính phí ship theo công thức B: `9000 + Math.round(km * 1500) + 2000`. Phí ship tại tab Tôi được tự động phản ánh sang giỏ hàng (Cart).
  - Nút "Đăng xuất" tại tab Tôi xoá token và chuyển về `LoginScreen`.
