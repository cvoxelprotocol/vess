import { CarReader } from '@ipld/car'
import { importDAG } from '@ucanto/core/delegation'
import * as Signer from '@ucanto/principal/ed25519' // Agents on Node should use Ed25519 keys
import { StoreMemory } from '@web3-storage/access/stores/store-memory'
import { create } from '@web3-storage/w3up-client'
import { filesFromPaths } from 'files-from-path'
import { IncomingForm } from 'formidable'
import type { NextApiRequest, NextApiResponse } from 'next'

export const maxDuration = 300

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 300,
}

const TRIM_REGEXP = /\s+/g

// eslint-disable-next-line import/no-anonymous-default-export
export default async function web3StorageUpload(req: NextApiRequest, res: NextApiResponse) {
  try {
    const web3key = process.env.WEB3_STORAGE_KEY
    const web3Proof = process.env.WEB3_STORAGE_PROOF
    if (!web3key || !web3Proof) {
      respondError(req, res, 'No web3 api key and proof')
      return
    }
    const principal = Signer.parse(web3key)
    const client = await create({
      principal,
      store: new StoreMemory(),
    })

    // now give Agent the delegation from the Space
    const proof = await parseProof(web3Proof)
    const space = await client.addSpace(proof)
    await client.setCurrentSpace(space.did())

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
    const files = await filesFromPaths(data?.files.file[0].filepath)
    if (files.length === 0) {
      respondError(req, res, 'No File Data')
      return
    }
    const rootCid = await client.uploadFile(files[0])
    console.log({ rootCid })
    res.statusCode = 200
    res.json({ cid: rootCid.toString() })
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

const parseProof = async (data: any) => {
  const blocks: any[] = []
  const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return importDAG(blocks)
}
