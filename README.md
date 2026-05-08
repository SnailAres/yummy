# Chanzuimao Mini Program MVP

This repository implements the MVP baseline from:

- `设计方案/《馋嘴猫》小程序完整设计方案（推荐版）.md`
- `设计方案/《馋嘴猫》小程序开发计划（微信云开发+云托管）.md`

## Structure

- `miniprogram/`: WeChat mini program frontend.
- `cloudfunctions/`: Cloud function handlers and shared business logic.
- `cloudhosting/admin-api/`: Cloud hosting API service.
- `scripts/verify.mjs`: End-to-end cloud function verification script.
- `docs/`: Deployment and schema notes.

## Run Verification

```bash
npm test
```

Expected result:

- Cloud hosting API tests pass.
- Cloud function main flow verification passes.

## Deploy Notes

1. Replace `miniprogram/app.js` `envId` with your cloud environment ID.
2. Update `project.config.json` `appid` with your mini program appid.
3. Deploy cloud functions in WeChat DevTools.
4. Deploy `cloudhosting/admin-api` as cloud hosting service.
5. Configure domain and env variables in WeChat cloud console.
