import { useState, useCallback, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import axios from "axios";
import { supabase } from "@/utils/supabase";

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
  }
}

const SignIn = ({ setUser }: { setUser: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      const { data, error } = await signIn({ email, password });
      if (error) {
        console.error("Error signing in:", error.message);
      } else {
        setCookie("supabaseSession", data.session?.access_token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.session?.access_token}`;
      }
      setUser(data.user);
      setLoading(false);
    },
    [email, password, setUser]
  );

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Sign In"}
      </button>
    </form>
  );
};

const handleSignOut = async () => {
  await signOut();
  setCookie("supabaseSession", "");
};

const SignOut = () => {
  return <button onClick={handleSignOut}>Sign Out</button>;
};

async function inference(prompt: string, modelID: string, token: string) {
  try {
    const { data } = await axios.post(
      "/api/inference",
      {
        prompt,
        modelID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error:", error);
    return { output: "Error" };
  }
}

function Inference() {
  const [prompt, setPrompt] = useState("");
  const [modelID, setModelID] = useState(
    "mistralai/Mixtral-8x7B-Instruct-v0.1"
  );
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState();

  const handleInference = useCallback(async () => {
    setLoading(true);
    const token = getCookie("supabaseSession");

    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    const data = await inference(prompt, modelID, token);
    setOutput(data);
    setLoading(false);
  }, [prompt, modelID]);

  return (
    <div>
      <input
        type="text"
        placeholder="Prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Model"
        value={modelID}
        onChange={(e) => setModelID(e.target.value)}
      />

      <button onClick={handleInference} disabled={loading}>
        {loading ? "Loading..." : "Inference"}
      </button>
      <p>Output: {JSON.stringify(output)}</p>
    </div>
  );
}

function Home() {
  const [user, setUser] = useState(null) as any;

  useEffect(() => {
    const token = getCookie("supabaseSession");
    if (token) {
      supabase.auth.getUser(token).then(({ data, error }) => {
        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setUser(data.user);
        }
      });
    }
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <SignOut />
          <br />

          <h1>Welcome, {user.email}</h1>

          <br />

          <Inference />
        </div>
      ) : (
        <SignIn setUser={setUser} />
      )}
    </div>
  );
}

export default Home;
