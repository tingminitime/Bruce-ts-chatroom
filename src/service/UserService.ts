export type UserData = {
  id: string
  userName: string
  roomName: string
}

export default class UserService {
  // - Record user info
  private userMap: Map<string, UserData>

  constructor() {
    this.userMap = new Map()
  }

  createUser(data: UserData) {
    this.userMap.set(data.id, data)
  }

  deleteUser(id: string) {
    if (this.userMap.has(id)) {
      this.userMap.delete(id)
    }
  }

  getUser(id: string) {
    if (!this.userMap.has(id)) return null

    const data = this.userMap.get(id)
    if (data) {
      return data
    }

    return null
  }

  getUserData(id: string, userName: string, roomName: string): UserData {
    return {
      id,
      userName,
      roomName,
    }
  }
}
