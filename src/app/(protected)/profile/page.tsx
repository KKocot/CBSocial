import Content from "./content";

export default async function Page() {
  // const session = await getServerSession(authOptions);
  // if (!session) redirect("/");
  // const queryClient = getQueryClient();
  // not working without passing headers to fetch from server components
  // i suggest start using next actions
  // but that would break integration with bot in current setup
  // await queryClient.ensureQueryData(profileQueryOptions(session.user.id));
  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <Content />
    // </HydrationBoundary>
  );
}
