// import { createClient } from '@supabase/supabase-js'

// const url = 'https://ylgfjdlgyjmdikqavpcj.supabase.co'
// const key =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZ2ZqZGxneWptZGlrcWF2cGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ3NTc3NTIsImV4cCI6MTk3MDMzMzc1Mn0.2XdkerM98LhI6q5MBBaXRq75yxOSy-JVbwtTz6Dn9d0'

// export type OrbisBaseResponse =
//   | {
//       status: number
//       doc: any
//       result: string
//       error?: undefined
//     }
//   | {
//       status: number
//       error: any
//       result: string
//       doc?: undefined
//     }

// export type OrbisProfile = {
//   did: string
//   details: OrbisDetails
//   count_followers: number
//   count_following: number
//   last_activity_timestamp: number
// }

// type OrbisDetails = {
//   profile: OrbisProfileDetail
//   did: string
// }

// export type OrbisProfileDetail = {
//   username: string
//   description: string
//   pfp: string
// }

// export const fetchOrbisProfile = async (did?: string): Promise<OrbisProfileDetail | null> => {
//   if (!did) return null
//   const indexer = createClient(url, key, {
//     auth: {
//       autoRefreshToken: false,
//       persistSession: false,
//     },
//   })
//   let { data } = await indexer.from('orbis_v_profiles').select().eq('did', did).single()
//   const profile: OrbisProfile = data as OrbisProfile
//   if (!profile || !profile.details || !profile.details.profile) return null
//   return profile.details.profile
// }
