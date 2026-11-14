
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("2つのパスワードが一致しません。");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上にしてください。");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!data.session) {
        throw new Error(
          "再設定用の認証情報が確認できません。メールのリンクからもう一度アクセスしてください。"
        );
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) throw updateError;

      setMessage("パスワードを変更しました。ログイン画面に移動します。");

      setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "パスワードの変更に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-icon">M</div>

        <h1>Money Manager</h1>

        <p className="login-description">
          新しいパスワードを設定してください。
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="password">新しいパスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6文字以上"
            autoComplete="new-password"
            minLength={6}
            required
          />

          <label htmlFor="confirmPassword">新しいパスワード（確認）</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="もう一度入力"
            autoComplete="new-password"
            minLength={6}
            required
          />

          {error && <p className="login-error">{error}</p>}

          {message && (
            <p className="login-message" role="status">
              {message}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "変更中..." : "パスワードを変更"}
          </button>
        </form>

        <p className="login-footer">
          Money Manager · Personal Finance
        </p>
      </section>
    </main>
  );
}
