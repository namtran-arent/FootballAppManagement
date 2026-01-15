# Supabase Storage Setup Guide

Hướng dẫn thiết lập Supabase Storage để upload ảnh đại diện cho teams.

## 1. Tạo Storage Bucket

1. Truy cập Supabase Dashboard
2. Vào **Storage** trong menu bên trái
3. Click **New bucket**
4. Tạo bucket với tên: `team-avatars`
5. Chọn **Public bucket** để cho phép truy cập công khai
6. Click **Create bucket**

## 2. Cấu hình Bucket Policies

1. Vào bucket `team-avatars` vừa tạo
2. Vào tab **Policies**
3. Tạo policy để cho phép upload và read:

### Policy 1: Allow public read access
```sql
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'team-avatars');
```

### Policy 2: Allow authenticated users to upload
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'team-avatars' AND
  auth.role() = 'authenticated'
);
```

### Policy 3: Allow users to update their own files
```sql
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'team-avatars' AND
  auth.role() = 'authenticated'
);
```

### Policy 4: Allow users to delete their own files
```sql
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'team-avatars' AND
  auth.role() = 'authenticated'
);
```

## 3. Kiểm tra

Sau khi setup xong:

1. Thử upload ảnh trong form tạo team
2. Kiểm tra trong Supabase Dashboard > Storage > team-avatars để xem file đã được upload
3. Kiểm tra ảnh có hiển thị đúng trong danh sách teams

## 4. Lưu ý

- Bucket phải là **Public** để có thể truy cập ảnh từ frontend
- File size limit mặc định là 50MB, có thể điều chỉnh trong bucket settings
- Nếu không upload ảnh, hệ thống sẽ tự động sử dụng ảnh mặc định (football emoji)
