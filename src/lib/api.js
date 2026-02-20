import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getUserProfile(userId) {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
}

export async function getUserFriendsById(userId) {
  const response = await axiosInstance.get(`/users/${userId}/friends`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

// ---- Arcade APIs ----

export async function getArcadeProfile() {
  const response = await axiosInstance.get("/arcade/profile");
  return response.data;
}

export async function submitTicTacToe(result) {
  const response = await axiosInstance.post("/arcade/tictactoe/result", { result });
  return response.data;
}

export async function submitRPS(playerChoice) {
  const response = await axiosInstance.post("/arcade/rps/result", { playerChoice });
  return response.data;
}

export async function submitTyping(userWPM) {
  const response = await axiosInstance.post("/arcade/typing/result", { userWPM });
  return response.data;
}

export async function spinWheel() {
  const response = await axiosInstance.post("/arcade/spin");
  return response.data;
}

export async function submitNumberGuess(attempts, won) {
  const response = await axiosInstance.post("/arcade/numberguess/result", { attempts, won });
  return response.data;
}

export async function submitMath(data) {
  const response = await axiosInstance.post("/arcade/math/result", data);
  return response.data;
}

export async function submitReaction(data) {
  const response = await axiosInstance.post("/arcade/reaction/result", data);
  return response.data;
}

export async function submitMemory(data) {
  const response = await axiosInstance.post("/arcade/memory/result", data);
  return response.data;
}

export async function getLeaderboard() {
  const response = await axiosInstance.get("/leaderboard");
  return response.data;
}

export async function getAvatarItems() {
  const response = await axiosInstance.get("/avatar/items");
  return response.data;
}

export async function unlockAvatarItem(itemId) {
  const response = await axiosInstance.post("/avatar/unlock", { itemId });
  return response.data;
}

export async function equipAvatarItem(itemId) {
  const response = await axiosInstance.post("/avatar/equip", { itemId });
  return response.data;
}

export async function getMyAvatar() {
  const response = await axiosInstance.get("/avatar/me");
  return response.data;
}
