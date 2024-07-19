import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface Keyword {
  text: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
  backendTokens: {
    accessToken: string;
  };
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
    company: string;
  };
  token: string;
}

interface CheckoutResponse {
  sessionId: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor(baseURL: string, token: string = '') {
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  setToken(token: string): void {
    this.api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  async createArticle(keyword: string): Promise<AxiosResponse> {
    return this.api.post('/article', { keyword: `"${keyword}"` });
  }

  async updateArticleTitle(articleId: string, subKeywords: string[]): Promise<AxiosResponse> {
    return this.api.patch(`/article/title/${articleId}`, { subkeywords: subKeywords });
  }

  async createCheckoutSession(planId: string) {
    const response = await this.api.post('/stripe/create-checkout-session', { planId });
    return response.data;
  }

  async configureArticle(articleId: string, finalTitle: string): Promise<AxiosResponse> {
    return this.api.post(`/article/config/${articleId}`, { title: finalTitle });
  }

  async getKeywords(): Promise<AxiosResponse> {
    return this.api.get('/keyword');
  }

  async getPlans(): Promise<AxiosResponse> {
    return this.api.get('/price-plan');
  }

  async generateKeywords(tags: Keyword[]): Promise<AxiosResponse> {
    return this.api.post('/keyword/generate', { keywords: tags.map(tag => tag.text) });
  }

  async login(email: string, password: string): Promise<AxiosResponse<LoginResponse>> {
    return this.api.post<LoginResponse>('/auth/login', { email, password });
  }

  async register(username: string, email: string, password: string, company: string): Promise<AxiosResponse<RegisterResponse>> {
    return this.api.post<RegisterResponse>('/auth/register', { username, email, password, company });
  }

  async createKeywords(selectedKeywordsArray: string[]): Promise<Keyword[]> {
    const response: AxiosResponse<Keyword[]> = await this.api.post('/keyword/create', {
      data: selectedKeywordsArray,
    });
    return response.data;
  }

  async verifyPayment(sessionId: string) {
    const response = await this.api.get(`/stripe/verify-session/${sessionId}`);
    return response.data;
  }
}

export default ApiService;
