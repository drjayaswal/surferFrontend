"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER || "https://surfer-backend.onrender.com/api";

interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
}

// --- Payload Types ---
interface sendConnectPayload {
  email: string;
  message: string;
}
interface sendHelpPayload {
  email: string;
  message: string;
}
interface GenerateOtpPayload {
  email: string;
}
interface sendConnectionPayload {
  prompt?: string;
  attachments?: File[];
}
interface uploadProfilePicPayload {
  file: File;
}
interface uploadCorpusPayload {
  files: File[];
}
interface updateApiKeyPayload {
  key: string;
}
interface updateProfilePayload {
  name: string;
  bio: string;
}
interface updatePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}
interface uploadNotePayload {
  content: string;
}
interface LoginPayload {
  email: string;
  password: string;
}
interface VerifySignupOtpPayload {
  email: string;
  name: string;
  password: string;
  otp: number;
}
interface VerifyLoginOtpPayload {
  email: string;
  otp: number;
}

class ApiClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const defaultOptions: RequestInit = {
      headers: isFormData
        ? { ...options.headers }
        : { "Content-Type": "application/json", ...options.headers },
      credentials: "include",
      ...options,
    };
    try {
      if (process.env.NODE_ENV === "development") {
        console.log(`🚀 API Request: ${options.method || "GET"} ${url}`, {
          body: options.body,
          headers: defaultOptions.headers,
        });
      }
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      if (process.env.NODE_ENV === "development") {
        console.log(`📥 API Response: ${options.method || "GET"} ${url}`, {
          status: response.status,
          data,
          headers: Object.fromEntries(response.headers.entries()),
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${options.method || "GET"} ${url}`, error);
      return {
        success: false,
        code: 500,
        message: (error as Error).message || "Network error occurred",
      } as ApiResponse<T>;
    }
  }

  // --- API Methods ---
  async generateOtp(payload: GenerateOtpPayload): Promise<ApiResponse> {
    return this.makeRequest("/auth/generate-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async getUserData(): Promise<ApiResponse> {
    return this.makeRequest("/user/data?credentials=true", {
      method: "GET",
    });
  }
  async uploadProfilePic(
    payload: uploadProfilePicPayload
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append("file", payload.file);
    return this.makeRequest("/upload/avatar", {
      method: "POST",
      body: formData,
    });
  }
  async sendHelp(payload: sendHelpPayload): Promise<ApiResponse> {
    return this.makeRequest("/public/help", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async sendConnect(payload: sendConnectPayload): Promise<ApiResponse> {
    return this.makeRequest("/public/connect", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async sendConnection(payload: sendConnectionPayload): Promise<ApiResponse> {
    const formData = new FormData();
    if (payload.prompt) formData.append("prompt", payload.prompt);
    if (payload.attachments?.length) {
      for (const file of payload.attachments) {
        formData.append("attachments", file);
      }
    }
    return this.makeRequest("/connection/send", {
      method: "POST",
      body: formData,
    });
  }
  async getConnections(): Promise<ApiResponse> {
    return this.makeRequest("/user/connections", {
      method: "GET",
    });
  }
  async uploadNote(payload: uploadNotePayload): Promise<ApiResponse> {
    return this.makeRequest("/upload/note", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async uploadCorpuses(payload: uploadCorpusPayload): Promise<ApiResponse> {
    const formData = new FormData();
    for (const file of payload.files) {
      formData.append("files", file);
    }
    return this.makeRequest("/upload/corpuses", {
      method: "POST",
      body: formData,
    });
  }
  async updateTFA(): Promise<ApiResponse> {
    return this.makeRequest("/user/update-tfa", {
      method: "GET",
    });
  }
  async updateProfile(payload: updateProfilePayload): Promise<ApiResponse> {
    return this.makeRequest("/user/update-profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async updatePassword(payload: updatePasswordPayload): Promise<ApiResponse> {
    return this.makeRequest("/user/update-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async updateApiKey(payload: updateApiKeyPayload): Promise<ApiResponse> {
    return this.makeRequest("/user/update-apikey", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async login(payload: LoginPayload): Promise<ApiResponse> {
    return this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async verifySignupOtp(payload: VerifySignupOtpPayload): Promise<ApiResponse> {
    return this.makeRequest("/auth/verify-signup-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async verifyLoginOtp(payload: VerifyLoginOtpPayload): Promise<ApiResponse> {
    return this.makeRequest("/auth/verify-login-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async refreshTokens(): Promise<ApiResponse> {
    return this.makeRequest("/auth/refresh-tokens", {
      method: "POST",
    });
  }
  async logout(): Promise<ApiResponse> {
    return this.makeRequest("/auth/logout", {
      method: "GET",
    });
  }
}

export const apiClient = new ApiClient();
