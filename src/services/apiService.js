class ApiService {
  constructor() {
    // Use environment variable or fallback to default
    this.baseUrl = import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "http://team-dashboard-project.local/wp-json"
    this.token = null

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("jwt_token")
    }
  }

  setToken(token) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("jwt_token", token)
      } else {
        localStorage.removeItem("jwt_token")
      }
    }
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`
      console.info("[API] →", url)

      const response = await fetch(url, {
        headers: this.getHeaders(),
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.message || data.error || `HTTP error! status: ${response.status}`,
          data: null,
        }
      }

      return { data, error: null }
    } catch (err) {
      const msg =
        err.message === "Failed to fetch"
          ? "Cannot reach the WordPress API. Check that VITE_API_BASE is correct, the server is running, and CORS is allowed."
          : err.message

      console.error("API Request failed:", msg)
      return { error: msg, data: null }
    }
  }

  // Authentication endpoints
  async login(username, password) {
    return this.makeRequest("/jwt-auth/v1/token", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async getCurrentUser() {
    return this.makeRequest("/wp/v2/users/me")
  }

  // Teams endpoints
  async getTeams() {
    return this.makeRequest("/teamtask/v1/teams")
  }

  async createTeam(teamData) {
    return this.makeRequest("/teamtask/v1/teams", {
      method: "POST",
      body: JSON.stringify(teamData),
    })
  }

  async updateTeam(teamId, teamData) {
    return this.makeRequest(`/teamtask/v1/teams/${teamId}`, {
      method: "PUT",
      body: JSON.stringify(teamData),
    })
  }

  async deleteTeam(teamId) {
    return this.makeRequest(`/teamtask/v1/teams/${teamId}`, {
      method: "DELETE",
    })
  }

  // Tasks endpoints
  async getTasks() {
    return this.makeRequest("/teamtask/v1/tasks")
  }

  async createTask(taskData) {
    return this.makeRequest("/teamtask/v1/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    })
  }

  async updateTask(taskId, taskData) {
    return this.makeRequest(`/teamtask/v1/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    })
  }

  async deleteTask(taskId) {
    return this.makeRequest(`/teamtask/v1/tasks/${taskId}`, {
      method: "DELETE",
    })
  }
}

export const apiService = new ApiService()
