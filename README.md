# MintMate

MintMate is an open-source NFT minting platform that lets you mint your art, with the goal of crystallizing the art as a means of passion.

## Tech Stacks

- NextJS
- Prisma
- ThirdWeb
- TailwindCSS

## Prerequisite

You need the following essentials before you begin:

- [ThirdWeb](https://portal.thirdweb.com) dashboard access and check
- MySQL Database URL (I personally use [PlanetScale](https://planetscale.com))
- API keys for ThirdWeb and Database
- Check `.env.example` for .env placeholder and guidelines for API keys.

## Installation

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

## Deployment

### Serverless

#### Vercel

1. Login with github that contain this app repo
2. Go to [Vercel](https://vercel.com/dashboard) dashboard
3. Click <b>add new +</b> project
4. Import your repo
5. Copy and paste all .env keys to environment variables
6. Deploy

#### Netlify & Cloudflare

- The steps would be pretty much the same as Vercel with slightly different layout
- [Deploy NextJS with Cloudflare](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
- [Deploy NextJS with Netlify](https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/)

## Optional command

- Cleaning up development/production build cache

```
npm run clean
```

## Links

- Opensea Minting Profile - [0x4cdc6523Fc715A8C9d95B46A70e76bD26055Fc31](https://testnets.opensea.io/0x4cdc6523Fc715A8C9d95B46A70e76bD26055Fc31)

## Contributor

- [Kebabhan](https://kebabhan.vercel.app)
