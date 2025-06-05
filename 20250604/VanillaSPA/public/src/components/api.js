const API_URL = 'https://jsonplaceholder.typicode.com/';

export async function request(endpoint, limit) {
  try {
    const url = endpoint 
      ? `${API_URL}/${endpoint}${limit ? `?_limit=${limit}` : ''}`
      : API_URL;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    // 응답으로 서버에서 보내온 데이터가 JSON인지 체크
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      return data;
    }
    return await res.text();
  } catch (error) {
    console.error('API 에러:', error);
    return [];
  }
}

request();