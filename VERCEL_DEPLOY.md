# Vercel Deployment Guide

Hướng dẫn deploy ứng dụng Football App Management lên Vercel.

## 1. Chuẩn bị

### 1.1. Đảm bảo code đã được commit và push lên Git

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2. Kiểm tra build local

```bash
yarn build
```

Nếu build thành công, bạn có thể tiếp tục với deployment.

## 2. Deploy lên Vercel

### Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. **Truy cập Vercel Dashboard**
   - Vào [vercel.com](https://vercel.com)
   - Đăng nhập bằng GitHub account (hoặc tạo account mới)

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Chọn repository `footballappmanagement` từ GitHub
   - Click **"Import"**

3. **Cấu hình Project**
   - **Framework Preset**: Next.js (tự động detect)
   - **Root Directory**: `./` (hoặc để mặc định)
   - **Build Command**: `yarn build` (hoặc để mặc định)
   - **Output Directory**: `.next` (hoặc để mặc định)
   - **Install Command**: `yarn install` (hoặc để mặc định)

4. **Cấu hình Environment Variables**
   
   Click **"Environment Variables"** và thêm các biến sau:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # NextAuth Configuration
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=your_nextauth_secret

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

   **Lưu ý quan trọng:**
   - `NEXTAUTH_URL`: Sau khi deploy lần đầu, Vercel sẽ cung cấp URL. Bạn cần update lại environment variable này với URL thực tế.
   - `NEXTAUTH_SECRET`: Tạo một secret key ngẫu nhiên (có thể dùng lệnh: `openssl rand -base64 32`)

5. **Deploy**
   - Click **"Deploy"**
   - Chờ quá trình build và deploy hoàn tất

### Cách 2: Deploy qua Vercel CLI

1. **Cài đặt Vercel CLI**
   ```bash
   npm i -g vercel
   # hoặc
   yarn global add vercel
   ```

2. **Login vào Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd MyApp/footballappmanagement
   vercel
   ```

4. **Cấu hình Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   ```

5. **Deploy production**
   ```bash
   vercel --prod
   ```

## 3. Cấu hình sau khi deploy

### 3.1. Update Google OAuth Redirect URI

Sau khi deploy, bạn sẽ có URL như: `https://your-app-name.vercel.app`

1. Vào [Google Cloud Console](https://console.cloud.google.com)
2. Vào **APIs & Services** → **Credentials**
3. Chọn OAuth 2.0 Client ID của bạn
4. Thêm **Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
5. Save changes

### 3.2. Update NEXTAUTH_URL trong Vercel

1. Vào Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Update `NEXTAUTH_URL` với URL thực tế của bạn:
   ```
   https://your-app-name.vercel.app
   ```
3. Redeploy để áp dụng thay đổi

### 3.3. Kiểm tra Supabase Storage Bucket

Đảm bảo bucket `team-avatars` đã được tạo và có RLS policies đúng như hướng dẫn trong `SUPABASE_SETUP.md`.

## 4. Kiểm tra sau khi deploy

1. **Truy cập URL**: `https://your-app-name.vercel.app`
2. **Kiểm tra landing page**: Xem có hiển thị đúng không
3. **Test login**: Thử đăng nhập bằng Google SSO
4. **Test các chức năng**:
   - Tạo/Edit/Delete teams
   - Tạo/Edit/Delete matches
   - Tạo/Edit/Delete loans
   - Upload avatar

## 5. Troubleshooting

### Lỗi "NEXTAUTH_SECRET is not set"
- Đảm bảo đã thêm `NEXTAUTH_SECRET` vào Environment Variables trong Vercel
- Redeploy sau khi thêm environment variables

### Lỗi "Supabase is not configured"
- Kiểm tra `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` đã được thêm vào Environment Variables
- Đảm bảo các giá trị này đúng (không có khoảng trắng thừa)

### Lỗi OAuth redirect mismatch
- Kiểm tra Google OAuth redirect URI đã được cấu hình đúng với URL Vercel
- Kiểm tra `NEXTAUTH_URL` trong Vercel environment variables

### Lỗi build failed
- Kiểm tra logs trong Vercel Dashboard → Deployments
- Đảm bảo tất cả dependencies đã được cài đặt đúng
- Kiểm tra TypeScript errors: `yarn build` local trước

### Images không hiển thị
- Kiểm tra Supabase Storage bucket `team-avatars` đã được tạo
- Kiểm tra RLS policies cho phép public read
- Kiểm tra CORS settings trong Supabase

## 6. Custom Domain (Tùy chọn)

1. Vào Vercel Dashboard → Project → **Settings** → **Domains**
2. Thêm domain của bạn
3. Follow hướng dẫn để cấu hình DNS
4. Update `NEXTAUTH_URL` và Google OAuth redirect URI với domain mới

## 7. Environment Variables Checklist

Trước khi deploy, đảm bảo bạn đã có:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXTAUTH_URL` (sẽ update sau khi deploy)
- [ ] `NEXTAUTH_SECRET` (tạo secret key ngẫu nhiên)
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`

## 8. Lưu ý

- **Never commit `.env.local`**: File này đã được thêm vào `.gitignore`
- **Environment Variables trong Vercel**: Các biến này sẽ được inject vào build process
- **Automatic Deployments**: Mỗi khi push code lên GitHub, Vercel sẽ tự động deploy (nếu đã kết nối)
- **Preview Deployments**: Mỗi pull request sẽ tạo một preview deployment riêng

## 9. Useful Commands

```bash
# Check build locally
yarn build

# Start production server locally
yarn start

# Deploy to Vercel (CLI)
vercel

# Deploy to production (CLI)
vercel --prod

# View deployment logs
vercel logs
```
