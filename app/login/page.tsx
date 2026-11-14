
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        router.replace("/");
        router.refresh();
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          router.replace("/");
          router.refresh();
          return;
        }

        setMessage(
          "登録を受け付けました。メールを確認して、アカウント登録を完了してください。"
        );
      }

      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

        if (error) throw error;

        setMessage(
          "パスワード再設定用のメールを送信しました。メールをご確認ください。"
        );
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || "処理に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  const titles = {
    login: "ログイン",
    signup: "新規登録",
    reset: "パスワードを再設定",
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-icon">M</div>

        <h1>Money Manager</h1>

        <p className="login-description">
          あなたのお金を、心地よく管理しましょう。
        </p>

        <h2>{titles[mode]}</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力"
            autoComplete="email"
            required
          />

          {mode !== "reset" && (
            <>
              <label htmlFor="password">パスワード</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                minLength={6}
                required
              />
            </>
          )}

          {error && <p className="login-error">{error}</p>}

          {message && (
            <p className="login-message" role="status">
              {message}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "処理中..." : titles[mode]}
          </button>
        </form>

        <div className="login-links">
          {mode === "login" && (
            <>
              <button type="button" onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}>
                新しいアカウントを作成
              </button>

              <button type="button" onClick={() => {
                setMode("reset");
                setError("");
                setMessage("");
              }}>
                パスワードを忘れた場合
              </button>
            </>
          )}

          {mode !== "login" && (
            <button type="button" onClick={() => {
              setMode("login");
              setError("");
              setMessage("");
            }}>
              ログイン画面に戻る
            </button>
          )}
        </div>

        <p className="login-footer">
          Money Manager · Personal Finance
        </p>
      </section>
    </main>
  );
}
