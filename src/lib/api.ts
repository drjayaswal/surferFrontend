"use client";

interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
}

interface GenerateOtpPayload {
  email: string;
}

interface uploadProfilePicPayload {
  file: File;
}
interface uploadCorpusPayload {
  files: File[];
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
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.SERVER || "http://localhost:4000/api";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const isFormData = options.body instanceof FormData;

      const headers: HeadersInit = isFormData
        ? { ...options.headers } // Let browser set Content-Type with boundary
        : {
            "Content-Type": "application/json",
            ...options.headers,
          };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        credentials: "include",
        headers,
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
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
  async updatePassword(payload: updatePasswordPayload): Promise<ApiResponse> {
    return this.request("/user/update-password", {
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
