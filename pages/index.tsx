import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

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
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
      <InferenceComponent />
    </div>
  );
}

const InferenceComponent = () => {
  const [modelID, setModelID] = useState(
    "mistralai/Mixtral-8x7B-Instruct-v0.1"
  );
  const [text, setText] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post(
        "api/inference",
        { modelID, text },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setResponse(res.data);
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  return (
    <div>
      <h1>AI Inference</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Model ID:
            <input
              type="text"
              value={modelID}
              onChange={(e) => setModelID(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Text:
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default function Page() {
  return (
    <div style={{ padding: "20px", color: "white", backgroundColor: "black" }}>
      <Login />
      <UserInfo />
    </div>
  );
}
