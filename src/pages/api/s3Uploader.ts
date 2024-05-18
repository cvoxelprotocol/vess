import fs from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import formidable, { IncomingForm } from 'formidable'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'

export const maxDuration = 300

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 300,
}

const TRIM_REGEXP = /\s+/g

// eslint-disable-next-line import/no-anonymous-default-export
export default async function s3Upload(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s3Key = process.env.S3_ACCESS_KEY_ID
    const s3Secret = process.env.S3_SECRET_ACCESS_KEY
    const s3Region = process.env.S3_REGION
    const s3Bucket = process.env.S3_BUCKET_NAME
    if (!s3Key || !s3Secret || !s3Region || !s3Bucket) {
      respondError(req, res, 'No api key and secret found')
      return
    }

    console.log({ s3Bucket })

    const s3Client = new S3Client({
      credentials: {
        accessKeyId: s3Key,
        secretAccessKey: s3Secret,
      },
      region: s3Region,
    })

    const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
      (resolve, reject) => {
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
      },
    )

    const files = data.files.file as formidable.File[]
    const targetFile = files[0]
    if (!targetFile) {
      respondError(req, res, 'No File Data')
      return
    }
    const fileContent = await fs.promises.readFile(targetFile.filepath)
    const ext = targetFile.newFilename.split('.').pop()?.toLowerCase()
    const fileName = `${uuidv4()}.${ext}`
    const mimetype = targetFile.mimetype || `image/${ext}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Bucket,
        Key: fileName,
        Body: fileContent,
        ContentType: mimetype,
      }),
    )
    res.statusCode = 200
    res.json({ url: `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${fileName}` })
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
