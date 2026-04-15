import axios from 'axios';

export async function getRepos(token: string) {
  const response = await axios.get('https://api.github.com/user/repos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      sort: 'updated',
      per_page: 100,
    },
  });
  return response.data;
}

export async function getRepo(fullName: string, token: string) {
  const response = await axios.get(`https://api.github.com/repos/${fullName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
