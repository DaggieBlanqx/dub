import { UserProps } from "#/lib/types";
import { fetcher } from "@dub/utils";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function useUsers({ invites }: { invites?: boolean } = {}) {
  const router = useRouter();
  const { slug } = router.query as {
    slug: string;
  };

  const { data: users } = useSWR<UserProps[]>(
    slug &&
      (invites
        ? `/api/projects/${slug}/invites`
        : `/api/projects/${slug}/users`),
    fetcher,
  );

  return {
    users,
  };
}
