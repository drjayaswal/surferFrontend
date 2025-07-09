"use client";
import "dotenv/config";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://surfer-backend.onrender.com/api";
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY === "true";

interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
}
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
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const isFormData = options.body instanceof FormData;

      const headers: HeadersInit = isFormData
        ? {
            ...options.headers,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          }
        : {
            "Content-Type": "application/json",
            // Add CORS headers for JSON requests
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            ...options.headers,
          };

      // Use local proxy route to avoid CORS issues
      const proxyUrl = `/api/proxy?path=${encodeURIComponent(endpoint)}`;

      // Choose between direct API call or proxy based on environment
      const requestUrl = USE_PROXY ? proxyUrl : `${API_BASE_URL}${endpoint}`;

      const response = await fetch(requestUrl, {
        credentials: "include",
        mode: "cors", // Explicitly set CORS mode
        headers,
        ...options,
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        if (response.status === 0) {
          // CORS error
          throw new Error("CORS error: Unable to reach the server");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);

      // Handle CORS errors specifically
      if (error instanceof Error && error.message.includes("CORS")) {
        return {
          success: false,
          code: 0,
          message:
            "CORS error: Unable to reach the server. Please check your network connection.",
        };
      }

      return {
        success: false,
        code: 500,
        message: "Network error occurred",
      };
    }
  }
  async generateOtp(payload: GenerateOtpPayload): Promise<ApiResponse> {
    return this.request("/auth/generate-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async getUserData(): Promise<ApiResponse> {
    return this.request("/user/data?credentials=true", {
      method: "get",
    });
  }
  async uploadProfilePic(
    payload: uploadProfilePicPayload
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append("file", payload.file);
    return this.request("/upload/avatar", {
      method: "POST",
      body: formData,
    });
  }
  async sendHelp(payload: sendHelpPayload): Promise<ApiResponse> {
    return this.request("/public/help", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
  async sendConnect(payload: sendConnectPayload): Promise<ApiResponse> {
    return this.request("/public/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
  async sendConnection(payload: sendConnectionPayload): Promise<ApiResponse> {
    const formData = new FormData();

    if (payload.prompt) {
      formData.append("prompt", payload.prompt);
    }

    if (payload.attachments?.length) {
      for (const file of payload.attachments) {
        formData.append("attachments", file);
      }
    }

    return this.request("/connection/send", {
      method: "POST",
      body: formData,
    });
  }
  async getConnections(): Promise<ApiResponse> {
    return this.request("/user/connections", {
      method: "GET",
    });
  }
  async uploadNote(payload: uploadNotePayload): Promise<ApiResponse> {
    return this.request("/upload/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
  async uploadCorpuses(payload: uploadCorpusPayload): Promise<ApiResponse> {
    const formData = new FormData();
    for (const file of payload.files) {
      formData.append("files", file);
    }
    return this.request("/upload/corpuses", {
      method: "POST",
      body: formData,
    });
  }
  async updateTFA(): Promise<ApiResponse> {
    return this.request("/user/update-tfa", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async updateProfile(payload: updateProfilePayload): Promise<ApiResponse> {
    return this.request("/user/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
  async updatePassword(payload: updatePasswordPayload): Promise<ApiResponse> {
    return this.request("/user/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
  async updateApiKey(payload: updateApiKeyPayload): Promise<ApiResponse> {
    return this.request("/user/update-apikey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
  async login(payload: LoginPayload): Promise<ApiResponse> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async verifySignupOtp(payload: VerifySignupOtpPayload): Promise<ApiResponse> {
    return this.request("/auth/verify-signup-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async verifyLoginOtp(payload: VerifyLoginOtpPayload): Promise<ApiResponse> {
    return this.request("/auth/verify-login-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  async refreshTokens(): Promise<ApiResponse> {
    return this.request("/auth/refresh-tokens", {
      method: "POST",
    });
  }
  async logout(): Promise<ApiResponse> {
    return this.request("/auth/logout", {
      method: "GET",
    });
  }
}

export const apiClient = new ApiClient();
