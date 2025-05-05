import { getUserInfo } from '@/api/auth/usuaior';
import { UserInfo } from '@/api/auth/usuaior';

export async function handleGetUserInfo(userName: string): Promise<UserInfo | null> {
  try {
    const data = await getUserInfo(userName);
    return data;
  } catch {
    return null;
  }
}
