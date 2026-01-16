# Supabase Setup Guide

Hướng dẫn thiết lập Supabase để lưu thông tin người dùng khi đăng nhập lần đầu.

## 1. Tạo Supabase Project

1. Truy cập [Supabase](https://supabase.com) và đăng nhập
2. Tạo một project mới
3. Lưu lại **Project URL** và **anon/public key** từ Settings > API

## 2. Tạo Database Tables

### 2.1. Tạo bảng Users

1. Mở Supabase Dashboard
2. Vào **SQL Editor**
3. Copy và chạy nội dung từ file `SUPABASE_USERS_TABLE.sql`

### 2.2. Tạo bảng Loans

1. Trong **SQL Editor**, copy và chạy nội dung từ file `SUPABASE_LOANS_TABLE.sql`

### 2.3. Tạo bảng Matches

1. Trong **SQL Editor**, copy và chạy nội dung từ file `SUPABASE_MATCHES_TABLE.sql`

### 2.4. Tạo bảng Teams

1. Trong **SQL Editor**, copy và chạy nội dung từ file `SUPABASE_TEAMS_TABLE.sql`

### 2.5. Tạo Storage Bucket cho Team Avatars

**QUAN TRỌNG**: Storage bucket phải được tạo để upload avatar hoạt động!

1. Vào **Storage** trong Supabase Dashboard (menu bên trái)
2. Click **"New bucket"** hoặc **"Create bucket"**
3. Đặt tên bucket: `team-avatars` (phải chính xác tên này)
4. Chọn **"Public bucket"** (quan trọng để có thể truy cập public URL)
5. Click **"Create bucket"**

**Cấu hình RLS Policies cho bucket:**

Sau khi tạo bucket, cần cấu hình Row Level Security (RLS) policies:

1. Vào **Storage** > **Policies** (hoặc click vào bucket `team-avatars` > **Policies**)
2. Tạo policy mới với các settings sau:
   - **Policy name**: `Public read access`
   - **Allowed operation**: `SELECT` (read)
   - **Policy definition**: 
     ```sql
     bucket_id = 'team-avatars'
     ```
   - **WITH CHECK expression**: (để trống hoặc giống Policy definition)
   - Click **"Save policy"**

3. Tạo policy thứ 2 cho upload:
   - **Policy name**: `Authenticated upload access`
   - **Allowed operation**: `INSERT` (upload)
   - **Policy definition**:
     ```sql
     bucket_id = 'team-avatars'
     ```
   - **WITH CHECK expression**:
     ```sql
     bucket_id = 'team-avatars'
     ```
   - Click **"Save policy"**

4. Tạo policy thứ 3 cho update/delete:
   - **Policy name**: `Authenticated update/delete access`
   - **Allowed operation**: `UPDATE` và `DELETE`
   - **Policy definition**:
     ```sql
     bucket_id = 'team-avatars'
     ```
   - **WITH CHECK expression**:
     ```sql
     bucket_id = 'team-avatars'
     ```
   - Click **"Save policy"**

**Hoặc sử dụng SQL để tạo policies:**

Vào **SQL Editor** và chạy:

```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT
USING (bucket_id = 'team-avatars');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'team-avatars');

-- Allow authenticated users to update/delete
CREATE POLICY "Authenticated update/delete access" ON storage.objects
FOR UPDATE
USING (bucket_id = 'team-avatars');

CREATE POLICY "Authenticated delete access" ON storage.objects
FOR DELETE
USING (bucket_id = 'team-avatars');
```

**Kiểm tra:**
- Bucket `team-avatars` xuất hiện trong danh sách Storage buckets
- Bucket có status "Public"
- Policies đã được tạo và active

### 2.6. Lưu ý về Foreign Keys

Các bảng đã được thiết kế với foreign keys:
- **matches** table tham chiếu đến **teams** table (home_team_id, away_team_id)
- **loans** table tham chiếu đến **teams** table (team_id) và **matches** table (match_id)

Nếu bạn đã có dữ liệu trong các bảng cũ, xem file `SUPABASE_MIGRATION_FOREIGN_KEYS.sql` để migrate dữ liệu.

Hoặc copy SQL sau:

```sql
-- Create users table for storing OAuth user information
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  image TEXT,
  provider VARCHAR(50) DEFAULT 'google',
  first_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_users_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Enable all operations for all users" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

## 3. Cấu hình Environment Variables

Thêm các biến môi trường sau vào file `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Existing Google OAuth variables (if not already set)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Ví dụ:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 4. Cách hoạt động

### 4.1. User Authentication

Khi người dùng đăng nhập lần đầu bằng Google SSO:

1. NextAuth xử lý authentication với Google
2. Callback `signIn` được gọi trong `lib/auth.ts`
3. Hàm `createOrUpdateUser` được gọi để:
   - Kiểm tra xem user đã tồn tại trong database chưa (dựa trên `provider_id`)
   - Nếu chưa tồn tại: Tạo user mới với thông tin từ Google
   - Nếu đã tồn tại: Cập nhật thông tin (name, image, last_login_at)
4. Thông tin user được lưu vào bảng `users` trong Supabase

### 4.2. Loan Management

Khi người dùng thao tác với Loans:

1. **Create**: Khi tạo loan mới, dữ liệu được lưu vào bảng `loans` với `user_id` liên kết
2. **Read**: Tất cả loans được load từ Supabase khi trang được mở
3. **Update**: Khi chỉnh sửa loan, dữ liệu được cập nhật trong Supabase
4. **Delete**: Khi xóa loan, bản ghi được xóa khỏi Supabase
5. Tất cả operations đều có error handling và loading states

### 4.3. Match Management

Khi người dùng thao tác với Matches:

1. **Create**: Khi tạo match mới, dữ liệu được lưu vào bảng `matches` với `user_id` liên kết
2. **Read**: Matches được load từ Supabase theo ngày được chọn (filter by `match_date`)
3. **Update**: Khi chỉnh sửa match, dữ liệu được cập nhật trong Supabase
4. **Delete**: Khi xóa match, bản ghi được xóa khỏi Supabase
5. Matches tự động reload khi người dùng thay đổi ngày xem
6. Tất cả operations đều có error handling và loading states

### 4.4. Team Management

Khi người dùng thao tác với Teams:

1. **Create**: Khi tạo team mới, dữ liệu được lưu vào bảng `teams` với `user_id` liên kết
2. **Read**: Tất cả teams được load từ Supabase khi trang được mở
3. **Update**: Khi chỉnh sửa team, dữ liệu được cập nhật trong Supabase
4. **Delete**: Khi xóa team, bản ghi được xóa khỏi Supabase
5. Tất cả operations đều có error handling và loading states
6. Team name phải là unique (không trùng lặp)

## 5. Kiểm tra

Sau khi setup xong:

1. Chạy ứng dụng: `yarn dev`
2. Đăng nhập bằng Google
3. Kiểm tra trong Supabase Dashboard > Table Editor:
   - Bảng `users`: Xem user mới đã được tạo
   - Bảng `loans`: Tạo một loan mới và kiểm tra dữ liệu đã được lưu
   - Bảng `matches`: Tạo một match mới và kiểm tra dữ liệu đã được lưu
   - Bảng `teams`: Tạo một team mới và kiểm tra dữ liệu đã được lưu

## 6. Lưu ý về Security

- File `.env.local` không nên commit vào git (đã có trong .gitignore)
- Row Level Security (RLS) đã được enable cho bảng `users`
- Policy hiện tại cho phép tất cả operations - bạn có thể customize theo nhu cầu bảo mật
- Nếu cần bảo mật hơn, có thể thêm authentication check trong RLS policies

## 7. Troubleshooting

### Lỗi "Supabase is not configured"
- Kiểm tra xem đã thêm `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` vào `.env.local` chưa
- Đảm bảo restart server sau khi thêm environment variables

### Lỗi khi tạo user
- Kiểm tra xem bảng `users` đã được tạo chưa
- Kiểm tra RLS policies có cho phép insert không
- Xem logs trong console để biết lỗi cụ thể

### User không được lưu vào database
- Kiểm tra network tab trong browser để xem có request đến Supabase không
- Kiểm tra Supabase logs trong Dashboard > Logs
- Đảm bảo `provider_id` là unique (không trùng với user khác)

### Lỗi khi thao tác với Loans
- Kiểm tra xem bảng `loans` đã được tạo chưa
- Kiểm tra RLS policies có cho phép CRUD operations không
- Kiểm tra foreign key constraint với bảng `users` (nếu có lỗi về user_id)
- Xem logs trong console để biết lỗi cụ thể
- Đảm bảo các trường bắt buộc (team_name, match_info, match_date, match_time, number_of_players, status) đều có giá trị

### Lỗi khi thao tác với Matches
- Kiểm tra xem bảng `matches` đã được tạo chưa
- Kiểm tra RLS policies có cho phép CRUD operations không
- Kiểm tra foreign key constraint với bảng `users` (nếu có lỗi về user_id)
- Xem logs trong console để biết lỗi cụ thể
- Đảm bảo các trường bắt buộc (home_team, away_team, league, country, match_date, status) đều có giá trị
- Kiểm tra format của `match_date` phải là YYYY-MM-DD

### Lỗi khi thao tác với Teams
- Kiểm tra xem bảng `teams` đã được tạo chưa
- Kiểm tra RLS policies có cho phép CRUD operations không
- Kiểm tra foreign key constraint với bảng `users` (nếu có lỗi về user_id)
- Xem logs trong console để biết lỗi cụ thể
- Đảm bảo các trường bắt buộc (team_name, captain_name, captain_phone) đều có giá trị
- Kiểm tra `team_name` phải là unique (không trùng với team khác)

### Lỗi khi upload Avatar (Storage bucket không tồn tại)
**Lỗi phổ biến**: `Storage bucket "team-avatars" does not exist`

**Giải pháp**:
1. Vào Supabase Dashboard > **Storage**
2. Tạo bucket mới với tên chính xác: `team-avatars`
3. Đảm bảo bucket được set là **"Public bucket"**
4. Cấu hình RLS policies như hướng dẫn ở mục 2.5
5. Refresh trang và thử upload lại

**Kiểm tra bucket đã được tạo**:
- Vào Storage trong Supabase Dashboard
- Xem danh sách buckets, `team-avatars` phải có trong danh sách
- Click vào bucket để xem details và policies

**Lỗi khác liên quan đến Storage**:
- Nếu upload thành công nhưng avatar không hiển thị: Kiểm tra RLS policies có cho phép public read không
- Nếu lỗi "Forbidden" khi upload: Kiểm tra RLS policies có cho phép INSERT không
- Nếu URL không hợp lệ: Kiểm tra bucket name phải chính xác là `team-avatars` (không có khoảng trắng, đúng chữ hoa/thường)
