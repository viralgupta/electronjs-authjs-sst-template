# Electron.js + Auth.js + SST Template

https://github.com/user-attachments/assets/aa7ff687-f6c4-4278-9959-3bf6665753ce

This template combines the power of **Electron.js** for cross-platform desktop applications, **Auth.js** for secure authentication, and **SST (Serverless Stack)** for scalable backend infrastructure. Use this setup to quickly build secure and scalable desktop applications with a seamless authentication layer.

## Features
- Cross-platform compatibility with Electron.js
- Secure authentication via Auth.js
- Serverless backend powered by SST

## Note
- This template uses Credentials Provider Of Auth.js
- Uses `next-auth/client` package for client side
- Uses `@auth/express` package for backend

Steps to Start Using this Template: 

1. Clone this Repo
```bash
git clone https://github.com/viralgupta/electronjs-authjs-sst-template.git
cd electronjs-authjs-sst-template
pnpm install
```
2. Configure AWS Credentials ([Guide](https://branchv80.archives.sst.dev/chapters/configure-the-aws-cli.html))
3. Configure Auth Secret For the Stack (You might want to use OPENSSL for generating a strong secret)
```
npx sst secrets set AUTH_SECRET helloworld
```
4. Start Backend
```
npm run dev
```
5. Start Electron App (separate terminal)
```
npm run dev:software 
```
