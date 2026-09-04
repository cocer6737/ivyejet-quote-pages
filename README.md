# IVYEJET Quote Pages

IVYEJET 三语报价网页的独立 GitHub Pages 发布仓库。

- 发布目录：`site/`
- 公开地址：`https://cocer6737.github.io/ivyejet-quote-pages/`
- 自动部署：推送到 `main` 后由 GitHub Actions 发布

本仓库只包含客户报价页的静态发布版本。简体中文、繁体中文、英文切换，确认汇率币种切换、图片轮播、全图查看、PDF 和 TXT 下载均可直接使用。后台、报价创建 API 和审核发布流程保留在完整应用中，不在 GitHub Pages 上运行。

## 本地检查

```bash
npm run export
npm run check
```

导出前需要在相邻的 `ivyejet-quote-site` 项目中使用 `/ivyejet-quote-pages` 基础路径完成生产构建，并在 `3100` 端口启动。
