import PublicDiaryDetail from "../_components/public-diary-detail";

const PublicDiaryDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return <PublicDiaryDetail params={params} />;
};

export default PublicDiaryDetailPage;