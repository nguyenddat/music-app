# Hướng dẫn chạy dự án App Âm nhạc (Music App)

Tài liệu này hướng dẫn cách thiết lập và chạy ứng dụng trên môi trường Android sử dụng Expo và Native builds.

## 1. Yêu cầu môi trường (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

*   **Node.js** (Phiên bản LTS được khuyến nghị)
*   **npm** (Đi kèm với Node.js)
*   **Java Development Kit (JDK)**: Phiên bản 17 (được khuyến nghị cho React Native/Expo hiện tại).
*   **Android Studio & Android SDK**:
    *   Cài đặt Android SDK Platform-Tools.
    *   Thiết lập biến môi trường `ANDROID_HOME`.
    *   Một thiết bị giả lập Android (Emulator) hoặc thiết bị thật đã bật USB Debugging.

## 2. Cài đặt thư viện (Install Dependencies)

Mở terminal tại thư mục gốc của dự án và chạy lệnh:

```bash
npm install
```

## 3. Chạy ứng dụng trên Android

Quá trình chạy ứng dụng bao gồm 2 bước chính: Prebuild (tạo thư mục native `android`) và Run (biên dịch và cài đặt app).

### Bước 1: Prebuild

Lệnh này sẽ tạo ra thư mục `android` dựa trên cấu hình trong `app.json` và cài đặt các native modules cần thiết.

```bash
npx expo prebuild
```

*Lưu ý: Nếu bạn được hỏi về "package name", hãy nhập tên gói mong muốn (ví dụ: `com.nguyenddat.musicapp`) hoặc nhấn Enter để dùng mặc định.*

### Bước 2: Chạy ứng dụng

Sau khi prebuild thành công, hãy chạy lệnh sau để biên dịch và cài đặt ứng dụng lên máy ảo hoặc thiết bị thật:

```bash
npm run android
```

Hoặc lệnh trực tiếp từ Expo:

```bash
npx expo run:android
```

## 4. Các lệnh thường dùng khác

*   **Khởi động Metro Bundler (không build lại native):**
    ```bash
    npx expo start
    ```
    *Dùng khi bạn chỉ sửa code JS/Resource mà không thay đổi cấu hình native.*

*   **Xóa thư mục native cũ để prebuild lại (nếu gặp lỗi):**
    Xóa thư mục `android` và `ios` (nếu có), sau đó chạy lại `npx expo prebuild`.

## 5. Xử lý lỗi thường gặp

*   **Lỗi SDK location not found**: Kiểm tra lại biến môi trường `ANDROID_HOME` hoặc tạo file `local.properties` trong thư mục `android` với nội dung `sdk.dir=ĐƯỜNG_DẪN_TỚI_ANDROID_SDK_CỦA_BẠN`.
*   **Lỗi Java version**: Đảm bảo `java -version` trả về JDK 17.
