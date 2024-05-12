import { useState, useEffect } from "react";
import Cookies from "js-cookie";

async function login(username: string, password: string) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    // if token, set cookie
    if (data.token) Cookies.set("token", data.token);

    // if no token, return null
    if (!data.token) return null;

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  async function handleLogin() {
    const data = await login(username, password);
    setToken(data);
  }

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ backgroundColor: "black", color: "white" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ backgroundColor: "black", color: "white" }}
      />
      <button onClick={handleLogin}>Login</button>
      <pre>{JSON.stringify(token, null, 2)}</pre>
    </div>
  );
}

async function getUserInfo(token: string) {
  try {
    const res = await fetch("api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function handleGetUserInfo() {
      const token = Cookies.get("token");

      if (!token) {
        alert("No token found");
        return;
      }

      const data = await getUserInfo(token as string);
      setUserInfo(data);
    }

    handleGetUserInfo();
  }, []);
  console.log(userInfo);
  return (
    <div>
      <h1>User Info</h1>
      <pre>{JSON.stringify(userInfo, null, 2)}</pre>
    </div>
  );
}

export default function Page() {
  return (
    <div style={{ padding: "20px", color: "white", backgroundColor: "black" }}>
      <Login />
      <UserInfo />
    </div>
  );
}
