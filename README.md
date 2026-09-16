# MingKai Precision Tools B2B Site

English B2B marketing frontend with a Simplified Chinese administration workflow for Dongguan Mingkai Hardware Cutting Tools Co., Ltd.

## Start here

- `docs/BUILD_SPEC.md` — project positioning, sitemap, image mapping and acceptance conditions
- `docs/ADMIN_GUIDE_ZH.md` — 中文后台使用说明
- `docs/DEPLOYMENT.md` — production configuration and security requirements
- `docs/TEST_RESULTS.md` — verified checks and publication status

## Local run

Use Node.js 22.13+ and install dependencies, then run the development script. A production build is generated with the build script. The database migration is in `drizzle/0000_fair_ares.sql`.

## 一键预览与内容备份

1. 解压源码包后，双击 `Start-Local-Preview.bat`。首次运行会安装依赖，之后自动打开中文后台 `http://localhost:5173/admin`。
2. 在后台创建分类、上传图片、录入产品；产品卡片可填写 MOQ、定制服务和展示标签，先保存为草稿，确认后再发布。
3. 在“博客管理”中新增英文技术文章；选择“已发布”后，文章会自动显示在前台博客并进入站点地图。
4. 前台所有“获取报价 / Get a Quote / Quote This Tool”入口均直接打开 WhatsApp，并预填相应产品或页面上下文。
5. 每次完成一轮录入或修改，双击 `Create-Complete-Backup.bat`。它会在 `outputs` 文件夹生成 `MingKai-B2B-Complete-Local-Backup.zip`，其中包含源码以及本机预览的产品、询盘和媒体数据。

本机备份仅用于上线前的本地预览。正式上线时会将最终源码与已确认的数据迁移到正式的云端数据库和媒体存储；购买域名不是本地预览或内容录入的前提。

Before public launch, set the final domain, verified contact details, WhatsApp Business number, privacy notice and administrator access control. Keep all real products in draft status until reviewed.

For pre-launch content entry, keep the preview private, open `/admin`, sign in, create categories, upload images and add products. The current local preview uses the protected preview sign-in; a final hosted domain must use Cloudflare Access (or equivalent) for the same protection. Product uploads are stored in D1/R2 and source changes are packaged again before every review handoff.
