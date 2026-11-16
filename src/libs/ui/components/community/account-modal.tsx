import { useState } from "react";
import { OAUTH_PROVIDERS } from "../../../core/community/user";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../base/button";
import { Modal } from "../base/modal";
import type { FC } from "react";
import type { OAuthProvider } from "../../../core/community/user";

const SignIn: FC = () => {
  const { signInWith } = useAuth();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const start = async (provider: OAuthProvider) => {
    setBusy(true);
    setError(undefined);
    try {
      await signInWith(provider);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-sm text-muted">
        Sign in to join the discussion on questions. We only keep your name.
      </p>
      {OAUTH_PROVIDERS.map(({ id, label }) => (
        <Button
          key={id}
          className="h-9"
          disabled={busy}
          onClick={() => start(id)}
        >
          Continue with {label}
        </Button>
      ))}
      {error && (
        <p role="alert" className="m-0 text-xs text-danger">
          {error}
        </p>
      )}
      {import.meta.env.DEV && (
        <p className="m-0 text-xs text-muted">
          Running locally? Pick a mock user at{" "}
          <a className="text-accent" href="/auth/impersonate">
            /auth/impersonate
          </a>
          .
        </p>
      )}
    </div>
  );
};

export const AccountModal: FC<{ onClose: () => void }> = ({ onClose }) => (
  <Modal title="Sign in" onClose={onClose}>
    <SignIn />
  </Modal>
);
