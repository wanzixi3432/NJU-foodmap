# 登录、评价与图片同步配置

当前网页的登录、评价文字、评分和图片需要 Supabase 提供的云端数据库、账号系统和对象存储。仅把 `index.html` 上传到 GitHub Pages 不足以保存多人数据，首次发布前需要完成以下一次性配置。

## 1. 创建 Supabase 项目

1. 打开 [Supabase](https://supabase.com/) 并注册账号。
2. 新建一个项目，地区可选择距离南京较近的亚太区域。
3. 等待项目初始化完成。

## 2. 创建数据表与图片存储

1. 在 Supabase 控制台打开 **SQL Editor**。
2. 新建查询，先清空编辑器里的旧内容，再完整粘贴并运行项目中的 `supabase-setup.sql`。
3. 运行成功后，Database 中会存在 `food_reviews` 表，Storage 中会存在 `review-images` 存储桶。

注意：如果编辑器里还能看到 `food_platform_updates`、`meituan` 或 `dianping` 的字段定义，说明粘贴的是旧版脚本。请直接全选删除，改用当前输出目录中的完整 `supabase-setup.sql`，不要只替换报错附近的一行。

脚本会启用行级安全策略：

- 只有登录用户可以读取评价。
- 用户只能新增、修改和删除自己的评价。
- 每位用户对同一家店只能保留一条评价，重新发布时会更新原评价。
- 图片只能上传到该用户自己的目录。

## 3. 配置登录方式

1. 打开 **Authentication -> Providers -> Email**，确认 Email 登录已启用。
2. 如果希望注册后立即登录，可以在开发阶段关闭 **Confirm email**。
3. 正式公开时建议开启邮箱验证。
4. 在 **Authentication -> URL Configuration** 中填写网站正式地址：

   - Site URL：GitHub Pages 或其他静态托管网站的首页地址
   - Redirect URLs：同一正式地址

## 4. 填写公开云端配置

在 Supabase 的 **Project Settings -> API** 中复制：

- Project URL
- Publishable key 或 anon public key

然后编辑 `cloud-config.js`：

```js
window.NJU_CLOUD_CONFIG = {
  supabaseUrl: "https://你的项目编号.supabase.co",
  supabaseAnonKey: "你的 anon public key",
  storageBucket: "review-images",
};
```

`anon public key` 可以放在浏览器代码中；绝对不要填写 `service_role` 密钥。

## 5. 重新生成发布文件

配置完成后，在项目目录运行：

```powershell
node work/build_single_file.mjs
```

该命令会重新生成：

- `github-pages/index.html`
- `南大人的美食地图-单文件版.html`

使用外部文件版本时，需要同时上传 `cloud-config.js` 和 `community.js`。使用单文件版时，云端配置已经内联到 HTML 中。

## 6. 验收功能

使用两个不同浏览器或不同网络设备：

1. 注册并登录两个测试账号。
2. 打开同一家店，分别发布评分、文字和图片。
3. 确认两边都能看到对方评价。
4. 确认同一账号再次提交同一家店时是更新原评价，而不是重复计数。
5. 确认综合评分按 `0.2×美团 + 0.2×大众点评 + 0.6×用户均分` 更新。

如果美团或大众点评任一评分尚未核验，页面仍会保留“待平台核验”，不会用百度评分补位。
