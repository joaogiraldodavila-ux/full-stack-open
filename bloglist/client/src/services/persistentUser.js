const storageKey = "loggedBlogAppUser"

export const saveUser = (user) => {
  window.localStorage.setItem(storageKey, JSON.stringify(user))
}

export const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem(storageKey)
  if (loggedUserJSON) {
    return JSON.parse(loggedUserJSON)
  }
  return null
}

export const removeUser = () => {
  window.localStorage.removeItem(storageKey)
}

export default {
  saveUser,
  getUser,
  removeUser,
}
