export const getCurrentDomain = () => {
  if (typeof window === 'undefined') return
  const { protocol, hostname, port } = window.location
  return `${protocol}//${hostname}${port ? ':' + port : ''}`
}

export const urlRegExp =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/i

export const domainRegExp = (domain: string) => {
  return new RegExp(
    `^https?:\\/\\/(?:www\\.)?${domain}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$`,
  )
}

export const handleNameREgExp = /^@(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
