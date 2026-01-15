# Hướng dẫn thiết lập Google SSO

Hướng dẫn từng bước để thiết lập Google OAuth cho ứng dụng.

## Bước 1: Tạo Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một project mới hoặc chọn project hiện có
3. Điều hướng đến **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Nếu chưa có, bạn sẽ cần cấu hình **OAuth consent screen** trước:
   - Chọn **External** (hoặc Internal nếu dùng Google Workspace)
   - Điền thông tin:
     - **App name**: Football App Management
     - **User support email**: Email của bạn
     - **Developer contact information**: Email của bạn
   - Click **Save and Continue**
   - Ở màn hình **Scopes**, click **Save and Continue**
   - Ở màn hình **Test users** (nếu cần), thêm email test, click **Save and Continue**
   - Review và **Back to Dashboard**

6. Tạo OAuth Client ID:
   - **Application type**: Web application
   - **Name**: Football App Management Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click **Create**

7. Copy **Client ID** và **Client Secret** (bạn sẽ cần chúng ở bước tiếp theo)

## Bước 2: Tạo file .env.local

1. Tạo file `.env.local` trong thư mục root của dự án:
   ```bash
   touch .env.local
   ```

2. Thêm các biến môi trường sau vào file:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

3. Tạo `NEXTAUTH_SECRET`:
   - Chạy lệnh sau để tạo secret key:
     ```bash
     openssl rand -base64 32
     ```
   - Hoặc sử dụng online generator: https://generate-secret.vercel.app/32
   - Copy kết quả và paste vào `NEXTAUTH_SECRET`

## Bước 3: Cấu hình cho Production

Khi deploy lên production (Vercel, Netlify, etc.):

1. Thêm các biến môi trường trong dashboard của hosting platform
2. Cập nhật **Authorized redirect URIs** trong Google Cloud Console:
   ```
   https://your-domain.com/api/auth/callback/google
   ```
3. Cập nhật `NEXTAUTH_URL` trong `.env`:
   ```env
   NEXTAUTH_URL=https://your-domain.com
   ```

## Bước 4: Test Google SSO

1. Chạy development server:
   ```bash
   yarn dev
   ```

2. Mở trình duyệt và truy cập: `http://localhost:3000`

3. Click nút **Login** hoặc **Get Started**

4. Click **Sign in with Google**

5. Chọn tài khoản Google và cho phép quyền truy cập

6. Bạn sẽ được redirect về trang chủ và thấy thông tin user đã đăng nhập

## Troubleshooting

### Lỗi: "redirect_uri_mismatch"
- Kiểm tra lại **Authorized redirect URIs** trong Google Cloud Console
- Đảm bảo URL khớp chính xác: `http://localhost:3000/api/auth/callback/google`

### Lỗi: "Invalid client"
- Kiểm tra lại `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` trong `.env.local`
- Đảm bảo không có khoảng trắng thừa

### Lỗi: "NEXTAUTH_SECRET is missing"
- Tạo và thêm `NEXTAUTH_SECRET` vào `.env.local`
- Restart development server sau khi thêm

### Session không persist
- Kiểm tra cookies trong browser
- Đảm bảo `NEXTAUTH_URL` được set đúng

## Cấu trúc file đã tạo

- `lib/auth.ts` - Cấu hình NextAuth với Google Provider
- `app/api/auth/[...nextauth]/route.ts` - API route handler
- `components/SessionProvider.tsx` - Session provider wrapper
- `components/landing/LoginModal.tsx` - Modal với Google SSO button
- `components/landing/LandingPage.tsx` - Landing page với session management

## Lưu ý bảo mật

- **KHÔNG** commit file `.env.local` lên Git
- File `.env.local` đã được thêm vào `.gitignore`
- Sử dụng environment variables trong production
- Rotate `NEXTAUTH_SECRET` định kỳ

## Tài liệu tham khảo

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
