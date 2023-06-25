import { IncomingForm } from 'formidable'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Web3Storage, getFilesFromPath } from 'web3.storage'

export const config = {
  api: {
    bodyParser: false,
  },
}

const TRIM_REGEXP = /\s+/g

// eslint-disable-next-line import/no-anonymous-default-export
export default async function web3StorageUpload(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = process.env.WEB3_STORAGE_TOKEN
    if (!token) {
      respondError(req, res, 'No api token')
      return
    }

    const client = new Web3Storage({ token })
    const data = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      const form = new IncomingForm({

        multiples: false,
        filename: (name, _, part, form) => {
          const { originalFilename, mimetype } = part
          if (originalFilename) {
            return originalFilename.replace(TRIM_REGEXP, '_')
          }
          const ex = mimetype?.includes('image') ? mimetype.replace('image/', '') : 'png'
          return `${name.replace(TRIM_REGEXP, '_')}.${ex}`
        },
      })
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('err', err)
          respondError(req, res, JSON.stringify(err))
          reject(err)
          return
        }
        resolve({ fields, files })
      })
    })

    if (!data?.files.file[0].filepath) {
      respondError(req, res, 'No File Data')
      return
    }
    const fileName = data?.files.file[0]?.newFilename
      ? data?.files.file[0]?.newFilename
      : data?.files.file[0]?.originalFilename.replace(TRIM_REGEXP, '_')
    const files = await getFilesFromPath(data?.files.file[0].filepath)
    console.log("at web3s fileupload")
    const rootCid = await client.put(files, { name: fileName })
    res.statusCode = 200
    res.json({ cid: rootCid })
    res.end()
  } catch (error) {
    console.error('error', error)
    respondError(req, res, JSON.stringify(error))
  }
}

const respondError = (req: NextApiRequest, res: NextApiResponse, text: string) => {
  res.statusCode = 500
  res.json({
    method: req.method,
    error: text,
  })
  res.end()
}
