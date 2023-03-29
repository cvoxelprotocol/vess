export type LinkType = {
  label: string
  url: string
}

export type footerLinksType = {
  [title: string]: {
    links: LinkType[]
  }
}

export const footerLinks: footerLinksType = {
  Ecosystem: {
    links: [
      {
        label: 'VESS Protocol',
        url: 'https://vess.id',
      },
      {
        label: 'SYNAPSS: Web3 Jobs',
        url: 'https://synapss.vess.id',
      },
      {
        label: 'VESS SDK',
        url: 'https://doc.vess.id/vess-sdk/overview',
      },
    ],
  },
  Resources: {
    links: [
      {
        label: 'Our Company',
        url: 'https://vess.id/company',
      },
      {
        label: 'Docs',
        url: 'https://doc.vess.id',
      },
      {
        label: 'Career',
        url: 'https://synapss.vess.id/workspace/kjzl6cwe1jw145y2y6pe91xmjbgwmh9rf0yvf1b80ilkp8n2cqpy5fx30k6w75j?orgId=3969a742-d05c-4154-a6f8-5e5e300618de',
      },
    ],
  },
  Legal: {
    links: [
      {
        label: 'Privacy Policy',
        url: 'https://vesslabs.notion.site/VESS-Privacy-Policy-b22d5bcda02e43189c202ec952467a0d',
      },
      {
        label: 'Terms of Service',
        url: 'https://vesslabs.notion.site/SYNAPSS-Terms-of-Use-39db3259ab5544b58fceb80c8168888d',
      },
    ],
  },
}
