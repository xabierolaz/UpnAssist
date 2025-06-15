// AIService.ts

export interface AIResponse {
  message: string;
  timestamp: Date;
  source?: 'ollama' | 'openrouter' | 'fallback';
  model?: string;
}

export class AIService {
  private apiUrl: string;
  private openRouterKey: string | null = null;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async sendMessage(message: string): Promise<AIResponse> {
    const response = await fetch(`${this.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.openRouterKey ? { 'Authorization': `Bearer ${this.openRouterKey}` } : {}),
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return {
      message: data.message,
      timestamp: new Date(data.timestamp),
    };
  }

  async getAvailableServices(): Promise<{ ollama: boolean; openrouter: boolean }> {
    const response = await fetch(`${this.apiUrl}/services`);
    if (!response.ok) {
      throw new Error('Failed to fetch available services');
    }
    return response.json();
  }

  setOpenRouterKey(key: string): void {
    this.openRouterKey = key;
  }

  clearContext(): void {
    this.openRouterKey = null;
  }
}
