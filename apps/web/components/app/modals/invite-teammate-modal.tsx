import useProject from "#/lib/swr/use-project";
import { BlurImage } from "@/components/shared/blur-image";
import { Button, Logo, Modal } from "@dub/ui";
import va from "@vercel/analytics";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";

function InviteTeammateModal({
  showInviteTeammateModal,
  setShowInviteTeammateModal,
}: {
  showInviteTeammateModal: boolean;
  setShowInviteTeammateModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const { logo } = useProject();

  return (
    <Modal
      showModal={showInviteTeammateModal}
      setShowModal={setShowInviteTeammateModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        {logo ? (
          <BlurImage
            src={logo}
            alt={"Invite Teammate"}
            className="h-10 w-10 rounded-full"
            width={20}
            height={20}
          />
        ) : (
          <Logo />
        )}
        <h3 className="text-lg font-medium">Invite Teammate</h3>
        <p className="text-center text-sm text-gray-500">
          Invite a teammate to join your project. Invitations will be valid for
          14 days.
        </p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setInviting(true);
          fetch(`/api/projects/${slug}/invites`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }).then(async (res) => {
            if (res.status === 200) {
              await mutate(`/api/projects/${slug}/invites`);
              toast.success("Invitation sent!");
              va.track("User invited teammate", {
                project: slug,
              });
              setShowInviteTeammateModal(false);
            } else {
              const error = await res.text();
              toast.error(error);
            }
            setInviting(false);
          });
        }}
        className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700">
            Email
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="panic@thedis.co"
              autoFocus
              autoComplete="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>
        </div>
        <Button loading={inviting} text="Send invite" />
      </form>
    </Modal>
  );
}

export function useInviteTeammateModal() {
  const [showInviteTeammateModal, setShowInviteTeammateModal] = useState(false);

  const InviteTeammateModalCallback = useCallback(() => {
    return (
      <InviteTeammateModal
        showInviteTeammateModal={showInviteTeammateModal}
        setShowInviteTeammateModal={setShowInviteTeammateModal}
      />
    );
  }, [showInviteTeammateModal, setShowInviteTeammateModal]);

  return useMemo(
    () => ({
      setShowInviteTeammateModal,
      InviteTeammateModal: InviteTeammateModalCallback,
    }),
    [setShowInviteTeammateModal, InviteTeammateModalCallback],
  );
}
